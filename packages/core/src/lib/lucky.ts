import { has, isExpectType } from '../utils/index'
import { version } from '../../package.json'
import { ConfigType, UserConfigType, ImgItemType, ImgType, Tuple } from '../types/index'
import { defineReactive } from '../observer'
import Watcher, { WatchOptType } from '../observer/watcher'

export default class Lucky {
  static version: string = version
  protected readonly version: string = version
  protected readonly config: ConfigType
  protected readonly ctx: CanvasRenderingContext2D
  protected htmlFontSize: number = 16
  protected rAF: Function = function () {}
  protected boxWidth: number = 0
  protected boxHeight: number = 0
  protected data: {
    width: string | number,
    height: string | number
  }

  /**
   * 公共构造器
   * @param config
   */
  constructor (
    config: string | HTMLDivElement | UserConfigType,
    data: {
      width: string | number,
      height: string | number
    }
  ) {
    // 兼容代码开始: 为了处理 v1.0.6 版本在这里传入了一个 dom
    if (typeof config === 'string') config = { el: config } as UserConfigType
    else if (config.nodeType === 1) config = { el: '', divElement: config } as UserConfigType
    // 这里先野蛮的处理, 等待后续优化, 对外暴露的类型是UserConfigType, 但内部期望是ConfigType
    config = config as UserConfigType
    this.config = config as ConfigType
    this.data = data
    // 开始初始化
    config.flag = 'MP-WX'
    // 获取 canvas 上下文
    if (config.canvasElement) {
      config.ctx = config.canvasElement.getContext('2d')!
    }
    this.ctx = config.ctx as CanvasRenderingContext2D
    // 初始化 window 方法
    this.initWindowFunction()
    // 如果最后得不到 canvas 上下文那就无法进行绘制
    if (!this.config.ctx) {
      console.error('无法获取到 CanvasContext2D')
    }
  }

  /**
   * 初始化组件大小/单位
   */
  protected resize(): void {
    this.config.beforeResize?.()
    // 拿到 config 即可设置 dpr
    this.setDpr()
    // 初始化宽高
    this.resetWidthAndHeight()
    // 根据 dpr 来缩放 canvas
    this.zoomCanvas()
  }

  /**
   * 初始化方法
   */
  protected initLucky () {
    this.resize()
    if (!this.boxWidth || !this.boxHeight) {
      return console.error('无法获取到宽度或高度')
    }
  }

  /**
   * 鼠标点击事件
   * @param e 事件参数
   */
  protected handleClick (e: MouseEvent): void {}

  // 清空画布
  public clearCanvas (): void {
    const [width, height] = [this.boxWidth, this.boxHeight]
    this.ctx.clearRect(-width, -height, width * 2, height * 2)
  }

  /**
   * 设备像素比
   * window 环境下自动获取, 其余环境手动传入
   */
  protected setDpr (): void {
    const { config } = this
    if (config.dpr) {
      // 优先使用 config 传入的 dpr
    } else if (window) {
      config.dpr = window.devicePixelRatio || 1
    } else if (!config.dpr) {
      console.error(config, '未传入 dpr 可能会导致绘制异常')
    }
  }

  /**
   * 重置盒子和canvas的宽高
   */
  private resetWidthAndHeight (): void {
    const { config, data } = this
    // 如果是浏览器环境并且存在盒子
    let boxWidth = 0, boxHeight = 0
    if (config.divElement) {
      boxWidth = config.divElement.offsetWidth
      boxHeight = config.divElement.offsetHeight
    }
    // 先从 data 里取宽高, 如果 config 上面没有, 就从 style 上面取
    this.boxWidth = this.getLength(data.width) || boxWidth
    this.boxHeight = this.getLength(data.height) || boxHeight
    // 重新把宽高赋给盒子
    if (config.divElement) {
      config.divElement.style.overflow = 'hidden'
      config.divElement.style.width = this.boxWidth + 'px'
      config.divElement.style.height = this.boxHeight + 'px'
    }
  }

  /**
   * 根据 dpr 缩放 canvas 并处理位移
   */
  protected zoomCanvas (): void {
    const { config, ctx } = this
    const { canvasElement, dpr } = config
    const [width, height] = [this.boxWidth * dpr, this.boxHeight * dpr]
    if (!canvasElement) return
    canvasElement.width = width
    canvasElement.height = height
    ctx.scale(dpr, dpr)
  }

  /**
   * 从 window 对象上获取一些方法
   */
  private initWindowFunction (): void {
    const { config } = this
    if (window) {
      this.rAF = window.requestAnimationFrame ||
        function (callback: Function) {
          window.setTimeout(callback, 1000 / 60)
        }
      config.setTimeout = window.setTimeout
      config.setInterval = window.setInterval
      config.clearTimeout = window.clearTimeout
      config.clearInterval = window.clearInterval
      return
    }
    if (config.rAF) {
      // 优先使用帧动画
      this.rAF = config.rAF
    } else if (config.setTimeout) {
      // 其次使用定时器
      const timeout = config.setTimeout
      this.rAF = (callback: Function): number => timeout(callback, 16.7)
    } else {
      // 如果config里面没有提供, 那就假设全局方法存在setTimeout
      this.rAF = (callback: Function): number => setTimeout(callback, 16.7)
    }
  }

  public isWeb () {
    return ['WEB', 'UNI-H5', 'TARO-H5'].includes(this.config.flag)
  }

  /**
   * 异步加载图片并返回图片的几何信息
   * @param src 图片路径
   * @param info 图片信息
   */
  protected loadImg (
    src: string,
    info: ImgItemType,
    resolveName = '$resolve'
  ): Promise<ImgType> {
    return new Promise((resolve, reject) => {
      if (!src) reject(`=> '${info.src}' 不能为空或不合法`)
      info[resolveName] = resolve
      info['$reject'] = reject
      return
    })
  }

  /**
   * 公共绘制图片的方法
   * @param imgObj 图片对象
   * @param rectInfo: [x轴位置, y轴位置, 渲染宽度, 渲染高度] 
   */
  protected drawImage(
    ctx: CanvasRenderingContext2D,
    imgObj: ImgType,
    ...rectInfo: [...Tuple<number, 4>, ...Partial<Tuple<number, 4>>]
  ): void {
    let drawImg = imgObj;
    const { dpr } = this.config
    const miniProgramOffCtx = (drawImg['canvas'] || drawImg).getContext?.('2d')
    if (miniProgramOffCtx && !this.isWeb()) {
      rectInfo = rectInfo.map(val => val! * dpr) as Tuple<number, 8>
      const temp = miniProgramOffCtx.getImageData(...rectInfo.slice(0, 4))
      ctx.putImageData(temp, ...(rectInfo.slice(4, 6) as Tuple<number, 2>))
    } else {
      if (rectInfo.length === 8) {
        rectInfo = rectInfo.map((val, index) => index < 4 ? val! * dpr : val) as Tuple<number, 8>
      }
      // 尝试捕获错误
      try {
        ctx.drawImage(drawImg, ...rectInfo as Tuple<number, 8>)
      } catch (err) {
        /**
         * TODO: safari浏览器下, init() 会出现奇怪的报错
         * IndexSizeError: The index is not in the allowed range
         * 但是这个报错并不影响实际的绘制, 目前先放一放, 等待有缘人
         */
        // console.log(err)
      }
    }
  }

  /**
   * 计算图片的渲染宽高
   * @param imgObj 图片标签元素
   * @param imgInfo 图片信息
   * @param maxWidth 最大宽度
   * @param maxHeight 最大高度
   * @return [渲染宽度, 渲染高度]
   */
  protected computedWidthAndHeight (
    imgObj: ImgType,
    imgInfo: ImgItemType,
    maxWidth: number,
    maxHeight: number
  ): [number, number] {
    // 根据配置的样式计算图片的真实宽高
    if (!imgInfo.width && !imgInfo.height) {
      // 如果没有配置宽高, 则使用图片本身的宽高
      return [imgObj.width, imgObj.height]
    } else if (imgInfo.width && !imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueWidth = this.getLength(imgInfo.width, maxWidth)
      // 那高度就随着宽度进行等比缩放
      return [trueWidth, imgObj.height * (trueWidth / imgObj.width)]
    } else if (!imgInfo.width && imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueHeight = this.getLength(imgInfo.height, maxHeight)
      // 那宽度就随着高度进行等比缩放
      return [imgObj.width * (trueHeight / imgObj.height), trueHeight]
    }
    // 如果宽度和高度都填写了, 就如实计算
    return [
      this.getLength(imgInfo.width, maxWidth),
      this.getLength(imgInfo.height, maxHeight)
    ]
  }

  /**
   * 转换单位
   * @param { string } value 将要转换的值
   * @param { number } denominator 分子
   * @return { number } 返回新的字符串
   */
  protected changeUnits (value: string, denominator = 1): number {
    const { config } = this
    return Number(value.replace(/^([-]*[0-9.]*)([a-z%]*)$/, (val, num, unit) => {
      const handleCssUnit: Record<string, (n: number) => number> = {
        '%': (n: number) => n * (denominator / 100),
        'px': (n: number) => n * 1,
        'rem': (n: number) => n * this.htmlFontSize,
        'vw': (n: number) => n / 100 * window.innerWidth,
      }
      const unitHandler = handleCssUnit[unit]
      if (unitHandler) return unitHandler(Number(num))
      // 如果找不到默认单位, 就交给外面处理
      const otherHandleCssUnit = config.handleCssUnit || config['unitFunc'];
      return otherHandleCssUnit ? otherHandleCssUnit(Number(num), unit) : Number(num)
    }))
  }

  /**
   * 获取长度
   * @param length 将要转换的长度
   * @param maxLength 最大长度
   * @return 返回长度
   */
  protected getLength (length: string | number | undefined, maxLength?: number): number {
    if (isExpectType(length, 'number')) return length as number
    if (isExpectType(length, 'string')) return this.changeUnits(length as string, maxLength)
    return 0
  }

  /**
   * 获取相对(居中)X坐标
   * @param width
   * @param col
   */
  protected getOffsetX (width: number, maxWidth: number = 0): number {
    return (maxWidth - width) / 2
  }

  /**
   * 添加一个新的响应式数据 (临时)
   * @param data 数据
   * @param key 属性
   * @param value 新值
   */
  public $set (data: object, key: string | number, value: any) {
    if (!data || typeof data !== 'object') return
    defineReactive(data, key, value)
  }

  /**
   * 添加一个属性计算 (临时)
   * @param data 源数据
   * @param key 属性名
   * @param callback 回调函数
   */
  protected $computed (data: object, key: string, callback: Function) {
    Object.defineProperty(data, key, {
      get: () => {
        return callback.call(this)
      }
    })
  }

  /**
   * 添加一个观察者 create user watcher
   * @param expr 表达式
   * @param handler 回调函数
   * @param watchOpt 配置参数
   * @return 卸载当前观察者的函数 (暂未返回)
   */
  protected $watch (
    expr: string | Function,
    handler: Function | WatchOptType,
    watchOpt: WatchOptType = {}
  ): Function {
    if (typeof handler === 'object') {
      watchOpt = handler
      handler = watchOpt.handler!
    }
    // 创建 user watcher
    const watcher = new Watcher(this, expr, handler, watchOpt)
    // 判断是否需要初始化时触发回调
    if (watchOpt.immediate) {
      handler.call(this, watcher.value)
    }
    // 返回一个卸载当前观察者的函数
    return function unWatchFn () {}
  }
}

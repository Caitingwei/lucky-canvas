type FontItemType = {
    text: string;
    top?: string | number;
    left?: string | number;
    fontColor?: string;
    fontSize?: string;
    fontStyle?: string;
    fontWeight?: string;
    lineHeight?: string;
};
type FontExtendType = {
    wordWrap?: boolean;
    lengthLimit?: string | number;
    lineClamp?: number;
};
type ImgType = HTMLImageElement | HTMLCanvasElement;
type ImgItemType = {
    src: string;
    top?: string | number;
    left?: string | number;
    width?: string;
    height?: string;
    formatter?: (img: ImgType) => ImgType;
    $resolve?: Function;
    $reject?: Function;
};
type BackgroundType = string;
type ConfigType = {
    nodeType?: number;
    flag: 'WEB' | 'MP-WX' | 'UNI-H5' | 'UNI-MP' | 'TARO-H5' | 'TARO-MP';
    el?: string;
    divElement?: HTMLDivElement;
    canvasElement?: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    dpr: number;
    handleCssUnit?: (num: number, unit: string) => number;
    rAF?: Function;
    setTimeout: Function;
    setInterval: Function;
    clearTimeout: Function;
    clearInterval: Function;
    beforeCreate?: Function;
    beforeResize?: Function;
    afterResize?: Function;
    beforeInit?: Function;
    afterInit?: Function;
    beforeDraw?: Function;
    afterDraw?: Function;
    afterStart?: Function;
};
type UserConfigType = Partial<ConfigType>;
type Tuple<T, Len extends number, Res extends T[] = []> = Res['length'] extends Len ? Res : Tuple<T, Len, [...Res, T]>;

interface WatchOptType {
    handler?: () => Function;
    immediate?: boolean;
    deep?: boolean;
}

declare class Lucky {
    static version: string;
    protected readonly version: string;
    protected readonly config: ConfigType;
    protected readonly ctx: CanvasRenderingContext2D;
    protected htmlFontSize: number;
    protected rAF: Function;
    protected boxWidth: number;
    protected boxHeight: number;
    protected data: {
        width: string | number;
        height: string | number;
    };
    /**
     * 公共构造器
     * @param config
     */
    constructor(config: string | HTMLDivElement | UserConfigType, data: {
        width: string | number;
        height: string | number;
    });
    /**
     * 初始化组件大小/单位
     */
    protected resize(): void;
    /**
     * 初始化方法
     */
    protected initLucky(): void;
    /**
     * 鼠标点击事件
     * @param e 事件参数
     */
    protected handleClick(e: MouseEvent): void;
    /**
     * 根标签的字体大小
     */
    protected setHTMLFontSize(): void;
    clearCanvas(): void;
    /**
     * 重置盒子和canvas的宽高
     */
    private resetWidthAndHeight;
    /**
     * 根据 dpr 缩放 canvas 并处理位移
     */
    protected zoomCanvas(): void;
    /**
     * 从 window 对象上获取一些方法
     */
    private initWindowFunction;
    /**
     * 异步加载图片并返回图片的几何信息
     * @param src 图片路径
     * @param info 图片信息
     */
    protected loadImg(src: string, info: ImgItemType, resolveName?: string): Promise<ImgType>;
    /**
     * 公共绘制图片的方法
     * @param imgObj 图片对象
     * @param rectInfo: [x轴位置, y轴位置, 渲染宽度, 渲染高度]
     */
    protected drawImage(ctx: CanvasRenderingContext2D, imgObj: ImgType, ...rectInfo: [...Tuple<number, 4>, ...Partial<Tuple<number, 4>>]): void;
    /**
     * 计算图片的渲染宽高
     * @param imgObj 图片标签元素
     * @param imgInfo 图片信息
     * @param maxWidth 最大宽度
     * @param maxHeight 最大高度
     * @return [渲染宽度, 渲染高度]
     */
    protected computedWidthAndHeight(imgObj: ImgType, imgInfo: ImgItemType, maxWidth: number, maxHeight: number): [number, number];
    /**
     * 转换单位
     * @param { string } value 将要转换的值
     * @param { number } denominator 分子
     * @return { number } 返回新的字符串
     */
    protected changeUnits(value: string, denominator?: number): number;
    /**
     * 获取长度
     * @param length 将要转换的长度
     * @param maxLength 最大长度
     * @return 返回长度
     */
    protected getLength(length: string | number | undefined, maxLength?: number): number;
    /**
     * 获取相对(居中)X坐标
     * @param width
     * @param col
     */
    protected getOffsetX(width: number, maxWidth?: number): number;
    /**
     * 添加一个新的响应式数据 (临时)
     * @param data 数据
     * @param key 属性
     * @param value 新值
     */
    $set(data: object, key: string | number, value: any): void;
    /**
     * 添加一个属性计算 (临时)
     * @param data 源数据
     * @param key 属性名
     * @param callback 回调函数
     */
    protected $computed(data: object, key: string, callback: Function): void;
    /**
     * 添加一个观察者 create user watcher
     * @param expr 表达式
     * @param handler 回调函数
     * @param watchOpt 配置参数
     * @return 卸载当前观察者的函数 (暂未返回)
     */
    protected $watch(expr: string | Function, handler: Function | WatchOptType, watchOpt?: WatchOptType): Function;
}

type PrizeFontType = FontItemType & FontExtendType;
type ButtonFontType = FontItemType & {};
type BlockImgType = ImgItemType & {
    rotate?: boolean;
};
type PrizeImgType = ImgItemType & {};
type ButtonImgType = ImgItemType & {};
type BlockType = {
    padding?: string;
    background?: BackgroundType;
    imgs?: Array<BlockImgType>;
};
type PrizeType = {
    range?: number;
    background?: BackgroundType;
    fonts?: Array<PrizeFontType>;
    imgs?: Array<PrizeImgType>;
};
type ButtonType = {
    radius?: string;
    pointer?: boolean;
    background?: BackgroundType;
    fonts?: Array<ButtonFontType>;
    imgs?: Array<ButtonImgType>;
};
type DefaultConfigType = {
    gutter?: string | number;
    offsetDegree?: number;
    speed?: number;
    speedFunction?: string;
    accelerationTime?: number;
    decelerationTime?: number;
    stopRange?: number;
};
type DefaultStyleType = {
    background?: BackgroundType;
    fontColor?: PrizeFontType['fontColor'];
    fontSize?: PrizeFontType['fontSize'];
    fontStyle?: PrizeFontType['fontStyle'];
    fontWeight?: PrizeFontType['fontWeight'];
    lineHeight?: PrizeFontType['lineHeight'];
    wordWrap?: PrizeFontType['wordWrap'];
    lengthLimit?: PrizeFontType['lengthLimit'];
    lineClamp?: PrizeFontType['lineClamp'];
};
type StartCallbackType = (e: MouseEvent) => void;
type EndCallbackType = (prize: object) => void;
interface LuckyWheelConfig {
    width: string | number;
    height: string | number;
    blocks?: Array<BlockType>;
    prizes?: Array<PrizeType>;
    buttons?: Array<ButtonType>;
    defaultConfig?: DefaultConfigType;
    defaultStyle?: DefaultStyleType;
    start?: StartCallbackType;
    end?: EndCallbackType;
}

declare class LuckyWheel extends Lucky {
    private blocks;
    private prizes;
    private buttons;
    private defaultConfig;
    private defaultStyle;
    private _defaultConfig;
    private _defaultStyle;
    private startCallback?;
    private endCallback?;
    private Radius;
    private prizeRadius;
    private prizeDeg;
    private prizeAng;
    private rotateDeg;
    private maxBtnRadius;
    private startTime;
    private endTime;
    private stopDeg;
    private endDeg;
    private FPS;
    /**
     * 游戏当前的阶段
     * step = 0 时, 游戏尚未开始
     * step = 1 时, 此时处于加速阶段
     * step = 2 时, 此时处于匀速阶段
     * step = 3 时, 此时处于减速阶段
     */
    private step;
    /**
     * 中奖索引
     * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
     * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
     * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
     */
    private prizeFlag;
    private ImageCache;
    /**
     * 大转盘构造器
     * @param config 配置项
     * @param data 抽奖数据
     */
    constructor(config: UserConfigType, data: LuckyWheelConfig);
    protected resize(): void;
    protected initLucky(): void;
    /**
     * 初始化数据
     * @param data
     */
    private initData;
    /**
     * 初始化属性计算
     */
    private initComputed;
    /**
     * 初始化观察者
     */
    private initWatch;
    /**
     * 初始化 canvas 抽奖
     */
    init(): Promise<void>;
    private initImageCache;
    /**
     * canvas点击事件
     * @param e 事件参数
     */
    protected handleClick(e: MouseEvent): void;
    /**
     * 根据索引单独加载指定图片并缓存
     * @param cellName 模块名称
     * @param cellIndex 模块索引
     * @param imgName 模块对应的图片缓存
     * @param imgIndex 图片索引
     */
    private loadAndCacheImg;
    private drawBlock;
    /**
     * 开始绘制
     */
    protected draw(): void;
    /**
     * 刻舟求剑
     */
    private carveOnGunwaleOfAMovingBoat;
    /**
     * 对外暴露: 开始抽奖方法
     */
    play(): void;
    /**
     * 对外暴露: 缓慢停止方法
     * @param index 中奖索引
     */
    stop(index?: number): void;
    /**
     * 实际开始执行方法
     * @param num 记录帧动画执行多少次
     */
    private run;
    /**
     * 换算渲染坐标
     * @param x
     * @param y
     */
    protected conversionAxis(x: number, y: number): [number, number];
}

export { LuckyWheel };

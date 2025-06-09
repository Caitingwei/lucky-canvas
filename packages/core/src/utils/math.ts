/**
 * 转换为运算角度
 * @param { number } deg 数学角度
 * @return { number } 运算角度
 */
export const getAngle = (deg: number): number => {
  return Math.PI / 180 * deg
}

/**
 * 根据角度计算圆上的点
 * @param { number } deg 运算角度
 * @param { number } r 半径
 * @return { Array<number> } 坐标[x, y]
 */
export const getArcPointerByDeg = (deg: number, r: number): [number, number] => {
  return [+(Math.cos(deg) * r).toFixed(8), +(Math.sin(deg) * r).toFixed(8)]
}

/**
 * 根据点计算切线方程
 * @param { number } x 横坐标
 * @param { number } y 纵坐标
 * @return { Array<number> } [斜率, 常数]
 */
export const getTangentByPointer = (x: number, y: number): Array<number> => {
  let k = - x / y
  let b = -k * x + y
  return [k, b]
}

// 使用 arc 绘制扇形
export const fanShapedByArc = (
  ctx: CanvasRenderingContext2D,
  minRadius: number,
  maxRadius: number,
  start: number,
  end: number,
  gutter: number,
): void => {
  ctx.beginPath()
  let maxGutter = getAngle(90 / Math.PI / maxRadius * gutter)
  let minGutter = getAngle(90 / Math.PI / minRadius * gutter)
  let maxStart = start + maxGutter
  let maxEnd = end - maxGutter
  let minStart = start + minGutter
  let minEnd = end - minGutter
  ctx.arc(0, 0, maxRadius, maxStart, maxEnd, false)
  // 如果 getter 比按钮短就绘制圆弧, 反之计算新的坐标点
  // if (minEnd > minStart) {
  //   ctx.arc(0, 0, minRadius, minEnd, minStart, true)
  // } else {
    ctx.lineTo(
      ...getArcPointerByDeg(
        (start + end) / 2,
        gutter / 2 / Math.abs(Math.sin((start - end) / 2))
      )
    )
  // }
  ctx.closePath()
}

// 使用 arc 绘制圆角矩形
export const roundRectByArc = (
  ctx: CanvasRenderingContext2D,
  ...[x, y, w, h, r]: number[]
) => {
  const min = Math.min(w, h), PI = Math.PI
  if (r > min / 2) r = min / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w - r, y + r, r, -PI / 2, 0)
  ctx.lineTo(x + w, y + h - r)
  ctx.arc(x + w - r, y + h - r, r, 0, PI / 2)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x + r, y + h - r, r, PI / 2, PI)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, PI, -PI / 2)
  ctx.closePath()
}
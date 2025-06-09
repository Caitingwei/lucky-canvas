/**
 * 缓动函数
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 * 
 * 感谢张鑫旭大佬 https://github.com/zhangxinxu/Tween
 */

interface SpeedType {
  easeIn: (...arr: number[]) => number
  easeOut: (...arr: number[]) => number
}

// 二次方的缓动
export const quad: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d
    return c * (t /= d) * t + b
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d
    return -c * (t /= d) * (t - 2) + b
  }
}
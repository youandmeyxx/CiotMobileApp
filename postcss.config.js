module.exports = {
    plugins: {
        'postcss-px-to-viewport': {
            unitToConvert: 'px', // 要转换的单位，默认为 px
            viewportWidth: 375, // 视口宽度，通常为设计稿的宽度
            unitPrecision: 5, // 转换后的精度，即小数点后的位数
            propList: ['*'], // 需要转换的属性列表，* 表示所有属性
            viewportUnit: 'vw', // 转换后的视口单位
            fontViewportUnit: 'vw', // 字体使用的视口单位
            selectorBlackList: [], // 不需要转换的选择器列表
            minPixelValue: 1, // 最小的转换像素值，小于该值不转换
            mediaQuery: false, // 是否在媒体查询中进行转换
            replace: true, // 是否直接替换原有的属性值
            exclude: undefined, // 排除不需要转换的文件路径
            include: undefined, // 包含需要转换的文件路径
            landscape: false, // 是否处理横屏情况
            landscapeUnit: 'vw', // 横屏时使用的视口单位
            landscapeWidth: 568 // 横屏时的视口宽度
        }
    }
};
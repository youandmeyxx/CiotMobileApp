declare module 'postcss-px-to-viewport' {
    import { Plugin } from 'postcss';

    interface Options {
        unitToConvert?: string;
        viewportWidth?: number;
        unitPrecision?: number;
        propList?: string[];
        viewportUnit?: string;
        fontViewportUnit?: string;
        selectorBlackList?: string[];
        minPixelValue?: number;
        mediaQuery?: boolean;
        replace?: boolean;
        exclude?: RegExp | RegExp[] | ((filePath: string) => boolean);
        include?: RegExp | RegExp[] | ((filePath: string) => boolean);
        landscape?: boolean;
        landscapeUnit?: string;
        landscapeWidth?: number;
    }

    const postcssPxToViewport: (options?: Options) => Plugin;
    export default postcssPxToViewport;
}
export interface NormalObject {
    [index: string]: any;
}
export declare const rule: RegExp;
declare const printf: (format: string | NormalObject, target: number) => string | number;
export default printf;

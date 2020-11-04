export declare type Conf = {
    align: 'left' | 'right';
    type: string;
    fill: string;
    prefix: string;
    digits: number;
    minWidth: number;
    hash: boolean;
    percent: boolean;
    string?: boolean;
};
export declare const rule: RegExp;
declare const _default: (format: string, num: number) => number | string;
export default _default;

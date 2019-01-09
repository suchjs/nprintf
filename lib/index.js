"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = /^%([#\-+0 ]*)?([1-9]\d*)?(?:\.(\d+))?([dfeEoxXi])(%)?$/;
if (typeof String.prototype.padStart !== 'function') {
    (function () {
        var pad = function (target, len, fill, start) {
            if (fill === void 0) { fill = ' '; }
            if (start === void 0) { start = true; }
            var curLen = target.length;
            if (curLen >= len || fill === '') {
                return target;
            }
            else {
                var fillStrLen = fill.length;
                var fillTotal = len - curLen;
                var repeatStr = '';
                while (fillTotal > fillStrLen) {
                    repeatStr += fill;
                    fillTotal -= fillStrLen;
                }
                repeatStr += fill.slice(0, fillTotal);
                return start ? repeatStr + target : target + repeatStr;
            }
        };
        String.prototype.padStart = function (len, fill) {
            if (fill === void 0) { fill = ''; }
            return pad(this, len, fill);
        };
        String.prototype.padEnd = function (len, fill) {
            if (fill === void 0) { fill = ''; }
            return pad(this, len, fill, false);
        };
    })();
}
var parse = function (format) {
    var match;
    if ((match = format.match(exports.rule)) !== null) {
        var conf = {
            align: 'right',
            type: '',
            fill: ' ',
            prefix: '',
            digits: 6,
            minWidth: 1,
            hash: false,
            percent: false,
        };
        var _ = match[0], flags = match[1], width = match[2], precision = match[3], type = match[4], percent = match[5];
        var isFloatType = ['f', 'e', 'E'].indexOf(type) > -1;
        if (precision !== undefined && !isFloatType) {
            throw new Error("the type of \"" + type + "\" should not have a percision width");
        }
        conf.type = type;
        conf.digits = precision !== undefined ? +precision : conf.digits;
        conf.minWidth = width !== undefined ? +width : conf.minWidth;
        conf.percent = percent === '%';
        if (flags !== undefined) {
            var segs = flags.split('');
            var seg = void 0;
            var exists = '';
            while ((seg = segs.shift()) !== undefined) {
                if (exists.indexOf(seg) > -1) {
                    throw new Error("repeated flag of (" + seg + ")");
                }
                else {
                    exists += seg;
                    switch (seg) {
                        case '+':
                            conf.prefix = '+';
                            break;
                        case ' ':
                            if (conf.prefix !== '+') {
                                conf.prefix = ' ';
                            }
                            break;
                        case '0':
                            if (conf.align !== 'left') {
                                conf.fill = '0';
                            }
                            break;
                        case '-':
                            conf.align = 'left';
                            conf.fill = ' ';
                            break;
                        case '#':
                            conf.hash = true;
                            break;
                    }
                }
            }
        }
        return conf;
    }
    else {
        throw new Error('wrong format param');
    }
};
var printf = function (format, target) {
    if (typeof target !== 'number') {
        throw new Error("the second param must be a number[" + target + "]");
    }
    var conf = typeof format === 'string' ? parse(format) : format;
    var result;
    var isFloatType = conf.type === 'f';
    if (Object.is(target, -0)) {
        conf.prefix = '-';
    }
    switch (conf.type) {
        case 'd':
        case 'i':
        case 'f':
            if (isFloatType) {
                var ep = Math.pow(10, conf.digits);
                result = Math.round(target * ep) / ep;
            }
            else {
                result = Math.round(target);
            }
            if (result < 0) {
                conf.prefix = '-';
                result = result.toString().slice(1);
            }
            else {
                result = result.toString();
            }
            if (isFloatType) {
                var segs = result.split('.');
                result = segs[0] + (conf.digits ? '.' + (segs[1] || '0').padEnd(conf.digits, '0') : '');
            }
            break;
        case 'o':
        case 'x':
        case 'X':
            result = target > 0 ? Math.floor(target) : Math.ceil(target);
            if (result < 0) {
                conf.prefix = '-';
            }
            if (conf.type === 'o') {
                result = Math.abs(result).toString(8);
                if (conf.hash) {
                    result = '0' + result;
                }
                else {
                    result = result.toString();
                }
            }
            else {
                result = Math.abs(result).toString(16);
                var isUpper = conf.type === 'X';
                if (conf.hash) {
                    conf.prefix += isUpper ? '0X' : '0x';
                }
                if (isUpper) {
                    result = result.toUpperCase();
                }
            }
            break;
        case 'e':
        case 'E':
            var e = Math.floor(Math.log10(target));
            var point = e.toString();
            if (e < 0) {
                if (e >= -9) {
                    point = '-0' + point.charAt(1);
                }
            }
            else {
                if (e <= 9) {
                    point = '0' + point;
                }
                point = '+' + point;
            }
            point = conf.type + point;
            return printf(Object.assign({}, conf, {
                type: 'f',
                minWidth: conf.minWidth - point.length,
                percent: false,
            }), target / Math.pow(10, e)) + point + (conf.percent ? '%' : '');
    }
    var width = conf.minWidth;
    var fn = conf.align === 'right' ? 'padStart' : 'padEnd';
    if (conf.fill === '0') {
        result = conf.prefix + result[fn](width - conf.prefix.length, conf.fill);
    }
    else {
        result = (conf.prefix + result)[fn](width, conf.fill);
    }
    if (conf.percent) {
        result += '%';
    }
    var nResult = Number(result);
    return !isNaN(nResult) && (nResult.toString() === result || result === '-0') ? nResult : result;
};
exports.default = printf;
//# sourceMappingURL=index.js.map
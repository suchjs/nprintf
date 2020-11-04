"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = /^%([-+#0 ]*)?([1-9]\d*)?(?:\.(\d+))?([dfeEoxXi])(%)?$/;
var parse = function (format) {
    var match = format.match(exports.rule);
    if (match === null) {
        throw new Error("Wrong formatting template: '" + format + "', should match the rule:" + exports.rule.toString());
    }
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
    var isFloatType = ['f', 'e', 'E'].includes(type);
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
            if (exists.includes(seg)) {
                throw new Error("Repeated flag of '" + seg + "' in '" + format + "'");
            }
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
    return conf;
};
var printf = function (format, target) {
    if (typeof target !== 'number') {
        throw new Error("The second param must be a number,got '" + target + "'");
    }
    var conf = typeof format === 'string' ? parse(format) : format;
    var isFloatType = conf.type === 'f';
    var isNegZero = Object.is(target, -0);
    var result;
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
            if (result < 0 || isNegZero) {
                conf.prefix = '-';
                result = result.toString().slice(1) || '0';
            }
            else {
                result = result.toString();
            }
            if (isFloatType) {
                var segs = result.split('.');
                var suffix = conf.digits
                    ? '.' + (segs[1] || '0').padEnd(conf.digits, '0')
                    : '';
                result = segs[0] + suffix;
                conf.string = suffix.slice(-1) === '0';
            }
            break;
        case 'o':
        case 'x':
        case 'X':
            var isOctal = conf.type === 'o';
            if (target < 0) {
                throw new Error("a negative number " + target + " can't format to " + (isOctal ? 'octal' : 'hex'));
            }
            conf.string = true;
            conf.prefix = '';
            result = Math.floor(target);
            if (isOctal) {
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
            if (target < 0) {
                throw new Error("a negative number " + target + " can't format to hex");
            }
            conf.string = true;
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
            var curConf = __assign(__assign({}, conf), { type: 'f', minWidth: conf.minWidth - point.length, percent: false });
            return {
                conf: curConf,
                result: printf(__assign({}, curConf), target / Math.pow(10, e)).result +
                    point +
                    (conf.percent ? '%' : ''),
            };
    }
    var width = conf.minWidth;
    var fn = conf.align === 'right' ? 'padStart' : 'padEnd';
    var needPad;
    if (conf.fill === '0') {
        var padLen = width - conf.prefix.length;
        var nowResult = result;
        result = conf.prefix + nowResult[fn](padLen, conf.fill);
        needPad = padLen - nowResult.length > 0;
    }
    else {
        var nowResult = conf.prefix + result;
        result = nowResult[fn](width, conf.fill);
        needPad = width - nowResult.length > 0;
    }
    conf.string =
        conf.string ||
            conf.prefix === '+' ||
            (conf.prefix === '-' && Number(result) === 0) ||
            needPad;
    if (conf.percent) {
        result += '%';
        conf.string = true;
    }
    return {
        result: result,
        conf: conf,
    };
};
exports.default = (function (format, num) {
    var _a = printf(format, num), conf = _a.conf, result = _a.result;
    return conf.string ? result : Number(result);
});
//# sourceMappingURL=index.js.map
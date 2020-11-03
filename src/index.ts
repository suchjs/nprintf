/*
 * wiki: https://en.wikipedia.org/wiki/Printf_format_string
 */
export type Conf = {
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
export const rule = /^%([-+#0 ]*)?([1-9]\d*)?(?:\.(\d+))?([dfeEoxXi])(%)?$/;
type ParseResult = {
  result: string;
  conf: Conf;
};
const parse = (format: string): Conf | never => {
  const match = format.match(rule);
  if (match === null) {
    throw new Error(
      `Wrong formatting template: '${format}', should match the rule:${rule.toString()}`,
    );
  }
  const conf: Conf = {
    align: 'right',
    type: '',
    fill: ' ',
    prefix: '',
    digits: 6,
    minWidth: 1,
    hash: false,
    percent: false,
  };
  const [_, flags, width, precision, type, percent] = match;
  const isFloatType = ['f', 'e', 'E'].includes(type);
  // eg:%.2d %.2o
  if (precision !== undefined && !isFloatType) {
    throw new Error(`the type of "${type}" should not have a percision width`);
  }
  conf.type = type;
  conf.digits = precision !== undefined ? +precision : conf.digits;
  conf.minWidth = width !== undefined ? +width : conf.minWidth;
  conf.percent = percent === '%';
  // parse flags
  if (flags !== undefined) {
    const segs = flags.split('');
    let seg;
    let exists = '';
    while ((seg = segs.shift()) !== undefined) {
      if (exists.includes(seg)) {
        throw new Error(`Repeated flag of '${seg}' in '${format}'`);
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
const printf = (format: string | Conf, target: number): ParseResult => {
  if (typeof target !== 'number') {
    throw new Error(`The second param must be a number,got '${target}'`);
  }
  const conf = typeof format === 'string' ? parse(format) : format;
  const isFloatType = conf.type === 'f';
  const isNegZero = Object.is(target, -0);
  let result: number | string;
  if (Object.is(target, -0)) {
    conf.prefix = '-';
  }
  switch (conf.type) {
    case 'd':
    case 'i':
    case 'f':
      if (isFloatType) {
        const ep = Math.pow(10, conf.digits);
        result = Math.round(target * ep) / ep;
      } else {
        result = Math.round(target);
      }
      if (result < 0 || isNegZero) {
        conf.prefix = '-';
        result = result.toString().slice(1) || '0';
      } else {
        result = result.toString();
      }
      if (isFloatType) {
        const segs = result.split('.');
        const suffix = conf.digits
          ? '.' + (segs[1] || '0').padEnd(conf.digits, '0')
          : '';
        result = segs[0] + suffix;
        conf.string = suffix.slice(-1) === '0';
      }
      break;
    case 'o':
    case 'x':
    case 'X':
      conf.string = true;
      result = target > 0 ? Math.floor(target) : Math.ceil(target);
      if (result < 0) {
        conf.prefix = '-';
      }
      if (conf.type === 'o') {
        result = Math.abs(result).toString(8);
        if (conf.hash) {
          result = '0' + result;
        } else {
          result = result.toString();
        }
      } else {
        result = Math.abs(result).toString(16);
        const isUpper = conf.type === 'X';
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
      conf.string = true;
      const e = Math.floor(Math.log10(target));
      let point = e.toString();
      if (e < 0) {
        if (e >= -9) {
          point = '-0' + point.charAt(1);
        }
      } else {
        if (e <= 9) {
          point = '0' + point;
        }
        point = '+' + point;
      }
      point = conf.type + point;
      const curConf: Conf = {
        ...conf,
        type: 'f',
        minWidth: conf.minWidth - point.length,
        percent: false,
      };
      return {
        conf: curConf,
        result:
          printf(
            {
              ...curConf,
            },
            target / Math.pow(10, e),
          ).result +
          point +
          (conf.percent ? '%' : ''),
      };
  }
  const width = conf.minWidth;
  const fn = conf.align === 'right' ? 'padStart' : 'padEnd';
  let needPad: boolean;
  if (conf.fill === '0') {
    const padLen = width - conf.prefix.length;
    const nowResult = result as string;
    result = conf.prefix + nowResult[fn](padLen, conf.fill);
    needPad = padLen - nowResult.length > 0;
  } else {
    const nowResult = conf.prefix + result;
    result = nowResult[fn](width, conf.fill);
    needPad = width - nowResult.length > 0;
  }
  conf.string = conf.string || conf.prefix === '+' || needPad;
  if (conf.percent) {
    result += '%';
    conf.string = true;
  }
  return {
    result,
    conf,
  };
};
export default (format: string, num: number): number | string => {
  const { conf, result } = printf(format, num);
  return conf.string ? result : Number(result);
};

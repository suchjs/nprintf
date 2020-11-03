# nprintf

[![npm version](https://badge.fury.io/js/nprintf.svg)](https://badge.fury.io/js/nprintf)&nbsp;&nbsp;[![Build Status](https://travis-ci.org/suchjs/nprintf.svg?branch=master)](https://travis-ci.org/suchjs/nprintf)

将一个数字格式化，转换方式和 c 语言的 printf 方法保持一致。

Format numbers like c printf.

## How to use

```bash
npm install --save nprintf
```

```javascript
import printf from 'nprintf';
console.log(printf('%.2f', 11)); // 11.00, type: string
console.log(printf('%.2f', 11.355)); // 11.36 type: number
```

## Attention

注意格式化模板需要符合以下正则，否则将抛出错误。

just support format rule like this. `/^%([#\-+0 ]*)?([1-9]\d*)?(?:\.(\d+))?([dfeEoxXi])(%)?$/`

## Questions & Bugs?

Welcome to report to us with issue if you meet any question or bug. [Issue](https://github.com/suchjs/nprintf/issues)

## License

[MIT License](./LICENSE).

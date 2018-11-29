# nprintf
[![npm version](https://badge.fury.io/js/nprintf.svg)](https://badge.fury.io/js/nprintf)&nbsp;&nbsp;[![Build Status](https://travis-ci.org/suchjs/nprintf.svg?branch=master)](https://travis-ci.org/suchjs/nprintf)

format numbers like c printf.

## How to use
```bash
npm install --save nprintf
```
```javascript
import printf from 'nprintf';
console.log(printf('%.2f',11)); // 11.00
```
## Attention
just support format rule like this. `/^%([#\-+0 ]*)?([1-9]\d*)?(?:\.(\d+))?([dfeEoxXi])(%)?$/`

## Questions & Bugs?
Welcome to report to us with issue if you meet any question or bug. [Issue](https://github.com/suchjs/nprintf/issues)

## License
[MIT License](./LICENSE).
import printf from '../src/index';

describe('Test all supported foramtting', () => {
  // throw
  test('test wrong params', () => {
    const wrongNumber: number = ('22.2' as unknown) as number;
    expect(() => printf('%a', wrongNumber)).toThrow();
    expect(() => printf('%a', 22.2)).toThrow();
    expect(() => printf('%.2d', 22.2)).toThrow();
    expect(() => printf('%#++d', 22.2)).toThrow();
  });

  // integers
  test('test integer', () => {
    expect(printf('%d', 22.2)).toEqual(22);
    expect(printf('%i', 22.2)).toEqual(22);
    expect(printf('% i', 22.2)).toEqual(22);
    expect(printf('%2d', 22.55)).toEqual(23);
    expect(printf('%2d%', 22.55)).toEqual('23%');
    expect(printf('%3d', 22.55)).toEqual(' 23');
    expect(printf('%+3d', 22.55)).toEqual('+23');
    expect(printf('%d', -0)).toEqual('-0');
    expect(printf('%05d', 22.2)).toEqual('00022');
    expect(printf('%+05d', 22.2)).toEqual('+0022');
    expect(printf('%05d', -22.2)).toEqual('-0022');
    expect(printf('%5d', -22.2)).toEqual('  -22');
  });

  // floats
  test('test float', () => {
    expect(printf('%f', 22.2)).toEqual((22.2).toFixed(6));
    expect(printf('%.0f', 22.2)).toEqual(22);
    expect(printf('% f', 22.2)).toEqual(' 22.200000');
    expect(printf('% .2f', 22.2)).toEqual(' 22.20');
    expect(printf('%.0f', 22.5)).toEqual(23);
    expect(printf('%.05f', 22.5)).toEqual((22.5).toFixed(5));
    expect(printf('%.2f', 22.2)).toEqual((22.2).toFixed(2));
    expect(printf('%+.2f', 22.2)).toEqual('+22.20');
    expect(printf('%+7.2f', 22.2)).toEqual(' +22.20');
    expect(printf('%+07.2f', 22.2)).toEqual('+022.20');
    expect(printf('%-07.2f', 22.2)).toEqual('22.20  ');
    expect(printf('%6.2f', 22.2)).toEqual(' 22.20');
    expect(printf('%06.2f', 22.2)).toEqual('022.20');
  });

  // octal,hex
  test('test octal,hex', () => {
    // octal
    expect(printf('%o', 10)).toEqual('12');
    expect(() => printf('%o', -10)).toThrow();
    expect(printf('%#o', 10)).toEqual('012');
    expect(printf('%5o', 10)).toEqual('   12');
    expect(printf('%#5o', 10)).toEqual('  012');
    expect(printf('%#+5o', 10)).toEqual('  012');
    // hex
    expect(printf('%x', 10)).toEqual('a');
    expect(() => printf('%x', -10)).toThrow();
    expect(printf('%#x', 10)).toEqual('0xa');
    expect(printf('%5x', 10)).toEqual('    a');
    expect(printf('%05x', 10)).toEqual('0000a');
    expect(printf('%#5x', 10)).toEqual('  0xa');
    expect(printf('%#+5x', 10)).toEqual('  0xa');
    expect(printf('%#+5X', 10)).toEqual('  0XA');
    expect(printf('%#05X', 10)).toEqual('0X00A');
  });

  // exponentiation
  test('test exponentiation', () => {
    expect(printf('%06.2e', 22.2)).toEqual('2.22e+01');
    expect(printf('%09.2e', 22.2)).toEqual('02.22e+01');
    expect(printf('%09.2E', 22.2)).toEqual('02.22E+01');
    expect(() => printf('%09.2e', -22.2)).toThrow();
    expect(printf('%09.2e', 0.00222)).toEqual('02.22e-03');
    expect(printf('%09.2E', 0.00222)).toEqual('02.22E-03');
  });
});

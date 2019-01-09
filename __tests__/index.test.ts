import printf from '../src/index';

test('test printf', () => {
  expect(printf('%d', 22.2)).toBe(22);
  expect(printf('%d', -0)).toBe(-0);
  expect(printf('%.0f', 22.2)).toBe(22);
  expect(printf('%05d', 22.2)).toBe('00022');
  expect(printf('%f', 22.2)).toBe('22.200000');
  expect(printf('%.2f', 22.2)).toBe('22.20');
  expect(printf('%+.2f', 22.2)).toBe('+22.20');
  expect(printf('%+7.2f', 22.2)).toBe(' +22.20');
  expect(printf('%+07.2f', 22.2)).toBe('+022.20');
  expect(printf('%-07.2f', 22.2)).toBe('22.20  ');
  expect(printf('%6.2f', 22.2)).toBe(' 22.20');
  expect(printf('%06.2f', 22.2)).toBe('022.20');
  expect(printf('%06.2e', 22.2)).toBe('2.22e+01');
  expect(printf('%09.2e', 22.2)).toBe('02.22e+01');
});

import printf from '../src/index';

test('test printf', () => {
  expect(printf('%d', 22.2)).toEqual(22);
  expect(printf('%d', -0)).toEqual(-0);
  expect(printf('%.0f', 22.2)).toEqual(22);
  expect(printf('%05d', 22.2)).toEqual('00022');
  expect(printf('%f', 22.2)).toEqual(22.2.toFixed(6));
  expect(printf('%.2f', 22.2)).toEqual(22.2.toFixed(2));
  expect(printf('%+.2f', 22.2)).toEqual('+22.20');
  expect(printf('%+7.2f', 22.2)).toEqual(' +22.20');
  expect(printf('%+07.2f', 22.2)).toEqual('+022.20');
  expect(printf('%-07.2f', 22.2)).toEqual('22.20  ');
  expect(printf('%6.2f', 22.2)).toEqual(' 22.20');
  expect(printf('%06.2f', 22.2)).toEqual('022.20');
  expect(printf('%06.2e', 22.2)).toEqual('2.22e+01');
  expect(printf('%09.2e', 22.2)).toEqual('02.22e+01');
});

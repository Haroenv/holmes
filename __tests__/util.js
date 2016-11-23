import {mergeObj} from '../js/util.js';


describe('utils', () => {
  test('mergeObj doesn\'t work when one of both isn\'t an object.', () => {
    let first = {};
    let second = 'string';
    function merge() {
      mergeObj(first, second);
    }
    expect(merge).toThrowError('One of both arguments isn\'t an object.');
  });
});

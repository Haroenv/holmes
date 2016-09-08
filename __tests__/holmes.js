const fs = require('fs');
const stub = fs.readFileSync('./__tests__/stub.html').toString();
document.body.innerHTML = stub;

const Holmes = require('../js/holmes.js');


describe('Instance-less usage', () => {
  test('throws without options', () => {
    try {
      Holmes();
    } catch (e) {
      expect(e.message).toBe('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
    }
  });

  test('doesn\'t throw with .find given', () => {
    Holmes({
      find: '.result'
    })
  });
});

describe('options', () => {
  // test(".visible on initialisation", function() {
  //   const find = '.result'
  //   Holmes({
  //     find,
  //     class: {
  //       visible: 'visible'
  //     }
  //   });

  //   const all = document.querySelectorAll(find);
  //   const visible = document.querySelectorAll(find+'.visible');

  //   expect(all).toEqual(visible);
  // });

  // ...
})

describe('Usage with instance', () => {
  test('Initialisation works', () => {
    var _h = new Holmes({
      find: '.result'
    });
  });

  // test('.clear() empties the input and shows everything', () => {

  // });

  // test('.stop() stops reacting to input', () => {

  // });

  // test('.start() after .stop() resumes normal activity', () => {

  // });

  describe('.count()', () => {

    // test('before input', () => {

    // });

    // test('updates on input', () => {

    // });

  });
});

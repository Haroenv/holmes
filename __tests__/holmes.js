const fs = require('fs');
const stub = fs.readFileSync('./__tests__/stub.html').toString();
document.body.innerHTML = stub;

const Holmes = require('../js/holmes.js');

/**
 * Enter a string into this Holmes input
 * @param  {string} text text to input
 * @return {Promise}     resolves when the input has been doen
 */
function input(text) {
  const holmesInput = document.getElementById('search');
  return new Promise((resolve, reject) => {
    holmesInput.value = text;
    holmesInput.dispatchEvent(new Event('input'));
    resolve('input dispatched.');
  });
}

describe('Instance-less usage', () => {
  test('throws without options', () => {
    function init() {
      Holmes();
    }

    expect(init).toThrowError('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
  });

  test('doesn\'t throw with .find given', () => {
    Holmes({
      find: '.result'
    })
  });
});

describe('options', () => {
  test('.visible on initialisation', () => {
    const find = '.result'
    Holmes({
      find,
      instant: true,
        class: {
          visible: 'visible'
        }
    });

    const all = document.querySelectorAll(find);
    const visible = document.querySelectorAll(find + '.visible');

    expect(all).toEqual(visible);
  });

  describe('.placeholder', () => {
    test('gets added', () => {
      Holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.innerHTML).toEqual('test');
    });

    test('initially hidden', () => {
      Holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.classList.contains('hidden')).toBe(true);
    });

    test('not hidden when no results', () => {
      Holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      return input('definitely not in the list').then(() => {
        expect(placeholder.classList.contains('hidden')).toBe(false);
      });
    });
  });
})

describe('Usage with instance', () => {
  test('Initialisation works', () => {
    const _h = new Holmes({
      find: '.result'
    });

    expect(_h).toBeDefined();
  });

  test('.clear() empties the input and shows everything', () => {
    const _h = new Holmes({
      find: '.result',
      instant: true
    });

    console.log(_h.running);
  });

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

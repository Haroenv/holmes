const fs = require('fs');

const Holmes = require('../js/holmes.js');

/**
 * Set the html stub
 */
const stub = fs.readFileSync('./__tests__/stub.html').toString();

function setStub() {
  document.body.innerHTML = stub;
}

/**
 * Enter a string into this Holmes input
 * @param  {string} text text to input
 * @return {Promise}     resolves when the input has been doen
 */
function input(text) {
  const holmesInput = document.getElementById('search');
  return new Promise((resolve, reject) => {
    if (holmesInput instanceof HTMLInputElement) {
      holmesInput.value = text;
    } else if (holmesInput.contentEditable) {
      holmesInput.textContent = text;
    } else {
      reject('no valid input');
    }
    holmesInput.dispatchEvent(new Event('input'));
    resolve('input dispatched.');
  });
}

describe('Instance-less usage', () => {
  test('throws without options', () => {
    setStub();

    function init() {
      Holmes();
    }

    expect(init).toThrowError('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
  });

  test('throws without .find', () => {
    setStub();

    function init() {
      Holmes({});
    }

    expect(init).toThrowError('A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like: \nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
  });

  test('doesn\'t throw with .find given', () => {
    setStub();
    Holmes({
      find: '.result'
    });
  });

  // test('works with contenteditable', () => {
  //   setStub();
  //   Holmes({
  //     find: '.result',
  //     input: '#contenteditable',
  //     class: {
  //       visible: 'visible'
  //     }
  //   });

  //   input('special');

  //   const special = document.getElementById('contains-special');
  //   const notSpecial = document.querySelectorAll('.result:not(#contains-special)');
  //   const notSpecialHidden = document.querySelectorAll('.result:not(#contains-special)' + '.hidden');

  //   expect(special.classList.contains('visible')).toEqual(true);
  //   expect(notSpecial).toEqual(notSpecialHidden);
  // });
});

describe('options', () => {
  test('.visible on initialisation', () => {
    setStub();
    const find = '.result';
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

  // test('.minCharacters', () => {
  //   setStub();
  // });
  // test('.mark', () => {
  //   setStub();
  // });

  describe('callbacks', () => {
    // test('onHidden', () => {
    //   setStub();
    // });
    // test('onVisible', () => {
    //   setStub();
    // });
    // test('onEmpty', () => {
    //   setStub();
    // });
    // test('onFound', () => {
    //   setStub();
    // });
    // test('onInput', () => {
    //   setStub();
    // });
  });

  describe('.placeholder', () => {
    setStub();
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
      setStub();
      Holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.classList.contains('hidden')).toBe(true);
    });

    test('not hidden when no results', () => {
      setStub();
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
    setStub();
    const _h = new Holmes({
      find: '.result'
    });

    expect(_h).toBeDefined();
  });

  test('.clear() empties the input and shows everything', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      instant: true,
      class: {
        visible: 'visible'
      }
    });

    input('something');

    _h.clear();

    expect(document.getElementById('search').value).toBe('');

    const all = document.querySelectorAll('.result');
    const visible = document.querySelectorAll('.result' + '.visible');

    expect(all).toEqual(visible);

  });

  test('.stop() stops reacting to input', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      instant: true,
      class: {
        visible: 'visible'
      }
    });

    _h.stop();

    input('something');

    const all = document.querySelectorAll('.result');
    const visible = document.querySelectorAll('.result' + '.visible');

    expect(all).toEqual(visible);
  });

  test('.start() after .stop() resumes normal activity', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      instant: true,
      class: {
        visible: 'visible'
      }
    });

    const special = document.getElementById('contains-special');
    const notSpecial = document.querySelectorAll('.result:not(#contains-special)');
    let notSpecialHidden = document.querySelectorAll('.result:not(#contains-special)' + '.hidden');
    let notSpecialVisible = document.querySelectorAll('.result:not(#contains-special)' + '.visible');

    _h.stop();

    input('special');

    expect(special.classList.contains('visible')).toEqual(true);
    notSpecialHidden = document.querySelectorAll('.result:not(#contains-special)' + '.hidden');
    notSpecialVisible = document.querySelectorAll('.result:not(#contains-special)' + '.visible');
    expect(notSpecial).toEqual(notSpecialVisible);

    _h.start();

    input('special');

    expect(special.classList.contains('visible')).toEqual(true);
    notSpecialHidden = document.querySelectorAll('.result:not(#contains-special)' + '.hidden');
    notSpecialVisible = document.querySelectorAll('.result:not(#contains-special)' + '.visible');
    expect(notSpecial).toEqual(notSpecialHidden);

  });

  describe('.count()', () => {

    test('before input', () => {
      setStub();
      const _h = new Holmes({
        find: '.result',
        instant: true
      });

      expect(_h.count()).toEqual({
        all: 50,
        hidden: 0,
        visible: 50
      });
    });

    test('updates on input', () => {
      setStub();
      const _h = new Holmes({
        find: '.result',
        instant: true
      });

      input('special');

      expect(_h.count()).toEqual({
        all: 50,
        hidden: 49,
        visible: 1
      });
    });

  });
});

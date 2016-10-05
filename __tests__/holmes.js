/* eslint-env node, jest */
const fs = require('fs');

const Holmes = require('../js/holmes.js');
const holmes = Holmes;

/**
 * Set the html stub
 */
const stub = fs.readFileSync('./__tests__/stub.html').toString();

function setStub() {
  document.body.innerHTML = stub;
}

/**
 * Enter a string into this Holmes input
 * @param  {string}      text text to input
 * @param  {HTMLElement} element to input in (optional)
 * @return {Promise}     resolves when the input has been doen
 */
function input(text, input) {
  let holmesInput = document.getElementById('search');
  if (input) {
    holmesInput = input;
  }
  return new Promise(resolve => {
    if (holmesInput instanceof HTMLInputElement) {
      holmesInput.value = text;
    } else {
      holmesInput.textContent = text;
    }
    holmesInput.dispatchEvent(new Event('input'));
    resolve('input dispatched.');
  });
}

describe('Instance-less usage', () => {
  test('throws without options', () => {
    setStub();

    function init() {
      holmes();
    }

    expect(init).toThrowError('The options need to be given inside an object like this:\nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
  });

  test('throws without .find', () => {
    setStub();

    function init() {
      holmes({});
    }

    expect(init).toThrowError('A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like: \nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');
  });

  test('doesn\'t throw with .find given', () => {
    setStub();
    holmes({
      find: '.result'
    });
  });

  // test('throws when .input you can\'t type in is given', () => {
  //   setStub();
  //   function init() {
  //     const qs = '.result';
  //     holmes({
  //       find: '.result',
  //       input: qs
  //     });
  //
  //     input('bla', document.querySelector(qs));
  //   }
  //
  //   expect(init).toThrowError('The Holmes input was no <input> or contenteditable.');
  // });

  // test('works with contenteditable', () => {
  //   setStub();
  //   holmes({
  //     find: '.result',
  //     input: '#contenteditable',
  //     class: {
  //       visible: 'visible'
  //     }
  //   });
  //
  //   input('special');
  //
  //   const special = document.getElementById('contains-special');
  //   const notSpecial = document.querySelectorAll('.result:not(#contains-special)');
  //   const notSpecialHidden = document.querySelectorAll('.result:not(#contains-special)' + '.hidden');
  //
  //   expect(special.classList.contains('visible')).toEqual(true);
  //   expect(notSpecial).toEqual(notSpecialHidden);
  // });
});

describe('options', () => {
  test('.visible on initialisation', () => {
    setStub();
    const find = '.result';
    holmes({
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

  describe('.minCharacters', () => {
    test('less than minimum amount doesn\'t make anything happen', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        instant: true,
        minCharacters: 5,
        class: {
          visible: 'visible'
        }
      });
      // some short input that's surely not in the data
      input('qsdf');

      const all = document.querySelectorAll(find);
      const visible = document.querySelectorAll(find + '.visible');

      expect(all).toEqual(visible);
    });

    test('over minimum does make things happen', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        instant: true,
        minCharacters: 5,
        class: {
          visible: 'visible'
        }
      });

      // some short input that's surely not in the data
      input('qsdfg');

      const all = document.querySelectorAll(find);
      const hidden = document.querySelectorAll(find + '.hidden');

      expect(all).toEqual(hidden);
    });
  });

  describe('.mark', () => {
    // test('adds mark around a matching word', () => {
    //   setStub();
    //   const find = '.result';
    //   holmes({
    //     find,
    //     mark: true
    //   });
    //
    //   return input('special').then(()=>{
    //     const specialContent = document.getElementById('contains-special').innerHTML;
    //     expect(specialContent).toContain('<mark>special</mark>');
    //   });
    //
    // });
    // test('removes all of the <mark>s when there are no matches', () => {
    //   setStub();
    // });
  });

  describe('callbacks', () => {
    test('inInput', () => {
      setStub();
      const callback = jest.fn();
      const _h = new Holmes({
        find: '.result',
        inInput: callback
      });
      return input('some text that hides a lot').then(() => {
        console.log(_h.options);
        expect(callback).toBeCalled();
      });
    });
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
      holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.innerHTML).toEqual('test');
    });

    test('can\'t be added when there\'s no parent of the elements', () => {
      function start() {
        holmes({
          find: 'html',
          instant: true,
          placeholder: 'impossible'
        });
      }
      expect(start).toThrowError('The Holmes placeholder could\'t be put; the elements had no parent.');
    });

    test('initially hidden', () => {
      setStub();
      holmes({
        find: '.result',
        instant: true,
        placeholder: 'test'
      });

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.classList.contains('hidden')).toBe(true);
    });

    test('not hidden when no results', () => {
      setStub();
      holmes({
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
});

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
    const result = '.result';
    const _h = new Holmes({
      find: result,
      instant: true,
      class: {
        visible: 'visible'
      }
    });

    input('something');

    _h.clear();

    expect(document.getElementById('search').value).toBe('');

    const all = document.querySelectorAll(result);
    const visible = document.querySelectorAll(result + '.visible');

    expect(all).toEqual(visible);
  });

  test('.stop() stops reacting to input', () => {
    setStub();
    const result = '.result';
    const _h = new Holmes({
      find: result,
      instant: true,
      class: {
        visible: 'visible'
      }
    });

    _h.stop();

    input('something');

    const all = document.querySelectorAll(result);
    const visible = document.querySelectorAll(result + '.visible');

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
    let notSpecialHidden = document.querySelectorAll('.result:not(#contains-special).hidden');
    let notSpecialVisible = document.querySelectorAll('.result:not(#contains-special).visible');

    _h.stop();

    input('special');

    expect(special.classList.contains('visible')).toEqual(true);
    notSpecialHidden = document.querySelectorAll('.result:not(#contains-special).hidden');
    notSpecialVisible = document.querySelectorAll('.result:not(#contains-special).visible');
    expect(notSpecial).toEqual(notSpecialVisible);

    _h.start();

    input('special');

    expect(special.classList.contains('visible')).toEqual(true);
    notSpecialHidden = document.querySelectorAll('.result:not(#contains-special).hidden');
    notSpecialVisible = document.querySelectorAll('.result:not(#contains-special).visible');
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

describe('meta tests', () => {
  test('_mergeObj doesn\'t work when one of both isn\'t an object.', () => {
    const _h = new Holmes({find: '.result'});
    let first = {};
    let second = 'string';
    function merge() {
      _h._mergeObj(first, second);
    }
    expect(merge).toThrowError('One of both arguments isn\'t an object.');
  });
});

/* eslint-env node, jest */
const fs = require('fs');

import holmes from '../js/main.js';
const Holmes = holmes; // Capital >:(

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
 * @return {Promise}     resolves when the input has been done
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
    expect(init).toThrowError(
      `The options need to be given inside an object like this:

new Holmes({
  find:".result"
});

see also https://haroen.me/holmes/doc/holmes.html`
    );
  });

  test('throws without .find', () => {
    setStub();

    function init() {
      holmes({});
    }
    expect(init)
      .toThrowError(`A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:

new Holmes({
  find:".result"
});

see also https://haroen.me/holmes/doc/holmes.html`);
  });

  test('throws when you edit .find to be invalid', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      instant: true
    });

    _h.stop().then(() => {
      _h.options.find = false; // Not a string, so not a querySelectorAll
      expect(_h.start).toThrowError(
        `A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:

new Holmes({
  find:".result"
});

see also https://haroen.me/holmes/doc/holmes.html`
      );
    });
  });

  test("doesn't throw with .find given", () => {
    setStub();
    holmes({
      find: '.result'
    });
  });

  test("Throws when you try an input that doesn't exist", () => {
    function init() {
      setStub();
      holmes({
        find: '.result',
        input: 'meme-container' // Will not exist
      }).start();
    }
    expect(init).toThrowError("Your Holmes.input didn't match a querySelector");
  });

  test.skip("throws when .input you can't type in is given", () => {
    setStub();
    function init() {
      const qs = '.result';
      holmes({
        find: '.result',
        instant: true,
        input: qs
      }).start();

      input('bla', document.querySelector(qs));
    }
    expect(init).toThrowError(
      'The Holmes input was no <input> or contenteditable.'
    );
  });

  test('works with contenteditable', () => {
    setStub();
    holmes({
      find: '.result',
      input: '#contenteditable',
      class: {
        visible: 'visible'
      }
    }).start();

    return input(
      'special',
      document.getElementById('contenteditable')
    ).then(() => {
      const special = document.getElementById('contains-special');
      const notSpecial = document.querySelectorAll(
        '.result:not(#contains-special)'
      );
      const notSpecialHidden = document.querySelectorAll('.result');
      expect(special.classList.contains('visible')).toEqual(true);
      expect(notSpecial.length + 1).toEqual(notSpecialHidden.length);
    });
  });
});

describe('options', () => {
  test('defaults are set', () => {
    const _h = new Holmes({
      find: 'something'
    });
    expect(_h.options).toMatchSnapshot();
  });

  test('.visible on initialisation', () => {
    setStub();
    const find = '.result';
    holmes({
      find,
      class: {
        visible: 'visible'
      }
    }).start();

    const all = document.querySelectorAll(find);
    const visible = document.querySelectorAll(find + '.visible');

    expect(all).toEqual(visible);
  });

  describe('.hiddenAttr', () => {
    test('hidden gets added', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        hiddenAttr: true
      }).start();

      return input('Some text that will hide everything!').then(() => {
        expect(document.querySelector(find).hidden).toBe(true);
      });
    });

    test('default false', () => {
      setStub();
      const find = '.result';
      holmes({
        find
      }).start();

      return input('Some text that will hide everything!').then(() => {
        expect(document.querySelector(find).hidden).toBe(false);
      });
    });

    test("false doesn't add the attribute", () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        hiddenAttr: false
      }).start();

      return input('Some text that will hide everything!').then(() => {
        expect(document.querySelector(find).hidden).toBe(false);
      });
    });

    test('hidden gets removed after the fact', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        hiddenAttr: true
      }).start();

      return input('Some text that will hide everything!')
        .then(input('special'))
        .then(() => {
          const special = document.getElementById('contains-special');
          expect(special.hidden).toBe(false);
        });
    });
  });

  describe('.minCharacters', () => {
    test("less than minimum amount doesn't make anything happen", () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        minCharacters: 5,
        class: {
          visible: 'visible'
        }
      }).start();

      // Some short input that's surely not in the data
      return input('qsdf').then(() => {
        const all = document.querySelectorAll(find);
        const visible = document.querySelectorAll(find + '.visible');

        expect(all).toEqual(visible);
      });
    });

    test('over minimum does make things happen', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        minCharacters: 5,
        class: {
          visible: 'visible'
        }
      }).start();

      // Some short input that's surely not in the data
      return input('qsdfg').then(() => {
        const all = document.querySelectorAll(find);
        const hidden = document.querySelectorAll(find + '.hidden');
        expect(hidden.length).toEqual(all.length);
      });
    });
  });

  describe('.mark', () => {
    test('adds mark around a matching word', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        mark: true
      }).start();

      return input('special').then(() => {
        const specialContent = document.getElementById('contains-special')
          .innerHTML;
        expect(specialContent).toContain('<mark>special</mark>');
      });
    });

    test('removes all of the <mark>s when there are no matches', () => {
      setStub();
      const find = '.result';
      holmes({
        find,
        mark: true
      }).start();

      return input('special')
        .then(() => {
          // Input empty, this will remove all <mark>s
          return input('');
        })
        .then(() => {
          const allContent = document.querySelector('ul').innerHTML;
          expect(allContent).not.toContain('<mark>');
          expect(allContent).not.toContain('</mark>');
        });
    });
  });

  describe('callbacks', () => {
    test('onInput', () => {
      setStub();
      const callback = jest.fn();
      holmes({
        find: '.result',
        onInput: callback
      }).start();

      return input('some text that hides a lot').then(() => {
        expect(callback).toBeCalled();
      });
    });
    test('onVisible', () => {
      setStub();
      const callback = jest.fn();
      holmes({
        find: '.result',
        onVisible: callback
      }).start();

      return input('some text that hides a lot')
        .then(() => {
          // Clears the input and makes everything visible
          input('');
        })
        .then(() => {
          expect(callback).toBeCalled();
        });
    });
    test('onHidden', () => {
      setStub();
      const callback = jest.fn();
      holmes({
        find: '.result',
        onHidden: callback
      }).start();

      return input('some text that hides a lot').then(() => {
        expect(callback).toBeCalled();
      });
    });
    test('onEmpty', () => {
      setStub();
      const callback = jest.fn();
      holmes({
        find: '.result',
        onEmpty: callback
      }).start();

      return input('some text that hides everything').then(() => {
        expect(callback).toBeCalled();
      });
    });
    test('onFound', () => {
      setStub();
      const callback = jest.fn();
      holmes({
        find: '.result',
        onFound: callback
      }).start();

      return input('some text that hides everything')
        .then(() => {
          // Clears the input and makes everything visible
          return input('');
        })
        .then(() => {
          expect(callback).toBeCalled();
        });
    });
  });

  describe('.placeholder', () => {
    test('gets added', () => {
      setStub();
      holmes({
        find: '.result',
        placeholder: 'test'
      }).start();

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.innerHTML).toEqual('test');
    });

    test("can't be added when there's no parent of the elements", () => {
      setStub();
      function start() {
        holmes({
          find: 'html',
          placeholder: 'impossible'
        }).start();
      }
      expect(start).toThrowError(
        `The Holmes placeholder couldn't be put; the elements had no parent.`
      );
    });

    test('initially hidden', () => {
      setStub();
      holmes({
        find: '.result',
        placeholder: 'test'
      }).start();

      const placeholder = document.getElementById('holmes-placeholder');

      expect(placeholder.classList.contains('hidden')).toBe(true);
    });

    test('not hidden when no results', () => {
      setStub();
      holmes({
        find: '.result',
        placeholder: 'test'
      }).start();

      return input(
        'some input which is definitely not in the list'
      ).then(() => {
        const placeholder = document.getElementById('holmes-placeholder');
        expect(placeholder.classList.contains('hidden')).toBe(false);
      });
    });
  });

  test.skip('.shouldShow which hides everything', () => {
    setStub();
    holmes({
      shouldShow(t, v) {
        console.log(t, v);
        return false;
      },
      class: {
        visible: 'visible',
        hidden: 'hidden'
      },
      find: '.result'
    });

    return input(' ').then(() => {
      const results = document.querySelectorAll('.result');
      results.forEach(el => {
        expect(el.classList.contains('hidden')).toBe(true);
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

  test('starts on DOMContentLoaded', () => {
    setStub();

    const _h = new Holmes({
      find: '.result'
    });

    const mockStart = jest.fn();

    _h.start = mockStart;

    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(DOMContentLoadedEvent);

    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  // Figure out how to get the last output of a jest.fn()
  describe('.minCharacters', () => {
    test.skip('less than minimum amount returns undefined', () => {
      setStub();
      const find = '.result';
      const _h = new Holmes({
        find,
        minCharacters: 5
      });
      _h.start();
      _h._inputHandler = jest.fn();
      console.log(_h._inputHandler.mock.calls);
      // Some short input that's surely not in the data
      return input('qsdf').then(() => {
        // Somehow this should be the last return value of ._inputHandler
        const calls = _h._inputHandler.mock.calls;
        expect(calls[calls.length]).toBeUndefined();
      });
    });
  });

  describe('.clear()', () => {
    test('empties the input', () => {
      setStub();
      const result = '.result';
      const _h = new Holmes({
        find: result,
        class: {
          visible: 'visible'
        }
      });
      _h.start();

      input('something');

      _h.clear();

      expect(document.getElementById('search').value).toBe('');
    });

    test('shows all items', () => {
      setStub();
      const result = '.result';
      const _h = new Holmes({
        find: result,
        class: {
          visible: 'visible'
        }
      });
      _h.start();

      input('something');

      _h.clear();

      const all = document.querySelectorAll(result);
      const visible = document.querySelectorAll(result + '.visible');

      expect(all).toEqual(visible);
    });

    test('hides placeholder', () => {
      setStub();
      const result = '.result';
      const _h = new Holmes({
        find: result,
        class: {
          visible: 'visible'
        },
        placeholder: 'test holder'
      });
      _h.start();

      input('bla bla');
      _h._hideElement = jest.fn();
      _h.clear();
      expect(_h._hideElement).toHaveBeenLastCalledWith(_h.placeholderNode);
    });
  });

  describe('.stop()', () => {
    test('stops reacting to input', () => {
      setStub();
      const result = '.result';
      const _h = new Holmes({
        find: result,
        class: {
          visible: 'visible'
        }
      });
      _h.start();

      _h.stop();

      return input('something').then(() => {
        const all = document.querySelectorAll(result);
        const visible = document.querySelectorAll(result + '.visible');

        expect(all).toEqual(visible);
      });
    });

    test('removes placeholder', () => {
      setStub();
      const result = '.result';
      const _h = new Holmes({
        find: result,
        class: {
          visible: 'visible'
        },
        placeholder: 'nice holder 👌'
      });
      _h.start();
      let placeholder = document.getElementById('holmes-placeholder');
      expect(placeholder.innerHTML).toBe('nice holder 👌');
      _h.stop();
      let placeholderNew = document.getElementById('holmes-placeholder');
      expect(placeholderNew).toBeNull();
    });
    test('removes marks', () => {
      setStub();
      const _h = new Holmes({
        find: '.result',
        mark: true
      });
      _h.start();
      return _h.stop().then(() => {
        const allContent = document.querySelector('ul').innerHTML;
        expect(allContent).not.toContain('<mark>');
        expect(allContent).not.toContain('</mark>');
      });
    });
  });
  test('.start() after .stop() resumes normal activity', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      class: {
        visible: 'visible'
      }
    });
    _h.start();
    const special = document.getElementById('contains-special');
    const notSpecial = document.querySelectorAll(
      '.result:not(#contains-special)'
    );
    let notSpecialHidden = document.querySelectorAll(
      '.result:not(#contains-special).hidden'
    );
    let notSpecialVisible = document.querySelectorAll(
      '.result:not(#contains-special).visible'
    );
    _h.stop();
    return input('special')
      .then(() => {
        expect(special.classList.contains('visible')).toEqual(true);
        notSpecialHidden = document.querySelectorAll(
          '.result:not(#contains-special).hidden'
        );
        notSpecialVisible = document.querySelectorAll(
          '.result:not(#contains-special).visible'
        );
        expect(notSpecial.length).toEqual(notSpecialVisible.length);
        _h.start();
        return input('special');
      })
      .then(() => {
        expect(special.classList.contains('visible')).toEqual(true);
        notSpecialHidden = document.querySelectorAll(
          '.result:not(#contains-special).hidden'
        );
        notSpecialVisible = document.querySelectorAll(
          '.result:not(#contains-special).visible'
        );
        expect(notSpecialHidden.length).toEqual(notSpecial.length);
      });
  });
  describe('.count()', () => {
    test('before input', () => {
      setStub();
      const _h = new Holmes({
        find: '.result'
      });
      _h.start();
      expect(_h.count()).toEqual({
        all: 50,
        hidden: 0,
        visible: 50
      });
    });
    test('updates on input', () => {
      setStub();
      const _h = new Holmes({
        find: '.result'
      });
      _h.start();
      input('special');
      expect(_h.count()).toEqual({
        all: 50,
        hidden: 49,
        visible: 1
      });
    });
  });
  describe('.placeholder', () => {
    test('gets hidden when there are results', () => {
      const _h = new Holmes({
        find: '.result',
        placeholder: 'test'
      });
      _h.start();
      _h._hideElement = jest.fn();
      input('all-hiding input string').then(input('special')).then(() => {
        expect(_h._hideElement).toHaveBeenLastCalledWith(_h.placeholderNode);
      });
    });
  });
  describe('options.dynamic', () => {
    function addEl() {
      const ul = document.querySelector('ul');
      const el = document.createElement('li');
      el.innerHTML = 'test';
      el.classList.add('result');
      ul.insertBefore(el, null);
    }
    test('this.elementsLength gets edited', () => {
      setStub();
      const find = '.result';
      const _h = new Holmes({
        find,
        dynamic: true
      });
      _h.start();
      const l = _h.elementsLength;
      addEl();
      return input(' ').then(() => {
        expect(_h.elementsLength).toBe(l + 1);
      });
    });
    test('this.elements gets edited', () => {
      setStub();
      const find = '.result';
      const _h = new Holmes({
        find,
        dynamic: true
      });
      _h.start();
      const l = _h.elements.length;
      addEl();
      return input(' ').then(() => {
        expect(_h.elements.length).toBe(l + 1);
      });
    });
    test('this.elementsArray gets edited', () => {
      setStub();
      const find = '.result';
      const _h = new Holmes({
        find,
        dynamic: true
      });
      _h.start();
      const l = _h.elementsArray.length;
      addEl();
      return input(' ').then(() => {
        expect(_h.elementsArray.length).toBe(l + 1);
      });
    });
  });
  // Skipped because jsDom doesn't implement contenteditable
  test.skip('input of a contenteditable is valid', () => {
    setStub();
    const _h = new Holmes({
      find: '.result',
      input: '#contenteditable'
    });
    _h.start();
    const text = 'something';
    return input(text, document.getElementById('contenteditable')).then(() => {
      expect(_h.inputString()).toEqual(text);
    });
  });
});

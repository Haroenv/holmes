// @flow
import {toFactory, stringIncludes} from './util.js';
import type {OptionsType} from './types.js';

/**
 * Callback used for changes in item en list states.
 * @callback onChange
 * @param {object} [HTMLElement]
 *   Element affected by the event. This is the item found by
 *   <code>onVisible</code> and <code>onHidden</code> and the placeholder
 *   (or <code>undefined</code>) for <code>onEmpty</code> and
 *   <code>onFound</code>.
 * @memberOf holmes
 */
/**
 * Callback used for changes in input value
 * @callback onInput
 * @param {string} input The value that is currently in the search field
 * @memberOf holmes
 */
/**
 * @alias holmes
 */
class Holmes {
  options: OptionsType;
  elements: NodeList<HTMLElement>;
  elementsArray: Array<HTMLElement>;
  elementsLength: number;
  hidden: number;
  input: HTMLElement;
  running: boolean;
  placeholderNode: HTMLElement;
  searchString: string;
  _regex: RegExp;
  _inputHandler: EventListener;

  /**
   * search for dom elements on your page
   *
   * For legacy reasons, this class is a <code>function</code>, and thus doesn't have a capital
   * You can fix this by using <code>var Holmes = holmes</code> before doing <code>new Holmes</code>.
   *
   * @class holmes
   * @constructor
   * @param {string} [options.input='input[type=search]']
   *   A <code>querySelector</code> to find the <code>input</code>
   * @param {string} options.find
   *   A <code>querySelectorAll</code> rule to find each of the find terms
   * @param {string=} options.placeholder
   *   Text to show when there are no results (innerHTML)
   * @param {bool} [options.mark=false]
   *   Whether to <code>&lt;mark&gt;&lt;/mark&gt;</code> the matching text
   *   Text to show when there are no results (<code>innerHTML</code>)
   * @param {string} [options.class.visible=false]
   *   class to add to matched items
   * @param {string} [options.class.hidden='hidden']
   *   class to add to non-matched items
   * @param {boolean} [options.dynamic=false]
   *   Whether to query for the content of the elements on every input.
   *   If this is <code>false</code>, then only when initializing the script will
   *   fetch the content of the elements to search in. If this is <code>true</code>
   *   then it will refresh on every <code>input</code> event.
   * @param {boolean} [options.contenteditable=false]
   *   DEPRECATED (now handled automatically) whether the input is a contenteditable or
   *   not. By default it's assumed that it's <code>&lt;input&gt;</code>, <code>true</code> here
   *   will use <code>&lt;div contenteditable&gt;</code>
   * @param {boolean} [options.instant=false]
   *   DEPRECATED!!, after v1.13.3 use <code>holmes({}).start();</code> instead
   *   By default Holmes waits for the <code>DOMContentLoaded</code> event to fire
   *   before listening. This is to make sure that all content is available. However
   *   if you exactly know when all your content is available (ajax, your own event or
   *   other situations), you can put this option on <code>true</code>.
   * @param {number} [options.minCharacters=0] The minimum amount of characters to be typed before
   *   Holmes starts searching. Beware that this also counts when backspacing.
   * @param {boolean} [options.hiddenAttr=true]
   *   Adds <code>hidden="true"</code> to hidden elements. interesting
   *   <a href="https://www.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/">
   *   link</a> explaining its use.
   * @param {onChange} [options.onHidden]
   *   Callback for when an item is hidden.
   * @param {onChange} [options.onVisible]
   *   Callback for when an item is visible again.
   * @param {onChange} [options.onEmpty]
   *   Callback for when no items were found.
   * @param {onChange} [options.onFound]
   *   Callback for when items are found after being empty.
   * @param {onInput} [options.onInput]
   *   Callback for every input.
   */
  constructor(options: OptionsType) {
    let empty: boolean = false;

    if (typeof options !== 'object') {
      throw new Error(
        'The options need to be given inside an object like this:\nnew Holmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/holmes.html'
      );
    }

    // if this.options.find is missing, the searching won't work so we'll thrown an exceptions
    if (typeof options.find !== 'string') {
      throw new Error(
        'A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like: \nnew Holmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/holmes.html'
      );
    }

    const defaults = {
      input: 'input[type=search]',
      find: '',
      placeholder: undefined,
      mark: false,
      class: {
        visible: undefined,
        hidden: 'hidden'
      },
      dynamic: false,
      minCharacters: 0,
      hiddenAttr: false,
      onHidden: undefined,
      onVisible: undefined,
      onEmpty: undefined,
      onFound: undefined,
      onInput: undefined
    };

    /**
     * @member options
     * @type {Object}
     * @memberOf holmes
     */
    this.options = Object.assign({}, defaults, options);
    this.options.class = Object.assign({}, defaults.class, options.class);

    /**
     * The amount of elements that are hidden
     * @member hidden
     * @type {Number}
     * @memberOf holmes
     */
    this.hidden = 0;

    /**
     * The input element
     * @member input
     * @type {NodeList}
     * @memberOf holmes
     */
    /**
     * All of the elements that are searched
     * @member elements
     * @type {NodeList}
     * @memberOf holmes
     */
    /**
     * Placeholder element
     * @member placeholderNode
     * @type {Element}
     * @memberOf holmes
     */
    /**
     * Is the current instance running
     * @member running
     * @memberOf holmes
     * @type {Boolean}
     */
    this.running = false;

    window.addEventListener('DOMContentLoaded', () => {
      this.start();
    });

    /**
     * input event handler
     * @function _inputHandler
     * @memberOf holmes
     * @private
     */
    this._inputHandler = () => {
      // input has started to be listened to
      this.running = true;

      // by default the value isn't found
      let found: boolean = false;

      /**
       * Lowercase string holmes searces for
       * @member searchString
       * @memberOf holmes
       * @type {string}
       */
      this.searchString = this.inputString();

      // if a minimum of characters is required
      // check if that limit has been reached
      if (this.options.minCharacters) {
        if (this.searchString.length !== 0) {
          if (this.options.minCharacters > this.searchString.length) {
            return undefined;
          }
        }
      }

      // if the dynamic option is enabled, then we should query
      // for the contents of `elements` on every input
      if (this.options.dynamic) {
        this.elements = document.querySelectorAll(this.options.find);
        this.elementsLength = this.elements.length;
        this.elementsArray = Array.prototype.slice.call(this.elements);
      }

      if (this.options.mark) {
        /**
         * Regex to remove <mark>
         * @member _regex
         * @memberOf holmes
         * @private
         * @type {RegExp}
         */
        this._regex = new RegExp(`(${this.searchString})(?![^<]*>)`, 'gi');
      }

      // loop over all the elements
      this.elementsArray.forEach((element: HTMLElement) => {
        // if the current element doesn't contain the search string
        // add the hidden class and remove the visbible class
        if (stringIncludes(element.textContent.toLowerCase(), this.searchString)) {
          this._showElement(element);

          if (empty && typeof this.options.onFound === 'function') {
            this.options.onFound(this.placeholderNode);
          }
          // the element is now found at least once
          found = true;
        } else {
          this._hideElement(element);
        }
      });

      if (typeof this.options.onInput === 'function') {
        this.options.onInput(this.searchString);
      }

      // No results were found and last time we checked it wasn't empty
      if (found) {
        if (this.options.placeholder) {
          this._hideElement(this.placeholderNode);
        }
      } else {
        if (this.options.placeholder) {
          this._showElement(this.placeholderNode);
        }

        // empty means that there are no results
        // if the situation isn't yet empty
        // so it's the first time seeing the placeholder
        // we'll emit the onEmpty function
        if (empty === false) {
          empty = true;
          if (typeof this.options.onEmpty === 'function') {
            this.options.onEmpty(this.placeholderNode);
          }
        }
      }
    };
  }

  /**
   * hide an element
   * @function _hideElement
   * @param  {HTMLElement} element the element to hide
   * @memberOf holmes
   * @private
   */
  _hideElement(element: HTMLElement) {
    if (this.options.class.visible) {
      element.classList.remove(this.options.class.visible);
    }
    if (!element.classList.contains(this.options.class.hidden)) {
      element.classList.add(this.options.class.hidden);
      this.hidden++;

      if (typeof this.options.onHidden === 'function') {
        this.options.onHidden(element);
      }
    }
    if (this.options.hiddenAttr) {
      element.setAttribute('hidden', 'true');
    }
    if (this.options.mark) {
      element.innerHTML = element.innerHTML.replace(/<\/?mark>/g, '');
    }
  }

  /**
   * show an element
   * @function _showElement
   * @param  {HTMLElement} element the element to show
   * @memberOf holmes
   * @private
   */
  _showElement(element: HTMLElement) {
    if (this.options.class.visible) {
      element.classList.add(this.options.class.visible);
    }
    if (element.classList.contains(this.options.class.hidden)) {
      element.classList.remove(this.options.class.hidden);
      this.hidden--;

      if (typeof this.options.onVisible === 'function') {
        this.options.onVisible(element);
      }
    }
    if (this.options.hiddenAttr) {
      element.removeAttribute('hidden');
    }

    // if we need to mark it:
    // remove all <mark> tags
    // add new <mark> tags around the text
    if (this.options.mark) {
      element.innerHTML = element.innerHTML.replace(/<\/?mark>/g, '');
      if (this.searchString.length) {
        element.innerHTML = element.innerHTML.replace(
          this._regex,
          '<mark>$1</mark>'
        );
      }
    }
  }

  /**
   * The current search input in lower case
   * @function inputString
   * @return {String} the input as a string
   * @throws {Error} If The current <code>input</code> is no <code>&lt;input&gt;</code> or <code>contenteditable</code>
   * @memberOf holmes
   */
  inputString(): string {
    if (this.input instanceof HTMLInputElement) {
      return this.input.value.toLowerCase();
    }
    if (this.input.contentEditable) {
      return this.input.textContent.toLowerCase();
    }
    throw new Error('The Holmes input was no <input> or contenteditable.');
  }

  /**
   * Sets an input string
   * @function setInput
   * @param {string} value the string to set
   * @throws {Error} If The current <code>input</code> is no <code>&lt;input&gt;</code> or <code>contenteditable</code>
   * @memberOf holmes
   */
  setInput(value: string) {
    if (this.input instanceof HTMLInputElement) {
      this.input.value = value;
    } else if (this.input.contentEditable) {
      this.input.textContent = value;
    } else {
      throw new Error('The Holmes input was no <input> or contenteditable.');
    }
  }

  /**
   * Start an event listener with the specified options
   * @function start
   * @throws {Error} If a there was no options.find
   * @throws {Error} If the placeholder couldn't be inserted
   * @throws {Error} If the .input isn't valid
   * @memberOf holmes
   */
  start() {
    const _input = document.querySelector(this.options.input);
    if (_input instanceof HTMLElement) {
      this.input = _input;
    } else {
      throw new Error('Your Holmes.input didn\'t match a querySelector');
    }

    if (typeof this.options.find === 'string') {
      this.elements = document.querySelectorAll(this.options.find);
    } else {
      throw new Error(
        'A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:\nnew Holmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/holmes.html'
      );
    }

    /**
     * amount of elements to search
     * @member elementsLength
     * @type {Number}
     * @memberOf holmes
     */
    this.elementsLength = this.elements.length;

    /**
     * all of the elements that are searched as an array
     * @member elementsArray
     * @type {Array}
     * @memberOf holmes
     */
    this.elementsArray = Array.prototype.slice.call(this.elements);
    this.hidden = 0;

    // create a container for a placeholder if needed
    if (this.options.placeholder) {
      this.placeholderNode = document.createElement('div');
      this.placeholderNode.id = 'holmes-placeholder';
      this._hideElement(this.placeholderNode);
      this.placeholderNode.innerHTML = this.options.placeholder;
      if (this.elements[0].parentNode instanceof Element) {
        this.elements[0].parentNode.appendChild(this.placeholderNode);
      } else {
        throw new Error(
          'The Holmes placeholder could\'t be put; the elements had no parent.'
        );
      }
    }

    // if a visible class is given, give it to everything
    if (this.options.class.visible) {
      const vis: string = this.options.class.visible;
      this.elementsArray.forEach((element: HTMLElement) => {
        element.classList.add(vis);
      });
    }

    // listen for input
    this.input.addEventListener('input', this._inputHandler);
  }

  /**
   * remove the current event listener
   * @function stop
   * @see this.start
   * @return {Promise} resolves when the event is removed
   * @throws {Error} If the placeholder couldn't be removed because it has no parent
   * @memberOf holmes
   */
  stop(): Promise<*> {
    return new Promise((resolve: *, reject: *) => {
      try {
        this.input.removeEventListener('input', this._inputHandler);

        // remove placeholderNode
        if (this.options.placeholder) {
          if (this.placeholderNode.parentNode) {
            this.placeholderNode.parentNode.removeChild(this.placeholderNode);
          } else {
            throw new Error('The Holmes placeholderNode has no parent.');
          }
        }

        // remove marks
        if (this.options.mark) {
          this.elementsArray.forEach((element: HTMLElement) => {
            element.innerHTML = element.innerHTML.replace(/<\/?mark>/g, '');
          });
        }

        // done
        this.running = false;
        resolve('This instance of Holmes has been stopped.');
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * empty the search string programmatically.
   * This avoids having to send a new `input` event
   * @function clear
   * @memberOf holmes
   */
  clear() {
    this.setInput('');

    this.elementsArray.forEach((element: HTMLElement) => {
      this._showElement(element);
    });

    if (this.options.placeholder) {
      this._hideElement(this.placeholderNode);
    }

    this.hidden = 0;
  }

  /**
   * Show the amount of elements, and those hidden and visible
   * @function count
   * @return {object} all matching elements, the amount of hidden and the amount of visible elements
   * @memberOf holmes
   */
  count(): { all: number, hidden: number, visible: number } {
    return {
      all: this.elementsLength,
      hidden: this.hidden,
      visible: this.elementsLength - this.hidden
    };
  }
}

const holmes = toFactory(Holmes);

export default holmes;

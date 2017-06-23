// @flow

const _global = typeof window === 'undefined' ? global : window; // eslint-disable-line no-undef

/**
 * Makes sure that a class can be used as a function
 * @param  {class} Class    The class to transform
 * @return {function}       Transformed class
 */
// $FlowIssue something weird here
export function toFactory(_class: Class): Function {
  // eslint-disable-next-line space-before-function-paren
  const Factory = function(...args) {
    let result;
    if (typeof this !== 'undefined' && this !== _global) {
      result = _class.call(this, ...args);
    } else {
      result = new _class(...args);
    }
    return result;
  };
  Factory.__proto__ = _class; // eslint-disable-line no-proto
  Factory.prototype = _class.prototype;
  return Factory;
}

export const stringIncludes = (str: string, search: string) =>
  str.indexOf(search) !== -1;

const _global = typeof window !== 'undefined' ? window : global;

/**
 * makes sure that a class can be used as a function
 * @param  {class} Class    The class to transform
 * @return {function}       Transformed class
 */
export function toFactory(Class) {
  const Factory = function(...args) {
    let result;
    if (typeof this !== 'undefined' && this !== (_global)) {
      result = Class.call(this, ...args);
    } else {
      result = new Class(...args)
    }
    return result;
  }
  Factory.__proto__ = Class
  Factory.prototype = Class.prototype
  return Factory
}

export const stringIncludes = (str: string, search: string) => {
  return str.indexOf(search) !== -1;
};

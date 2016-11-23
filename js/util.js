/**
 * Merges two objects
 * @param  {Object} Obj1 Object to merge
 * @param  {Object} Obj2 Object to merge
 * @return {Object}      The merged object
 */
export function mergeObj(Obj1, Obj2) {
  if (!(Obj1 instanceof Object) || !(Obj2 instanceof Object)) {
    throw new Error('One of both arguments isn\'t an object.');
  }
  Object.keys(Obj1).forEach(function (k) {
    if (typeof Obj2[k] === typeof Obj1[k] || Obj1[k] === undefined) {
      if (Obj2[k] instanceof Object) {
        mergeObj(Obj1[k], Obj2[k]);
      } else {
        Obj1[k] = Obj2[k];
      }
    }
  });
  return Obj1;
};

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

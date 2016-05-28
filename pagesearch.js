


/**
 * Float a number of things up on a page (hearts, flowers, 👌 ...)
 * @param {object}  options  all of the options are in an object
 * ---
 * @param {string}  content  the character or string to float
 * @param {int}     number   the number of items
 * @param {int}     duration the amount of seconds it takes to float up (default 10s)
 * @param {int}     repeat   the number of times you want the animation to repeat (default: 'infinite')
 * @author Haroen Viaene <hello@haroen.me>
 */
(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return (root.pagesearch = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.pagesearch = factory();
  }
})(this, function() {
  // UMD Definition above, do not remove this line

  // To get to know more about the Universal Module Definition
  // visit: https://github.com/umdjs/umd

  'use strict';

  /**
   * search for dom elements on your page
   * @param  {object} options
   * options: {
   *  input: '.search input', // queryselector for the input
   *  find: [
   *    '.results article h2',
   *  ],
   *  parents: 1
   *}
   */
  var pagesearch = function(options) {
    window.addEventListener('DOMContentLoaded',function(){
      var search = document.querySelector(options.input);
      for (var query of options.find) {
        document.querySelector(query);
      }

      search.addEventListener('input',function(){
        for (var i = 0; i < courseNames.length; i++) {
          var searchString = search.value.toLowerCase();
          if (courseNames[i].innerHTML.toLowerCase().indexOf(searchString) === -1 && courseDescriptions[i].innerHTML.toLowerCase().indexOf(searchString) === -1) {
            courseNames[i].parentNode.parentNode.classList.add('hidden');
          } else {
            courseNames[i].parentNode.parentNode.classList.remove('hidden');
          }
        };
      });
    });
  };

  return pagesearch;

});

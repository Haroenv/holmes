# [<img alt="Holmes.js" src="https://haroen.me/holmes/images/logo.png" height="50px"></img>](https://www.npmjs.com/package/holmes.js)

> Fast and easy searching inside a page.

[![Build Status](https://travis-ci.org/Haroenv/holmes.svg?branch=gh-pages)](https://travis-ci.org/Haroenv/holmes)
[![npm version](https://badge.fury.io/js/holmes.js.svg)](https://www.npmjs.com/package/holmes.js)
[![Bower version](https://badge.fury.io/bo/holmes.js.svg)](https://badge.fury.io/bo/holmes.js)
[![Join the chat at https://gitter.im/Haroenv/holmes](https://badges.gitter.im/Haroenv/holmes.svg)](https://gitter.im/Haroenv/holmes?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

You can install `holmes` with either `npm` or `bower` under the package name `holmes.js`. For `npm` that looks like this:

```
$ npm install --save holmes.js
```

After which you can add it in your page with i.e. browserify or loading the module in a different script tag.

You have to make sure that you have a `css` rule for the class `.hidden` that hides elements however you want. One option is to have this:

```css
.hidden {
  display: none;
}
```

but this could be any `css` you want.

## Usage

[demo](https://haroen.me/holmes/)

### Simple example

```js
holmes({
  input: '.search input', // default: input[type=search]
  find: '.results div' // querySelectorAll that matches each of the results individually
})
```

### All options

```js
holmes({
  // queryselector for the input
  input: '.search input',
  // queryselector for element to search in
  find: '.results article',
  // (optional) text to show when no results
  placeholder: 'no results',
  class: {
    // (optional) class to add to matched elements
    visible: 'visible',
    // (optional) class to add to non-matched elements
    hidden: 'hidden'
  },
  // (optional) if true, this will refresh the content every search
  dynamic: false,
  // (optional) needs to be true if the input is a contenteditable field instead of a
  contenteditable: false,
  // (optional) in case you don't want to wait for DOMContentLoaded before starting Holmes:
  instant: true,
  // (optional) if you want to start searching after a certain amount of characters are typed
  minCharacters: 5
});
```

[full documentation](https://haroen.me/holmes/doc)

## Methods

For all of the methods you should initialise a new instance of `holmes` like this:

```js
var h = new holmes(options);
```

Then you can use the following methods:

### `.clear()`

You can clear a holmes input programmatically, by using:

```js
h.clear();
```

### `.count()`

You can receive informations on what elements are visible, hidden and in total at any point:

```js
h.count(); // {all: 41, hidden: 34, visible: 7}
```

There's also a member `.hidden` that gives the count without a function call:

```js
console.log(h.hidden); // 34
```

### Showcase

What|who|image
---|---|---
[bullg.it](https://bullg.it)|[@haroenv](https://github.com/haroenv)|<img alt="screenshot of bullg.it" src="https://haroen.me/holmes/images/screen-bullgit.gif" width="100%" />
[family.scss](https://lukyvj.github.io/family.scss)|[@lukyvj](https://github.com/lukyvj)|<img alt="screenshot of family.scss" src="https://haroen.me/holmes/images/screen-family.gif" width="100%" />
[wikeo.be](https://wikeo.be)|[@bistory](https://github.com/bistory)|<img src="https://haroen.me/holmes/images/screen-wikeo.gif" alt="searching on wikeo.be for pages" width="100%">

I'd love to find out how people use my project, [let me know](https://github.com/Haroenv/holmes/issues/new?title=add+my+project+to+usages&body=who%7Cwhat%0D%0A---%7C---%0D%0A%40myusername%7C%5Bmy+project%5D%28https%3A%2F%2Flink-to-project.com%29%0D%0A%0D%0ASome+explanation+what+it+is) if you want to be featured!

### Questions?

Compatible up to IE9.

Let me know on twitter: [@haroenv](https://twitter.com/haroenv).

## Contributing

Contributions are always welcome! Here are some loose guidelines:

* use `feature branches`
* don't make it slower
* explain why you want a feature
* `npm run doc` to recreate the documentation

But I don't bite, if you have any questions or insecurities, hit me up for example on [gitter](https://gitter.im/Haroenv/holmes?utm_source=readme&utm_medium=link&utm_content=link).

## License

Apache 2.0

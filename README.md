# [<img alt="Holmes.js" src="https://haroen.me/holmes/images/logo.png" height="50px"></img>](https://www.npmjs.com/package/holmes.js)

> Fast and easy searching inside a page.

[![Build Status](https://travis-ci.org/Haroenv/holmes.svg?branch=gh-pages)](https://travis-ci.org/Haroenv/holmes) [![npm version](https://badge.fury.io/js/holmes.js.svg)](https://www.npmjs.com/package/holmes.js)

## Installation

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

```js
holmes({
  input: '.search input', // queryselector for the input
  find: '.results article', // queryselector for element to search in
  placeholder: 'no results', // (optional) text to show when no results
  class: {
    visible: 'visible', // (optional) class to add to matched elements
    hidden: 'hidden' // (optional) class to add to non-matched elements
  }
});
```

[full documentation](https://haroen.me/holmes/doc)

### Showcase

What|who|image
---|---|---
[bullg.it](https://bullg.it)|[@haroenv](https://github.com/haroenv)|![screenshot of bullg.it](https://haroen.me/holmes/images/screen-bullgit.png)
[family.scss](https://lukyvj.github.io/family.scss)|[@lukyvj](https://github.com/lukyvj)|![screenshot of family.scss](https://haroen.me/holmes/images/screen-family.png)

I'd love to find out how people use my project, let me know if you want to be featured!

### Questions?

Compatible up to IE9.

Let me know on twitter: [@haroenv](https://twitter.com/haroenv).

## License

Apache 2.0

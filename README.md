# Pagesearch

> simple search based on the dom

[![Build Status](https://travis-ci.org/Haroenv/pagesearch.svg?branch=gh-pages)](https://travis-ci.org/Haroenv/pagesearch)[![npm version](https://badge.fury.io/js/pagesearch.svg)](https://www.npmjs.com/package/pagesearch)

## Installation

```
$ npm install --save pagesearch
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

[demo](https://haroen.me/pagesearch/)

```js
pagesearch({
  input: '.search input', // queryselector for the input
  find: '.results article', // queryselector for element to search in
  parents: 1 // the amount of parents from the first element in find to the first to the removed element (default 0)
});
```

### Questions?

Compatible up to IE9.

Let me know on twitter: [@haroenv](https://twitter.com/haroenv).

## License

Apache 2.0

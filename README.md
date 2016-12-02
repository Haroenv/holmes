# [<img alt="Holmes.js" src="https://haroen.me/holmes/images/logo.png" height="50px"></img>](https://www.npmjs.com/package/holmes.js)

> Fast and easy searching inside a page.

[![Build Status](https://travis-ci.org/Haroenv/holmes.svg?branch=gh-pages)](https://travis-ci.org/Haroenv/holmes)
[![Coverage Status](https://coveralls.io/repos/github/Haroenv/holmes/badge.svg)](https://coveralls.io/github/Haroenv/holmes)
[![npm version](https://badge.fury.io/js/holmes.js.svg)](https://www.npmjs.com/package/holmes.js)
[![Bower version](https://badge.fury.io/bo/holmes.js.svg)](https://badge.fury.io/bo/holmes.js)
[![Join the chat at https://gitter.im/Haroenv/holmes](https://badges.gitter.im/Haroenv/holmes.svg)](https://gitter.im/Haroenv/holmes?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![devDependencies Status](https://david-dm.org/haroenv/holmes/dev-status.svg)](https://david-dm.org/haroenv/holmes?type=dev)

Holmes filters a list of elements based on the value of a `input` in just ~6KB.

## Installation

You can install Holmes with either `npm` or `bower` under the package name `holmes.js`. For `npm` that looks like this:

```
$ npm install --save holmes.js
```

After which you can add it in your page with i.e. webpack, rollup, browserify or loading the module in a different script tag.

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

## Options

[full documentation](https://haroen.me/holmes/doc)

### `input`
**default**: `input[type=search]`

querySelector for the input

**examples**: `input`, `.search input`

### `find` **required**

querySelectorAll for elements to search in

**examples**: `blockquote p`, `.result`, `.results div`

### `class`

#### `class.hidden`
**default**: `hidden`

Class to add when the a `.find` doesn't contain the search query.

**examples**: `hidden`, `dn`, `none`

#### `class.visible`
**default**: `false`

Class to add to visible items if they contain the search query.

**examples**: `visible`, `vis`, `nohidden`

### `placeholder`
**default**: `false`

html to show when no results.

**examples**: `<p> No results </p>`, `Didn't find anything.`

### `dynamic`
**default**: `false`

Enable this option if you want Holmes to query the value of the `.find` at every input.

**examples**: `true`, `false`

### `instant` :warning: DEPRECATED
**default**: `false`

This option is deprecated. To use Holmes in an async environment, initialise it with:

```js
holmes(options).start();
// or
const h = new holmes(options);
h.start();
```

This way it'll start immediately, just like it used to do with `instant: true`. Sorry for the inconvenience.

By default Holmes will wait on a `DOMContentLoaded` event to start searching. If you're loading the elements by `AJAX` for example this event comes too early. In that case you can enable `instant`, and start Holmes when your content is ready.

**examples**: `true`, `false`

### `minCharacters`
**default**: `0`

A minimum amount of characters need to be typed before Holmes starts filtering.

**examples**: `2`, `5`

### `mark`
**default**: `false`

To start showing the result in a `<mark>` tag inside the `.find`, you should enable this. To change the colour this `match` is shown in, you should style the [`mark`](https://developer.mozilla.org/en/docs/Web/HTML/Element/mark) background-color.

>:exclamation: this will break event listeners on nested content

>:exclamation: this won't work if the character after the match is a literal `>`.

>:speaking_head: If you really have to use this character, you can replace all occurences of `>` by `&gt;`


**examples**: `true`, `false`

### `hiddenAttr`
**default**: `true`

Adds `hidden="true"` to hidden elements. [Interesting link](https://www.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/) explaining its use.

### `onHidden`

Callback for when an item is hidden.

```js
function(el) {
  console.log('hide',el);
}
```

### `onVisible`

Callback for when an item is visible again.

```js
function(el) {
  console.log('show',el);
}
```

### `onEmpty`

Callback for when no items were found.

```js
function(placeholder) {
  console.log('nothing found',placeholder);
}
```

### `onFound`

Callback for when items are found after being empty.

```js
function(placeholder) {
  console.log('something found',placeholder);
}
```

### `onInput`

Callback for every input.

```js
function(input) {
  console.log('current input',input);
}
```

## Methods and members

For all of the methods you should initialise a new instance of Holmes like this:

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

### `.start()`

Start an even listener for the specified options. Holmes **always** has `.start()` running on initialisation.

```js
h.start();
```

### `.stop()`

Stops the current running event listener. Resolves a Promise when this has been completed.

```js
h.stop();
h.start(); // could accidentally start too soon

h.stop().then(h.start); // might take a small time
```

### `.hidden`

There's also a member `.hidden` that gives the count without a function call:

```js
console.log(h.hidden); // 34
```

### `.elements`

A `NodeList` of all of the elements that holmes considers. There's also `.elementsLength` for the amount of elements and `.elementsArray` with an array of the elements.

### `.input`

The input that holmes looks in. There's also the last search string as `.searchString`

### `.placeholder`

The current placeholder (DOM Node).

### `.running`

Whether or not this instance is running.

### `.options`

Shows the options chosen chosen for this instance of holmes. You can also set options like this after initialisation.

```js
console.log(h.options); // specified options
```

> note: setting options after it's running might require `h.stop().then(h.start)`

### Showcase

What|who|image
---|---|---
[bullg.it](https://bullg.it)|[@haroenv](https://github.com/haroenv)|<img alt="screenshot of bullg.it" src="https://haroen.me/holmes/images/screen-bullgit.gif" width="100%" />
[family.scss](https://lukyvj.github.io/family.scss)|[@lukyvj](https://github.com/lukyvj)|<img alt="screenshot of family.scss" src="https://haroen.me/holmes/images/screen-family.gif" width="100%" />
[wikeo.be](https://wikeo.be)|[@bistory](https://github.com/bistory)|<img src="https://haroen.me/holmes/images/screen-wikeo.gif" alt="searching on wikeo.be for pages" width="100%">
[lunchbreakapp.be](https://www.lunchbreakapp.be)|[@AndreasBackx](https://github.com/AndreasBackx)|<img src="https://thumbs.gfycat.com/FancyDependentGiraffe-size_restricted.gif" alt="searching on lunchbreak for items" width="100%">

I'd love to find out how people use my project, [let me know](https://github.com/Haroenv/holmes/issues/new?title=add+my+project+to+usages&body=who%7Cwhat%0D%0A---%7C---%0D%0A%40myusername%7C%5Bmy+project%5D%28https%3A%2F%2Flink-to-project.com%29%0D%0A%0D%0ASome+explanation+what+it+is) if you want to be featured!

### Questions?

Compatible up to IE9. For support of older browsers you'll need to polyfill `classList`, `addEventListener` and the `input` event with for example [remy/polyfills](https://github.com/remy/polyfills). I haven't tried this myself yet, so let me know what you used if you support older browsers!

Let me know on twitter: [@haroenv](https://twitter.com/haroenv).

## Contributing

Contributions are always welcome! Here are some loose guidelines:

* use `feature branches`
* don't make it slower
* explain why you want a feature
* `npm run doc` to recreate the documentation

Building to a UMD is done via rollup (`npm run build`).

But I don't bite, if you have any questions or insecurities, hit me up for example on [gitter](https://gitter.im/Haroenv/holmes?utm_source=readme&utm_medium=link&utm_content=link).

## License

Apache 2.0

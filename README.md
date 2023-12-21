# test dom
![tests](https://github.com/nichoth/test-dom/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@nichoth/test-dom)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue)](README.md)
[![license](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Helpers for working with the DOM.

## install
```sh
npm i -D @nichoth/dom
```

## use

### import
```js
import { dom } from '@nichoth/dom'
```

### require
```js
const dom = require('@nichoth/dom').dom
```

## API

### dom.waitFor
Look for a DOM element by slector. Default timeout is 5 seconds.

```ts
function waitFor (args:{
    selector?:string,
    visible?:boolean,
    timeout?:number
}, lambda?:() => Element|null)
```

#### example
```js
const foundElement = await dom.waitFor({
    selector: 'p'
})
```

### dom.waitForText
Look for an element containing the given text. Default timeout is 5 seconds.

```ts
function waitForText (args:{
    text?:string,
    timeout?:number,
    element:Element,
    multipleTags?:boolean,
    regex?:RegExp
}):Promise<Element>
```

#### example
```js
const el = await dom.waitForText({
    element: document.body,
    regex: /bar/
})
```

Pass in a parent element and timeout.

```js
const found = await dom.waitForText({
    element: dom.qs('#test-two'),
    multipleTags: true,
    text: 'bbb',
    timeout: 1000
})
```

## credits

Thanks Jake Verbaten for writing this originally.

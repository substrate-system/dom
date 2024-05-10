# dom
![tests](https://github.com/bicycle-codes/dom/actions/workflows/nodejs.yml/badge.svg)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@bicycle-codes/dom)](https://socket.dev/npm/package/@bicycle-codes/dom)
[![types](https://img.shields.io/npm/types/msgpackr?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

Helpers for working with the DOM, useful for tests.

[Read the docs](https://bicycle-codes.github.io/dom/)

## install
```sh
npm i -D @bicycle-codes/dom
```

## use

### import
```js
import { dom } from '@bicycle-codes/dom'

// or import individual functions
import { waitFor } from '@bicycle-codes/dom'
```

### require
```js
const dom = require('@bicycle-codes/dom').dom
```

## API

### convenient shortcuts

__`dom.qs`__ points to `document.querySelector`

__`dom.qsa`__ is equal to `document.querySelectorAll`

-------

### dom.waitFor
Look for a DOM element by slector. Default timeout is 5 seconds. Throws if the element is not found.

```ts
function waitFor (args:{
    selector?:string,
    visible?:boolean,
    timeout?:number
}|string, lambda?:() => Element|null):Promise<Element>
```

#### example
```js
import { waitFor } from '@bicycle-codes/dom'

const foundElement = await waitFor({
    selector: 'p'
})

// or pass in a string to use as a query selector
const el = await waitFor('#my-element')
```

### dom.waitForText
Look for an element containing the given text, or that matches a given regex. Return the element if found. Default timeout is 5 seconds. Throws if the element is not found.

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
import { waitForText } from '@bicycle-codes/dom'

const el = await waitForText({
    element: document.body,
    regex: /bar/
})
```

Pass in a parent element and timeout.
```js
const found = await waitForText({
    element: dom.qs('#test-two'),
    multipleTags: true,
    text: 'bbb',
    timeout: 10000  // 10 seconds
})
```

### click
Dispatch a click event from the given element.

```js
import { dom } from '@bicycle-codes/dom'
// or import { click } from '@bicycle-codes/dom'

dom.click(dom.qs('#my-element'))
```

### event
Dispatch an event from an element.

```ts
function event (args:{
    event:string|Event;
    element?:HTMLElement|Element|typeof window
}):void
```

#### event example
```js
import { dom } from '@bicycle-codes/dom'

dom.event({ event: 'hello', element: dom.qs('#example') })
```

### sleep
Wait for the given milliseconds.

```ts
async function sleep (ms:number):Promise<void>
```

#### sleep example
```js
import { sleep } from '@bicycle-codes/dom'

await sleep(3000)  // wait 3 seconds
```

## credits

Thanks Jake Verbaten for writing this originally.

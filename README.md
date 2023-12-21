# dom
![tests](https://github.com/nichoth/dom/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@nichoth/dom)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue)](README.md)
[![license](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Helpers for working with the DOM, useful for tests.

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

### convenient shortcuts

#### `dom.qs`
This points to `document.querySelector`

#### `dom.qsa`
Is equal to `document.querySelectorAll`

-------

### dom.waitFor
Look for a DOM element by slector. Default timeout is 5 seconds. Throws if the element is not found.

```ts
function waitFor (args:{
    selector?:string,
    visible?:boolean,
    timeout?:number
}, lambda?:() => Element|null)
```

#### example
```js
import { waitFor } from '@nichoth/dom'

const foundElement = await waitFor({
    selector: 'p'
})

// or pass in a string to use as a query selector
const el = await waitFor('#my-element)
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
import { waitForText } from '@nichoth/dom'

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
import { dom } from '@nichoth/dom'
// or import { click } from '@nichoth/dom'

dom.click(dom.qs('#my-element'))
```

### event
Dispatch an event from an element.

```js
import { dom } from '@nichoth/dom'

dom.event('hello-event', dom.qs('#example'))
```

### sleep
Wait for the given milliseconds.

```ts
async function sleep (ms:number):Promise<void>
```

#### example
```js
import { sleep } from '@nichoth/dom'

await sleep(3000)
```

## credits

Thanks Jake Verbaten for writing this originally.

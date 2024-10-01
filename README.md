# dom
![tests](https://github.com/bicycle-codes/dom/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/msgpackr?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![install size](https://packagephobia.com/badge?p=@bicycle-codes/dom)](https://packagephobia.com/result?p=@bicycle-codes/dom)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](https://common-changelog.org)
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

__`dom.byId`__ is equal to `document.getElementById`


-------


### `waitFor`
Look for a DOM element by slector. Default timeout is 5 seconds. Throws if the element is not found.

```ts
function waitFor (selector?:string|null, args?:{
    visible?:boolean,
    timeout?:number
}|null, lambda?):Promise<Element|null>
```

#### `waitFor` example
```js
import { waitFor } from '@bicycle-codes/dom'

// or pass in a query selector string
const el = await waitFor('#my-element')

// example of using a lambda function only
const el2 = dom.waitFor(null, null, () => {
    return document.querySelector('p')
})
```

### `waitForText`
Look for an element containing the given text, or that matches a given regex. Return the element if found. Default timeout is 5 seconds. Throws if the element is not found.

Takes either an option object or a string of text.

```ts
function waitForText (args:Partial<{
    text:string,
    timeout:number,
    multipleTags:boolean,
    regex:RegExp
}>|string, parentElement:Element = document.body):Promise<Element|null>
```

#### `waitForText` example

```js
import { waitForText } from '@bicycle-codes/dom'

// by default will search the document.body
const el = await waitForText({
    regex: /bar/
})
```

##### Pass in a string selector
Can pass in a string to search for. Will search the `document.body` by default.

```js
import { waitForText } from '@bicycle-codes/dom'

const el = await dom.waitForText('bar')
```

##### Pass in a parent element and timeout.
```js
const found = await waitForText({
    element: dom.qs('#test-two'),
    multipleTags: true,
    text: 'bbb',
    timeout: 10000  // 10 seconds
})
```

### `click`
Dispatch a click event from the given element.

```ts
async function click (selector:Element|string):Promise<void>
```

#### `click` example

```js
import { dom } from '@bicycle-codes/dom'
// or import { click } from '@bicycle-codes/dom'

dom.click(dom.qs('#my-element'))

// or pass a selector
dom.click('#my-element')
```

### `event`
Dispatch an event from an element. Will dispatch from `window` if no element is passed in.

```ts
function event (
    event:CustomEvent|Event|string,
    element?:Element|Window|null
):void
```

#### `event` example
```js
import { dom } from '@bicycle-codes/dom'

// pass in an event name. Will create a custom event.
dom.event('hello', dom.qs('#test'))

// create an event, then dispatch it
dom.event(
    new CustomEvent('test-event', {
        bubbles: true,
        detail: 'test'
    }),
    dom.qs('#test-two')
)
```

### `sleep`
Wait for the given milliseconds.

```ts
async function sleep (ms:number):Promise<void>
```

#### `sleep` example
```js
import { sleep } from '@bicycle-codes/dom'

await sleep(3000)  // wait 3 seconds
```

### `type`
Enter text into an input. This will simulate typing by dispatching `input` events.

```ts
async function type (
    selector:string|HTMLElement|Element,
    value:string,
):Promise<void>
```

#### `type` example

```js
import { type } from '@bicycle-codes/dom'

// this will dispatch 5 `input` events,
// one for each character
await type('#test', 'hello')
```

## credits

Thanks [@raynos](https://github.com/raynos/) for writing this originally.

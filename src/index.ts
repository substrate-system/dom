import { toElement, requestAnimationFrame } from './util.js'
export const qs = document.querySelector.bind(document)
export const qsa = document.querySelectorAll.bind(document)

const SECOND = 1000
const DEFAULT_TIMEOUT = (5 * SECOND)

export const dom = {
    getComputedStyle,
    isElementVisible,
    waitForText,
    waitFor,
    click,
    event,
    sleep,
    qs,
    qsa,
}

export default dom

/**
 * Sleeps for `ms` milliseconds.
 * @param {number} ms
 * @return {Promise<void>}
 */
export async function sleep (ms:number):Promise<void> {
    await new Promise((resolve) => {
        if (!ms) {
            process.nextTick(resolve)
        } else {
            setTimeout(resolve, ms)
        }
    })
}

/**
 * @param {Element} element
 */
export function isStyleVisible (element:Element):boolean {
    const ownerDocument = element.ownerDocument
    if (!ownerDocument || !ownerDocument.defaultView) {
        console.warn('invalid element?', element)
        throw new Error('element has no ownerDocument')
    }

    const {
        display,
        visibility,
        opacity
    } = ownerDocument.defaultView.getComputedStyle(element)

    return (
        display !== 'none' &&
        visibility !== 'hidden' &&
        visibility !== 'collapse' &&
        opacity !== '0' &&
        Number(opacity) !== 0
    )
}

/**
 * Return an object containing the values of all CSS properties of an element,
 * after applying active stylesheets.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle|MDN}
 * @param {Element | HTMLElement} element
 */
export function getComputedStyle (element:Element|HTMLElement) {
    const ownerDocument = element.ownerDocument

    if (!ownerDocument || !ownerDocument.defaultView) {
        console.warn('invalid element?', element)
        throw new Error('element has no ownerDocument')
    }

    return ownerDocument.defaultView.getComputedStyle(element)
}

/**
 * Return if the given attribute is visible.
 *
 * @param {Element} element
 * @param {Element} [previousElement]
 * @returns {boolean}
 */
export function isAttributeVisible (element:Element, previousElement?:Element):boolean {
    return (
        !element.hasAttribute('hidden') &&
    (element.nodeName === 'DETAILS' && previousElement?.nodeName !== 'SUMMARY'
        ? element.hasAttribute('open')
        : true)
    )
}

/**
 * Return if the given element is visible.
 * Copy pasted from https://raw.githubusercontent.com/testing-library/jest-dom/master/src/to-be-visible.js
 *
 * @param {Element} element
 * @param {Element} [previousElement]
 * @returns {boolean}
 */
export function isElementVisible (
    element:Element,
    previousElement?:Element
):boolean {
    return (
        isStyleVisible(element) &&
        isAttributeVisible(element, previousElement) &&
        (!element.parentElement ||
            dom.isElementVisible(element.parentElement, element))
    )
}

/**
 * Look for the given text within the given parent element. Return the element
 * containing the text.
 *
 * @param {{
 *    text?: string,
 *    timeout?: number
 *    element: Element,
 *    multipleTags?: boolean,
 *    regex?: RegExp
 * }|string} args
 */
export function waitForText (args:{
    text?:string,
    timeout?:number,
    element:Element,
    multipleTags?:boolean,
    regex?:RegExp
}|string):Promise<Element|null> {
    let opts:{
        text?:string;
        timeout?:number;
        element:Element;
        multipleTags?:boolean;
        regex?:RegExp
    }

    if (typeof args === 'string') {
        opts = { text: args, element: document.body }
    } else {
        opts = args
    }

    return waitFor(
        { timeout: opts.timeout },
        () => {  // the lambda
            const {
                element,
                text,
                regex,
                multipleTags
            } = opts

            const elems:Element[] = []

            let maxLoop = 10000
            const stack:Element[] = [element]
            // Walk the DOM tree breadth first and build up a list of
            // elements with the leafs last.
            while (stack.length > 0 && maxLoop-- >= 0) {
                const current = stack.pop()
                if (current && current.children.length > 0) {
                    stack.push(...current.children)
                    elems.push(...current.children)
                }
            }

            // Loop over children in reverse to scan the LEAF nodes first.
            let match:HTMLElement|null = null
            for (let i = elems.length - 1; i >= 0; i--) {
                const node = elems[i]
                if (!node.textContent) continue

                if (regex && regex.test(node.textContent)) {
                    return node
                }

                if (text && node.textContent?.includes(text)) {
                    return node
                }

                if (text && multipleTags) {
                    if (text[0] !== (node.textContent)[0]) continue

                    // if equal, check the sibling nodes
                    let sibling = node.nextSibling
                    let i = 1

                    // while there is a potential match, keep checking the siblings
                    while (i < text.length) {
                        if (sibling && (sibling.textContent === text[i])) {
                            // is equal still, check the next sibling
                            sibling = sibling.nextSibling
                            i++
                            match = node.parentElement
                        } else {
                            if (i === (text.length - 1)) return node.parentElement
                            match = null
                            break
                        }
                    }
                }
            }

            return match
        }
    )
}

type Lambda = () => Element|null

/**
 * Find an element by query selector.
 *
 * @param {{
 *    selector?: string,
 *    visible?: boolean, // the element needs to be visible
 *    timeout?: number // how long to wait
 * }|string} args
 * @param {() => Element|null} [lambda] A function to match an element
 * @throws {Error} - Throws an error if neither `lambda` nor `selector`
 * is provided.
 * @throws {Error} - Throws an error if the element is not found within
 * the timeout.
 * @returns {Element|null} The HTML element
 */
export function waitFor (
    args:{
        selector?:string,
        visible?:boolean,
        timeout?:number
    }|string,
    lambda?:Lambda
):Promise<Element|null> {
    let selector:string
    let visible:boolean
    let timeout = DEFAULT_TIMEOUT
    if (typeof args === 'string') {
        selector = args
    } else {
        if (typeof args.visible === 'undefined') visible = true
        timeout = args.timeout ?? DEFAULT_TIMEOUT
        selector = args.selector!
    }

    return new Promise((resolve, reject) => {
        if (!lambda && selector) {
            lambda = () => document.querySelector(selector)
        }

        const interval = setInterval(() => {
            if (!lambda) {
                throw new Error('lambda or selector required')
            }

            const el = lambda()
            if (el) {
                if (visible && !dom.isElementVisible(el)) return
                clearTimeout(timer)
                return resolve(el)
            }
        }, 50)

        const timer = setTimeout(() => {
            clearInterval(interval)
            const wantsVisable = visible ? 'A visible selector' : 'A Selector'
            reject(new Error(
                `${wantsVisable} was not found after ${timeout}ms (${selector})`
            ))
        }, timeout)
    })
}

/**
 * Click the given element.
 *
 * @param {Element} element
 */
export function click (element:Element) {
    event({
        event: new window.MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            button: 0
        }),
        element
    })
}

/**
 * Dispatch an event from the given element.
 *
 * @param {{
 *   event: string | Event,
 *   element?: HTMLElement | Element | typeof window
 * }} args
 */
export function event (args:{
    event:string|Event;
    element?:HTMLElement|Element|typeof window
}):void {
    let {
        event,
        element = window
    } = args

    if (typeof event === 'string') {
        event = new window.CustomEvent(event)
    }

    if (typeof event !== 'object') {
        throw new Error('event should be of type Event')
    }

    element.dispatchEvent(event)
}

/**
 * Type the given value into the element, emitting all relevant events, to
 * simulate a user typing with a keyboard.
 *
 * @param {string|HTMLElement|Element} selector - A CSS selector string, or an instance of HTMLElement, or Element.
 * @param {string} value - The string to type into the :focus element.
 * @returns {Promise<void>}
 *
 * @example
 * ```js
 * await type('#my-div', 'Hello World')
 * ```
 */
export async function type (
    selector:string|HTMLElement|Element,
    value:string,
):Promise<void> {
    const el = toElement(selector)

    if (!('value' in el!)) throw new Error('Element missing value attribute')

    for (const c of value.split('')) {
        await requestAnimationFrame()
        el.value = el.value != null ? el.value + c : c
        el.dispatchEvent(
            new Event('input', {
                bubbles: true,
                cancelable: true
            })
        )
    }

    await requestAnimationFrame()
}

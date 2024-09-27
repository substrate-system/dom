/**
 * Converts querySelector string to an HTMLElement or validates an
 * existing HTMLElement.
 *
 *
 * @param {string|Element|HTMLElement} selector - A CSS selector string, or an
 *   instance of an Element.
 * @returns {Element} The HTMLElement, Element, or Window that corresponds to
 *   the selector.
 * @throws {Error} Throws an error if the `selector` is not a string that
 *   resolves to an HTMLElement, or not an instance of
 *   HTMLElement, Element, or Window.
 *
 */
export function toElement (
    _selector?:string|HTMLElement|Element
):Element|InstanceType<typeof Window> {
    if (!_selector) return window

    let selector:string|Element|null = _selector

    if (globalThis.document) {
        if (typeof selector === 'string') {
            selector = globalThis.document.querySelector(selector)
        }

        if (!(
            selector instanceof globalThis.HTMLElement ||
            selector instanceof globalThis.Element
        )) {
            throw new Error('`stringOrElement` needs to be an instance of ' +
                'HTMLElement or a querySelector that resolves to an HTMLElement')
        }

        return selector
    } else {
        return window
    }
}

export async function requestAnimationFrame ():Promise<void> {
    if (globalThis.document && globalThis.document.hasFocus()) {
        // RAF only works when the window is focused
        await new Promise(resolve => globalThis.requestAnimationFrame(resolve))
    } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
    }
}

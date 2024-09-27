import { dom, qs, waitForText, type } from '../src/index.js'
import { test } from '@bicycle-codes/tapzero'
import { Terminal } from 'xterm'

test('dom.waitFor', async t => {
    const p = document.createElement('p')
    p.textContent = 'testing'
    document.body.appendChild(p)

    const foundP = await dom.waitFor({
        selector: 'p'
    })

    t.equal(foundP!.textContent, 'testing', 'should find the element by tag')

    const pViaString = await dom.waitFor('p')
    t.equal(pViaString!.textContent, 'testing',
        'should take a string selector as arg')

    const a = document.body.appendChild(document.createElement('a'))
    a.id = 'hello'
    a.textContent = 'hello'

    const foundA = await dom.waitFor({ selector: '#hello' })
    t.ok(foundA, 'should find an element by ID')
    t.equal(foundA?.textContent, 'hello', 'should find the right element by ID')

    // wait a bit, then add the element
    setTimeout(() => {
        const div = document.createElement('div')
        div.textContent = 'bar'
        div.setAttribute('id', 'foo')
        document.body.appendChild(div)
    }, 2000)

    // first start waiting
    const el = await dom.waitFor({
        selector: '#foo'
    })

    t.equal(el!.textContent, 'bar', 'should find the element after waiting')
})

test('call waitFor with a string', async t => {
    const el = dom.waitFor('p')
    t.ok(el, 'should find an element given a string argument')
})

test('dom.click', async t => {
    const p = await dom.waitFor({ selector: 'p' })
    await dom.click(p as HTMLElement)
    t.ok('does not throw')
})

test('dom.waitForText', async t => {
    // use the element we created previously
    const el = await dom.waitForText({
        element: document.body,
        regex: /bar/
    })

    t.ok(el, 'should find by text content')
})

test('multiple tags', async t => {
    const terminal = new Terminal({
        allowTransparency: true,
        fontFamily: 'FiraMono',
        fontSize: 14
    })
    terminal.writeln('foo bar baz')

    const el = document.createElement('div')
    document.body.appendChild(el)

    terminal.open(el)

    const found = await dom.waitForText({
        element: el,
        multipleTags: true,
        text: 'foo bar'
    })
    t.ok(found, 'should find text split into multiple tags')

    const text = await dom.waitForText({
        element: document.body,
        multipleTags: true,
        text: 'baz'
    })
    t.ok(text, 'should find "baz" text')
})

test('more multiple tags', async t => {
    const testEl = document.createElement('div')
    testEl.setAttribute('id', 'test-el')
    document.body.appendChild(testEl)
    const children = Array.prototype.map.call('quux', letter => {
        const el = document.createElement('span')
        el.textContent = letter
        return el
    })
    testEl.append(...children as Node[])

    try {
        const quux = await dom.waitForText({
            element: testEl,
            text: 'quux',
            multipleTags: true,
            timeout: 1000
        })

        t.ok(quux, 'should find the test in separate tags')
    } catch (err) {
        t.fail((err as Error).toString())
    }
})

test('return value for non-existant text', async t => {
    try {
        await dom.waitForText({
            element: document.body,
            text: 'non existant',
            multipleTags: true,
            timeout: 1000
        })
        t.fail("found text that doesn't exist")
    } catch (err) {
        t.ok(err, 'should throw an error because it is not found')
    }
})

test('partially matching text', async t => {
    try {
        await dom.waitForText({
            element: document.body,
            text: 'quzz',
            multipleTags: true,
            timeout: 1000
        })
        t.fail("found text that doesn't exist")
    } catch (err) {
        t.ok(err, "should throw an error because the text doesn't exist")
    }
})

test('another partial match', async t => {
    try {
        await dom.waitForText({
            element: document.body,
            text: 'quuxaa',
            multipleTags: true,
            timeout: 1000
        })
        t.fail('found non-existant text')
    } catch (err) {
        t.ok(err, "should throw an error because the text doesn't exist")
    }
})

test('match a middle section of text', async t => {
    try {
        const el = await dom.waitForText({
            element: document.body,
            text: 'uux',
            multipleTags: true,
            timeout: 1000
        })
        t.ok(dom.isElementVisible(el!), 'should find the element')
    } catch (err) {
        t.fail((err as Error).toString())
    }
})

test('return value for multipleTags', async t => {
    try {
        const match = await dom.waitForText({
            element: document.body,
            text: 'uux',
            multipleTags: true,
            timeout: 1000
        })

        t.equal(match!.getAttribute('id'), 'test-el',
            'should return the parent element')
    } catch (err) {
        t.fail((err as Error).toString())
    }
})

test('another case for text + tags', async t => {
    const test2 = document.createElement('div')
    test2.setAttribute('id', 'test-two')
    document.body.appendChild(test2)
    const children = Array.prototype.map.call('aaa bbb ccc', letter => {
        const el = document.createElement('span')
        el.textContent = letter
        return el
    })
    test2.append(...children as Node[])

    const div = document.getElementById('test-two')
    t.ok(div, 'div exists')
    t.equal(div?.querySelector('span:first-child')?.textContent, 'a',
        'children exist')

    try {
        const aaa = await dom.waitForText({
            element: document.getElementById('test-two') as HTMLElement,
            multipleTags: true,
            text: 'aaa',
            timeout: 1000
        })
        t.ok(dom.isElementVisible(aaa!), 'found the first string')
    } catch (err) {
        t.fail((err as Error).toString())
    }

    try {
        const found = await dom.waitForText({
            element: dom.qs('#test-two') as Element,
            multipleTags: true,
            text: 'bbb',
            timeout: 1000
        })

        t.ok(dom.isElementVisible(found!), 'should find "bbb" string')
    } catch (err) {
        t.fail((err as Error).toString())
    }
})

test('dom.event', t => {
    t.plan(3)

    dom.qs('#test-two')!.addEventListener('hello', ev => {
        t.ok(ev, 'should get the event')
    })

    dom.qs('#test-two')!.addEventListener('testing-event', (ev) => {
        t.ok(ev, 'should get another event')
        t.equal((ev as CustomEvent).detail, 'test',
            'has the right event properties')
    })

    dom.event({ event: 'hello', element: dom.qs('#test-two')! })
    dom.event({
        event: new CustomEvent('testing-event', {
            bubbles: true,
            detail: 'test'
        }),
        element: dom.qs('#test-two')!
    })
})

test('waitForText', async t => {
    const text = await waitForText('testing')
    t.ok(text instanceof HTMLElement, 'should find the p tag given a string')
})

test('type', async t => {
    t.plan(11)
    const input = qs('#test-input')
    t.plan(11)
    input?.addEventListener('input', ev => {
        t.ok(ev, 'should dispatch an "input" event 11 times, once for each key')
    })

    await type('#test-input', 'hello world')
})

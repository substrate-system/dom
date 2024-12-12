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

export default sleep

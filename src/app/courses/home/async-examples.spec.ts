import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing"
import { of } from "rxjs"
import { delay } from "rxjs/operators"

describe('Async Testing Examples', () => {

    it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
        let test = false
        setTimeout(() => {
            
            test = true
            expect(test).toBeTruthy()
            done()

        }, 1000)
    })

    it('Asynchronous test example - setTimeout()', fakeAsync(() => {
        let test = false
        setTimeout(() => {
            
            test = true
            
        }, 1000)
        //pushes the call forward and can only be used with fakeAsync
        //tick(1000)
        
        //finish all pending timers
        flush()
        
        expect(test).toBeTruthy()
    }))

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false

        //promise gets priority over setTimeout (macrotask or task) (the browser can update the dom)
        //promise is a microtask: they have their own queue (the browser won't update the view)
        Promise.resolve().then(() => {
            test = true
        })
        flushMicrotasks()

        expect(test).toBeTruthy()
    }))

    it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0

        Promise.resolve()
            .then(() => {
                counter += 10
                setTimeout(() => {
                    counter += 1
                }, 1000)
            })
        expect(counter).toBe(0)
        //triggers promise
        flushMicrotasks()
        expect(counter).toBe(10)
        //triggers setTimeout()
        tick(500)
        expect(counter).toBe(10)
        tick(500)
        expect(counter).toBe(11)
    }))

    it('Asynchronous test example - Synchronous observable', () => {
        let test = false
        const test$ = of(test)
        //it's synchronous, so it passes the test
        test$.subscribe(() => {
            test = true
        })
        expect(test).toBe(true)
    })

    it('Asynchronous test example - Asynchronous observable', fakeAsync(() => {
        let test = false
        const test$ = of(test).pipe(delay(1000))
        
        test$.subscribe(() => {
            test = true
        })
        //tick to advance time
        tick(1000)
        expect(test).toBe(true)
    }))
})
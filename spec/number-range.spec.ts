import {range, NumRange, from} from '../number-range'
describe('number range', function () {
    describe('range function', function () {
        it('spits out an iterator that goes through a range of numbers', function () {
            let r = range(0, 5),
                max = 5
            for (let i = 0; i <= max; ++i) {
                expect(r.value).toBe(i)
                expect(r.done).toBe(false)
                r = r.next()
            }
            expect(r.done).toBe(true)
        })
        it('sets a step', function () {
            let r = range(0, 10, 2),
                max = 10
            for (let i = 0; i <= max; i += 2) {
                expect(r.value).toBe(i)
                expect(r.done).toBe(false)
                r = r.next()
            }
            expect(r.done).toBe(true)
        })
    })
    describe('NumRange class', function () {
        let r:NumRange
        beforeEach(function (){
            r = new NumRange(0, 5)
        })
        it('toArray makes an array from the range', function () {
            expect(r.toArray()).toEqual([0, 1, 2, 3, 4, 5])
        })
    })

    describe('from to', function () {
        it('produces a number range', function () {
            const r = from(0).to(5)
            expect(r.toArray()).toEqual([0, 1, 2, 3, 4, 5])
        })
    })

    describe('forEach', function () {
        it('runs a function on each number in the range', function () {
            const r = from(0).to(5),
                max = 5
            const spy = jasmine.createSpy('rangeSpy')
            r.forEach(spy)
            expect(spy).toHaveBeenCalledTimes(6)
            for (let i = 0; i <= max; i += 2) {
                expect(spy).toHaveBeenCalledWith(i)
            }
        })
    })
    describe('map', function () {
        it('produces an array that has the result of a function called with each element in the range', function () {
            const r = from(0).to(5)
            expect(r.map(n => n + 1)).toEqual([1, 2, 3, 4, 5, 6])
        })

    })
    describe('reduce', function () {
        it('produces a single value from the range using a function and an initial value', function () {
            const r = from(0).to(5)
            expect(r.reduce((m, n)=> {
                if (n % 2 === 0) {
                    return m - n
                }
                return m + n
            }, 0)).toEqual(3)
        })
    })
})
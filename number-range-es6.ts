export function range (start:number, end:number, step:number = 1) : IterableIterator<number> {
    if (step === 0) {
        throw '0 is a not a valid step size'
    }
    if (start > end || step < 0) {
        return decrementingRange(start, end, step)
    }

    return incrementingRange(start, end, step)
}

function* incrementingRange (start:number, end:number, step:number = 1): IterableIterator<number>{
    var i = start;
    while (i < end) {
        yield i;
        i += step;
    }
}

function* decrementingRange (start:number, end: number, step: number = 1): IterableIterator<number> {
    let i = start;
    while (i > end) {
        yield i;
        i -= step;
    }
}

export class NumRange {
    constructor (
        private readonly start:number,
        private readonly end:number,
        private readonly step?:number
    ) {}

    toClosure (): () => number | undefined{
        let r = range(this.start, this.end, this.step)
        return () => r.next().value
    }
    toArray (): number[] {
        let iter = range(this.start, this.end, this.step)
        return this.map((n)=>n)
    }

    forEach(fn:(n:number)=>void) {
        for (let n of range(this.start, this.end, this.step)){
            fn(n)
        }
    }

    map<T>(fn:(n:number)=>T): T[] {
        const arr = []
        for (let n of range(this.start, this.end, this.step)){
            arr.push(fn(n))
        }
        return arr
    }

    reduce<T>(fn:(memo:T, n:number)=>T, init:T): T {
        let memo = init
        for (let n of range(this.start, this.end, this.step)){
            memo = fn(memo, n)
        }
        return memo;
    }
}

export interface RangeIntermediate {
    to (num:number): NumRange
}

export function from(start: number): RangeIntermediate {
    return {
        to (end): NumRange {
            return new NumRange(start, end)
        }
    }
}
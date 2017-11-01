// export function* range (start:number, end:number) : IterableIterator<number> {
//     var i = start;
//     while (i < end) {
//         yield i;
//         ++i;
//     }
// }

export interface NumberIterator {
    readonly value: number;
    next (): NumberIterator | DoneNumberIterator;
    done: boolean;
}
export interface DoneNumberIterator {
    readonly value: null;
    next (): DoneNumberIterator;
    done: boolean;
}
export type Iter = NumberIterator | DoneNumberIterator

const terminator: DoneNumberIterator = {
    value: null,
    next () {
        return this;
    },
    get done () {
        return true;
    }

}

export function range (start:number, end:number, step:number = 1): Iter {
    if (step === 0) {
        return terminator;
    }
    if (start > end) {
        // reverse
        return decrementingRange(end, start, Math.abs(step))
    } else if (step < 0) {
        return decrementingRange(start, end, Math.abs(step))
    }
    return incrementingRange(start, end, step)
}

function incrementingRange (start:number, end:number, step:number = 1): Iter {

    if (start > end) {
        return terminator
    }
    return {
        value: start,
        next () {
            return range (start + step, end, step)
        },
        get done () {
            return false
        }
    }
}

function decrementingRange (start:number, end: number, step: number = 1): Iter {
    if (start < end) {
        return terminator
    }
    return {
        value: start,
        next () {
            return decrementingRange (start - step, end, step)
        },
        get done () {
            return false
        }
    }
}

export class NumRange {
    constructor (
        private readonly start:number,
        private readonly end:number,
        private readonly step?:number
    ) {}

    toClosure (): () => number | null {
        let iter = range(this.start, this.end, this.step)
        return () => {
            const val = iter.value
            iter = iter.next()
            return val
        }
    }
    toArray (): number[] {
        let iter = range(this.start, this.end, this.step)
        return this.map((n)=>n)
    }

    forEach(fn:(n:number)=>void) {
        let iter = range(this.start, this.end, this.step)
        while (iter.value !== null) {
            fn(iter.value)
            iter = iter.next();
        }
    }

    map<T>(fn:(n:number)=>T): T[] {
        const arr = []
        let iter = range(this.start, this.end, this.step)
        while (iter.value !== null) {
            arr.push(fn(iter.value))
            iter = iter.next();
        }
        return arr
    }

    reduce<T>(fn:(memo:T, n:number)=>T, init:T): T {
        let memo =  init;
        let iter = range(this.start, this.end, this.step)
        while (iter.value !== null) {
            memo = fn(memo, iter.value)
            iter = iter.next();
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
import { describe, expect, it } from 'vitest';
import { AXIS_TICK_COUNT, countAxisDomain } from './chart-axis';

describe('countAxisDomain', () => {
    it('pins the top to the highest count while recharts would subdivide into fractions', () => {
        expect(countAxisDomain([1, 2, 2])).toEqual([0, 2]);
        expect(countAxisDomain([0, 3, 1])).toEqual([0, 3]);
        expect(countAxisDomain([4])).toEqual([0, 4]);
    });

    it('leaves the top automatic once the counts are high enough to tick in whole numbers', () => {
        expect(countAxisDomain([AXIS_TICK_COUNT])).toEqual([0, 'auto']);
        expect(countAxisDomain([3, 12, 7])).toEqual([0, 'auto']);
    });

    it('spans a single step when there is nothing to plot', () => {
        expect(countAxisDomain([])).toEqual([0, 1]);
        expect(countAxisDomain([0, 0])).toEqual([0, 1]);
    });

    it('ignores counts below zero, which no count can be', () => {
        expect(countAxisDomain([-4, 2])).toEqual([0, 2]);
    });

    it('rounds a fractional maximum up to the whole number above it', () => {
        expect(countAxisDomain([1.2])).toEqual([0, 2]);
    });
});

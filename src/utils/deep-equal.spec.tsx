import { test, expect } from '../../playwright/ct-test';
import { deepEqual } from './deep-equal';

test.describe('deepEqual', () => {
    test('should return true for identical primitive values', () => {
        expect(deepEqual(1, 1)).toBe(true);
        expect(deepEqual('a', 'a')).toBe(true);
        expect(deepEqual(true, true)).toBe(true);
        expect(deepEqual(null, null)).toBe(true);
        expect(deepEqual(undefined, undefined)).toBe(true);
    });

    test('should return false for different primitive values', () => {
        expect(deepEqual(1, 2)).toBe(false);
        expect(deepEqual('a', 'b')).toBe(false);
        expect(deepEqual(true, false)).toBe(false);
        expect(deepEqual(1, '1' as unknown as number)).toBe(false);
    });

    test('should return true for same object reference', () => {
        const obj = { a: 1 };
        expect(deepEqual(obj, obj)).toBe(true);
    });

    test('should return true for structurally equal objects', () => {
        expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    });

    test('should return false for objects with different keys', () => {
        expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    test('should return false for objects with different values', () => {
        expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
        expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    test('should return true for equal arrays', () => {
        expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(
            deepEqual(
                [
                    [1, 2],
                    [3, 4],
                ],
                [
                    [1, 2],
                    [3, 4],
                ],
            ),
        ).toBe(true);
    });

    test('should return false for arrays of different length', () => {
        expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
        expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('should return false for arrays with different values', () => {
        expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    test('should return false when one is array and other is object', () => {
        expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
        expect(deepEqual({ 0: 1 }, [1])).toBe(false);
    });

    test('should return false for null vs object', () => {
        expect(deepEqual(null, { a: 1 })).toBe(false);
        expect(deepEqual({ a: 1 }, null)).toBe(false);
    });

    test('should return false for primitive vs object', () => {
        expect(deepEqual(1, {} as unknown as number)).toBe(false);
        expect(deepEqual({} as unknown as number, 1)).toBe(false);
    });
});

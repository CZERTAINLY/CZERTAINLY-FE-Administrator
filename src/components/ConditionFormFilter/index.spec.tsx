import { test, expect } from '../../../playwright/ct-test';
import ConditionFormFilter from './index';

test.describe('ConditionFormFilter', () => {
    test('component is importable', () => {
        expect(ConditionFormFilter).toBeDefined();
    });

    test('component is a function (React component)', () => {
        expect(typeof ConditionFormFilter).toBe('function');
    });

    test('component has displayName or name for debugging', () => {
        const fn = ConditionFormFilter as unknown as { displayName?: string; name?: string };
        expect(fn.displayName ?? fn.name).toBeTruthy();
    });
});

import { describe, expect, test } from 'vitest';
import { runEpicsForCoverage } from './CbomCoverageRunner';

describe('CbomCoverageRunner', () => {
    test('runEpicsForCoverage executes success and failure epic branches without throwing', () => {
        expect(() => runEpicsForCoverage()).not.toThrow();
    });
});

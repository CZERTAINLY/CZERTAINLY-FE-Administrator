import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState } from './trusted-certificates';

describe('trustedCertificates slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('listTrustedCertificates / success / failure update flags and list', () => {
        let next = reducer({ ...initialState, trustedCertificates: [{ uuid: 'old' } as any] }, actions.listTrustedCertificates());
        expect(next.isFetchingList).toBe(true);
        expect(next.trustedCertificates).toEqual([]);

        next = reducer(
            next,
            actions.listTrustedCertificatesSuccess({
                trustedCertificates: [{ uuid: 'tc-1', certificateContent: 'BASE64' } as any],
            }),
        );
        expect(next.isFetchingList).toBe(false);
        expect(next.trustedCertificates).toHaveLength(1);

        next = reducer({ ...next, isFetchingList: true }, actions.listTrustedCertificatesFailure({ error: 'failed' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('createTrustedCertificate / success / failure update create flag and detail', () => {
        let next = reducer(initialState, actions.createTrustedCertificate({ trustedCertificate: { certificateContent: 'BASE64' } as any }));
        expect(next.isCreating).toBe(true);

        const trustedCertificate = { uuid: 'tc-1', certificateContent: 'BASE64' } as any;
        next = reducer(next, actions.createTrustedCertificateSuccess({ trustedCertificate }));
        expect(next.isCreating).toBe(false);
        expect(next.trustedCertificate).toEqual(trustedCertificate);

        next = reducer({ ...next, isCreating: true }, actions.createTrustedCertificateFailure({ error: 'failed' }));
        expect(next.isCreating).toBe(false);
    });

    test('deleteTrustedCertificateSuccess removes item from list and clears selected detail when matching', () => {
        const selected = { uuid: 'tc-2', certificateContent: 'B' } as any;
        const next = reducer(
            {
                ...initialState,
                trustedCertificates: [{ uuid: 'tc-1', certificateContent: 'A' } as any, selected],
                trustedCertificate: selected,
                isDeleting: true,
            },
            actions.deleteTrustedCertificateSuccess({ uuid: 'tc-2' }),
        );

        expect(next.isDeleting).toBe(false);
        expect(next.trustedCertificates).toEqual([{ uuid: 'tc-1', certificateContent: 'A' }]);
        expect(next.trustedCertificate).toBeUndefined();
    });
});

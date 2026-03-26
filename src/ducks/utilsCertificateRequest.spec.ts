import { describe, expect, test } from 'vitest';
import reducer, { actions, initialState, selectors } from './utilsCertificateRequest';
import { ParseRequestRequestDtoParseTypeEnum } from '../types/openapi/utils';

const mockParsedRequest = { subject: 'CN=test' } as any;

describe('utilsCertificateRequest slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('parseCertificateRequest clears result and error, sets isFetchingDetail', () => {
        const dirty = {
            ...initialState,
            parsedCertificateRequest: mockParsedRequest,
            parseError: 'previous error',
            isFetchingDetail: false,
        };

        const next = reducer(
            dirty,
            actions.parseCertificateRequest({ content: 'abc', requestParseType: ParseRequestRequestDtoParseTypeEnum.Basic }),
        );

        expect(next.parsedCertificateRequest).toBeUndefined();
        expect(next.parseError).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);
    });

    test('parseCertificateRequestSuccess stores result and clears isFetchingDetail', () => {
        const next = reducer({ ...initialState, isFetchingDetail: true }, actions.parseCertificateRequestSuccess(mockParsedRequest));

        expect(next.parsedCertificateRequest).toEqual(mockParsedRequest);
        expect(next.isFetchingDetail).toBe(false);
        expect(next.parseError).toBeUndefined();
    });

    test('parseCertificateRequestFailure sets parseError from payload', () => {
        const next = reducer(
            { ...initialState, isFetchingDetail: true },
            actions.parseCertificateRequestFailure({ error: 'Error parsing certification request' }),
        );

        expect(next.isFetchingDetail).toBe(false);
        expect(next.parseError).toBe('Error parsing certification request');
        expect(next.parsedCertificateRequest).toBeUndefined();
    });

    test('parseCertificateRequestFailure uses fallback message when error is undefined', () => {
        const next = reducer({ ...initialState, isFetchingDetail: true }, actions.parseCertificateRequestFailure({ error: undefined }));

        expect(next.parseError).toBe('Failed to parse certificate request');
    });

    test('reset clears parsedCertificateRequest and parseError', () => {
        const dirty = {
            ...initialState,
            parsedCertificateRequest: mockParsedRequest,
            parseError: 'some error',
            isFetchingDetail: false,
        };

        const next = reducer(dirty, actions.reset());

        expect(next.parsedCertificateRequest).toBeUndefined();
        expect(next.parseError).toBeUndefined();
        expect(next.isFetchingDetail).toBe(false);
    });
});

describe('utilsCertificateRequest selectors', () => {
    const rootState = {
        utilsCertificateRequest: {
            parsedCertificateRequest: mockParsedRequest,
            isFetchingDetail: true,
            parseError: 'some error',
        },
    } as any;

    test('parsedCertificateRequest selector returns parsed request', () => {
        expect(selectors.parsedCertificateRequest(rootState)).toEqual(mockParsedRequest);
    });

    test('isFetchingDetail selector returns fetching flag', () => {
        expect(selectors.isFetchingDetail(rootState)).toBe(true);
    });

    test('parseError selector returns error string', () => {
        expect(selectors.parseError(rootState)).toBe('some error');
    });

    test('selectors return undefined for missing state', () => {
        const empty = { utilsCertificateRequest: initialState } as any;
        expect(selectors.parsedCertificateRequest(empty)).toBeUndefined();
        expect(selectors.parseError(empty)).toBeUndefined();
        expect(selectors.isFetchingDetail(empty)).toBe(false);
    });
});

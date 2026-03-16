import { describe, expect, test } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as appRedirectActions } from './app-redirect';
import { actions as trustedCertificatesActions } from './trusted-certificates';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        trustedCertificates: {
            listTrustedCertificates: () => any;
            getTrustedCertificate: (args: { uuid: string }) => any;
            createTrustedCertificate: (args: any) => any;
            deleteTrustedCertificate: (args: { uuid: string }) => any;
        };
    };
};

function createDeps(overrides: Partial<EpicDeps['apiClients']> = {}): EpicDeps {
    const defaultTrustedCertificates = {
        listTrustedCertificates: () => of([{ uuid: 'tc-1', certificateContent: 'BASE64' }]),
        getTrustedCertificate: ({ uuid }: { uuid: string }) => of({ uuid, certificateContent: 'BASE64' }),
        createTrustedCertificate: () => of({ uuid: 'tc-1' }),
        deleteTrustedCertificate: () => of(null),
    };

    return {
        apiClients: {
            trustedCertificates: overrides.trustedCertificates
                ? { ...defaultTrustedCertificates, ...overrides.trustedCertificates }
                : defaultTrustedCertificates,
        },
    };
}

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./trusted-certificates-epics');
    const deps = createDeps(depsOverrides);
    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('trusted certificates epics', () => {
    test('listTrustedCertificates success emits listTrustedCertificatesSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(0, trustedCertificatesActions.listTrustedCertificates(), {}, 2);

        expect(emitted[0].type).toBe(trustedCertificatesActions.listTrustedCertificatesSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfTrustedCertificates));
    });

    test('listTrustedCertificates failure emits listTrustedCertificatesFailure, insertWidgetLock and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            0,
            trustedCertificatesActions.listTrustedCertificates(),
            {
                trustedCertificates: {
                    listTrustedCertificates: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(trustedCertificatesActions.listTrustedCertificatesFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[2]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get Trusted Certificate list' }));
    });

    test('getTrustedCertificate success emits getTrustedCertificateSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(1, trustedCertificatesActions.getTrustedCertificate({ uuid: 'tc-1' }), {}, 2);

        expect(emitted[0].type).toBe(trustedCertificatesActions.getTrustedCertificateSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.TrustedCertificateDetails));
    });

    test('getTrustedCertificate failure emits getTrustedCertificateFailure, insertWidgetLock and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            1,
            trustedCertificatesActions.getTrustedCertificate({ uuid: 'tc-1' }),
            {
                trustedCertificates: {
                    getTrustedCertificate: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(trustedCertificatesActions.getTrustedCertificateFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[2]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get Trusted Certificate details' }));
    });

    test('createTrustedCertificate success emits createTrustedCertificateSuccess and listTrustedCertificates', async () => {
        const emitted = await runEpic(
            2,
            trustedCertificatesActions.createTrustedCertificate({
                trustedCertificate: { certificateContent: 'BASE64_CERT' },
            }),
            {
                trustedCertificates: {
                    createTrustedCertificate: ({ trustedCertificateRequestDto }: any) => {
                        expect(trustedCertificateRequestDto).toEqual({ certificateContent: 'BASE64_CERT' });
                        return of({ uuid: 'tc-created' });
                    },
                    getTrustedCertificate: ({ uuid }: { uuid: string }) => of({ uuid, certificateContent: 'BASE64_CERT' }),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(trustedCertificatesActions.createTrustedCertificateSuccess.type);
        expect(emitted[0]).toEqual(
            trustedCertificatesActions.createTrustedCertificateSuccess({
                trustedCertificate: { uuid: 'tc-created', certificateContent: 'BASE64_CERT' },
            }),
        );
        expect(emitted[1]).toEqual(trustedCertificatesActions.listTrustedCertificates());
    });

    test('createTrustedCertificate failure emits createTrustedCertificateFailure and fetchError', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            2,
            trustedCertificatesActions.createTrustedCertificate({
                trustedCertificate: { certificateContent: 'BASE64_CERT' },
            }),
            {
                trustedCertificates: {
                    createTrustedCertificate: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(trustedCertificatesActions.createTrustedCertificateFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create Trusted Certificate' }));
    });
});

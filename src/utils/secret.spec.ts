import { act, createElement, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, describe, expect, test } from 'vitest';
import { PlatformEnum, SecretState, SecretType } from 'types/openapi';
import { getSecretStatusColor, useGetSecretStatusText } from './secret';
import { createMockStore, withProviders } from './test-helpers';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function UseGetSecretStatusTextHarness({ status, onResolved }: { status: SecretState | SecretType; onResolved: (text: string) => void }) {
    const getText = useGetSecretStatusText();

    useEffect(() => {
        onResolved(getText(status));
    }, [getText, status, onResolved]);

    return createElement('div');
}

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
    if (root) {
        act(() => {
            root?.unmount();
        });
    }
    root = null;
    container?.remove();
    container = null;
});

describe('secret utils', () => {
    describe('getSecretStatusColor', () => {
        test('returns teal for Active', () => {
            expect(getSecretStatusColor(SecretState.Active)).toBe('#14B8A6');
        });

        test('returns dark gray for Inactive', () => {
            expect(getSecretStatusColor(SecretState.Inactive)).toBe('#1F2937');
        });

        test('returns gray for Revoked', () => {
            expect(getSecretStatusColor(SecretState.Revoked)).toBe('#6B7280');
        });

        test('returns light gray for Expired', () => {
            expect(getSecretStatusColor(SecretState.Expired)).toBe('#9CA3AF');
        });

        test('returns red for Failed', () => {
            expect(getSecretStatusColor(SecretState.Failed)).toBe('#EF4444');
        });

        test('returns red for Rejected', () => {
            expect(getSecretStatusColor(SecretState.Rejected)).toBe('#EF4444');
        });

        test('returns blue for PendingApproval', () => {
            expect(getSecretStatusColor(SecretState.PendingApproval)).toBe('#2798E7');
        });

        test('returns default gray for unknown status', () => {
            expect(getSecretStatusColor('unknown' as SecretState)).toBe('#6B7280');
        });
    });

    describe('useGetSecretStatusText', () => {
        test('returns label from SecretState enum', async () => {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);

            let resolved = '';
            const store = createMockStore({
                enums: {
                    platformEnums: {
                        [PlatformEnum.SecretState]: {
                            [SecretState.Active]: { label: 'Active Label' },
                        },
                        [PlatformEnum.SecretType]: {
                            [SecretType.Generic]: { label: 'Generic Label' },
                        },
                    },
                },
            } as any);

            await act(async () => {
                root?.render(
                    withProviders(
                        createElement(UseGetSecretStatusTextHarness, {
                            status: SecretState.Active,
                            onResolved: (text: string) => {
                                resolved = text;
                            },
                        }),
                        { store },
                    ),
                );
            });

            expect(resolved).toBe('Active Label');
        });

        test('returns label from SecretType enum when state label is missing', async () => {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);

            let resolved = '';
            const store = createMockStore({
                enums: {
                    platformEnums: {
                        [PlatformEnum.SecretState]: {},
                        [PlatformEnum.SecretType]: {
                            [SecretType.Generic]: { label: 'Generic Label' },
                        },
                    },
                },
            } as any);

            await act(async () => {
                root?.render(
                    withProviders(
                        createElement(UseGetSecretStatusTextHarness, {
                            status: SecretType.Generic,
                            onResolved: (text: string) => {
                                resolved = text;
                            },
                        }),
                        { store },
                    ),
                );
            });

            expect(resolved).toBe('Generic Label');
        });

        test('returns Unknown when no enum label exists', async () => {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);

            let resolved = '';
            const store = createMockStore({
                enums: {
                    platformEnums: {
                        [PlatformEnum.SecretState]: {},
                        [PlatformEnum.SecretType]: {},
                    },
                },
            } as any);

            await act(async () => {
                root?.render(
                    withProviders(
                        createElement(UseGetSecretStatusTextHarness, {
                            status: SecretState.Inactive,
                            onResolved: (text: string) => {
                                resolved = text;
                            },
                        }),
                        { store },
                    ),
                );
            });

            expect(resolved).toBe('Unknown');
        });

        test('returns Unknown when enum maps are undefined', async () => {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);

            let resolved = '';
            const store = createMockStore({
                enums: {
                    platformEnums: {},
                },
            } as any);

            await act(async () => {
                root?.render(
                    withProviders(
                        createElement(UseGetSecretStatusTextHarness, {
                            status: SecretType.ApiKey,
                            onResolved: (text: string) => {
                                resolved = text;
                            },
                        }),
                        { store },
                    ),
                );
            });

            expect(resolved).toBe('Unknown');
        });
    });
});

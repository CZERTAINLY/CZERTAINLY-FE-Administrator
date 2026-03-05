import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AjaxError } from 'rxjs/ajax';
import { take, toArray } from 'rxjs/operators';
import { AppState, EpicDependencies } from './index';
import * as slice from './login';
import loginEpics from './login-epics';

describe('login epics', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        // @ts-ignore
        delete (window as any).location;
        window.location = { ...originalLocation, assign: vi.fn(), origin: 'http://localhost' } as unknown as Location;
    });

    afterEach(() => {
        window.location = originalLocation;
        vi.unstubAllGlobals();
    });

    test('getLoginMethods success with multiple methods emits getLoginMethodsSuccess', async () => {
        const loginMethods = [
            { name: 'Method 1', loginUrl: 'http://localhost/login1' },
            { name: 'Method 2', loginUrl: 'http://localhost/login2' },
        ];

        const action$ = of(slice.actions.getLoginMethods({ redirect: 'dashboard' }));
        const state$ = of({} as AppState);
        const deps = {
            apiClients: {
                login: {
                    login: vi.fn().mockReturnValue(of(loginMethods)),
                },
            },
        } as unknown as EpicDependencies;

        const output$ = loginEpics[0](action$, state$, deps);
        const emitted = await firstValueFrom(output$.pipe(take(1), toArray()));

        expect(emitted).toEqual([slice.actions.getLoginMethodsSuccess({ loginMethods })]);
        expect(deps.apiClients.login.login).toHaveBeenCalledWith({});
    });

    test('getLoginMethods success with single method redirects', async () => {
        const loginMethods = [{ name: 'Method 1', loginUrl: 'http://localhost/login1' }];

        const action$ = of(slice.actions.getLoginMethods({ redirect: 'dashboard' }));
        const state$ = of({} as AppState);
        const deps = {
            apiClients: {
                login: {
                    login: vi.fn().mockReturnValue(of(loginMethods)),
                },
            },
        } as unknown as EpicDependencies;

        const output$ = loginEpics[0](action$, state$, deps);

        // When there is a redirect, it returns EMPTY, so we use toArray and expect empty
        const emitted = await firstValueFrom(output$.pipe(toArray()));

        expect(emitted).toEqual([]);
        expect(window.location.assign).toHaveBeenCalledWith('http://localhost/login1?redirect=dashboard');
    });

    test('getLoginMethods with absolute loginUrl redirects correctly', async () => {
        const loginMethods = [{ name: 'Method 1', loginUrl: 'https://other-domain.com/login' }];

        const deps = {
            apiClients: {
                login: {
                    login: vi.fn().mockReturnValue(of(loginMethods)),
                },
            },
        } as unknown as EpicDependencies;

        const output$ = loginEpics[0](of(slice.actions.getLoginMethods({ redirect: 'home' })), of({} as AppState), deps);

        await firstValueFrom(output$.pipe(toArray()));

        expect(window.location.assign).toHaveBeenCalledWith('https://other-domain.com/login?redirect=home');
    });

    test('getLoginMethods failure emits getLoginMethodsFailure', async () => {
        const error = new AjaxError('Not Found', { status: 404, response: { message: 'Not Found' } } as any, 'GET', 'url');
        const deps = {
            apiClients: {
                login: {
                    login: vi.fn().mockReturnValue(throwError(() => error)),
                },
            },
        } as unknown as EpicDependencies;

        const action$ = of(slice.actions.getLoginMethods({}));
        const output$ = loginEpics[0](action$, of({} as AppState), deps);
        const emitted = await firstValueFrom(output$.pipe(take(1), toArray()));

        expect(emitted).toEqual([slice.actions.getLoginMethodsFailure({ error: 'Failed to load login methods (404): Not Found' })]);
    });

    test('getLoginMethods catch network error emits getLoginMethodsFailure', async () => {
        const error = new Error('Network failure');
        const deps = {
            apiClients: {
                login: {
                    login: vi.fn().mockReturnValue(throwError(() => error)),
                },
            },
        } as unknown as EpicDependencies;

        const action$ = of(slice.actions.getLoginMethods({}));
        const output$ = loginEpics[0](action$, of({} as AppState), deps);
        const emitted = await firstValueFrom(output$.pipe(take(1), toArray()));

        expect(emitted).toEqual([slice.actions.getLoginMethodsFailure({ error: 'Failed to load login methods. Network failure' })]);
    });
});

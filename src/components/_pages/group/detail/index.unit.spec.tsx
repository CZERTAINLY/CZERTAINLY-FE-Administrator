import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { createMockStore } from 'utils/test-helpers';
import { actions } from 'ducks/certificateGroups';
import { LockTypeEnum, LockWidgetNameEnum } from 'types/user-interface';
import GroupDetail from './index';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('../form', () => ({ default: () => <div>group-form</div> }));
vi.mock('../../../Attributes/CustomAttributeWidget', () => ({ default: () => <div>custom-attributes</div> }));
vi.mock('components/_pages/notifications/events-settings/EventsTable', () => ({ default: () => <div>events-table</div> }));
vi.mock('components/_pages/notifications/events-settings/ObjectEventHistoryWidget', () => ({ default: () => <div>event-history</div> }));

const group = { uuid: 'g1', name: 'Platform operations', email: 'ops@example.com', description: 'Ops group' };
const members = [
    { uuid: 'u1', name: 'alice' },
    { uuid: 'u2', name: 'bob' },
];

type GroupsState = { certificateGroup?: typeof group; groupUsers?: typeof members; isFetchingGroupUsers?: boolean };

function buildStore(groups: GroupsState, widgetLocks: unknown[] = []) {
    return createMockStore({
        certificateGroups: { certificateGroup: group, groupUsers: [], isFetchingGroupUsers: false, ...groups } as never,
        userInterface: { widgetLocks } as never,
    });
}

describe('GroupDetail users tab', () => {
    let container: HTMLDivElement;
    let root: Root;

    const render = async (store: ReturnType<typeof createMockStore>, initialUrl = '/groups/detail/g1') => {
        await act(async () => {
            root.render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={[initialUrl]}>
                        <Routes>
                            <Route path="/groups/detail/:id" element={<GroupDetail />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
    };

    const clickTab = async (title: string) => {
        const tab = [...container.querySelectorAll('button')].find((button) => button.textContent?.trim() === title);
        expect(tab).toBeDefined();
        await act(async () => tab?.click());
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        vi.clearAllMocks();
    });

    it('requests the group detail on mount but leaves the members until the Users tab is opened', async () => {
        const store = buildStore({});
        const dispatch = vi.spyOn(store, 'dispatch');
        await render(store);

        expect(dispatch).toHaveBeenCalledWith(actions.getGroupDetail({ uuid: 'g1' }));
        expect(dispatch).not.toHaveBeenCalledWith(actions.getGroupUsers({ uuid: 'g1' }));

        await clickTab('Users');
        expect(dispatch).toHaveBeenCalledWith(actions.getGroupUsers({ uuid: 'g1' }));
    });

    it('requests the members when the page opens straight on the Users tab', async () => {
        const store = buildStore({});
        const dispatch = vi.spyOn(store, 'dispatch');
        await render(store, '/groups/detail/g1?tab=users');

        expect(dispatch).toHaveBeenCalledWith(actions.getGroupUsers({ uuid: 'g1' }));
    });

    it('lists each member as a link to the user detail page on the Users tab', async () => {
        await render(buildStore({ groupUsers: members }));
        await clickTab('Users');

        const links = [...container.querySelectorAll('a')].filter((a) => a.getAttribute('href')?.includes('/users/detail/'));
        expect(links.map((a) => a.textContent)).toEqual(['alice', 'bob']);
        expect(links.map((a) => a.getAttribute('href'))).toEqual(['/users/detail/u1', '/users/detail/u2']);
        expect(container.textContent).toContain('u1');
    });

    it('opens the Users tab straight from the URL', async () => {
        await render(buildStore({ groupUsers: members }), '/groups/detail/g1?tab=users');
        expect(container.textContent).toContain('alice');
    });

    it('shows the group-specific empty state when nobody is assigned', async () => {
        await render(buildStore({ groupUsers: [] }));
        await clickTab('Users');

        expect(container.textContent).toContain('No items to show');
        expect(container.textContent).toContain('No users are assigned to this group');
    });

    it('locks only the Users widget when the members call is refused', async () => {
        const lock = {
            widgetName: LockWidgetNameEnum.GroupUsers,
            lockTitle: 'Access Denied',
            lockText: 'Please contact your admin to get access',
            lockType: LockTypeEnum.PERMISSION,
        };
        await render(buildStore({}, [lock]));

        expect(container.textContent).toContain('Platform operations');
        expect(container.textContent).not.toContain('Access Denied');

        await clickTab('Users');
        expect(container.textContent).toContain('Access Denied');
        expect(container.textContent).toContain('Please contact your admin to get access');
    });
});

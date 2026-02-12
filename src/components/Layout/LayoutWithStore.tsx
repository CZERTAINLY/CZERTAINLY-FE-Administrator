import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
import { createMockStore } from 'utils/test-helpers';
import Layout from './index';

export default function LayoutWithStore() {
    const store = createMockStore();
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<div data-testid="layout-outlet">Outlet content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>
    );
}

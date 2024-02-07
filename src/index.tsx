import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'reactflow/dist/style.css';
import AppRouter from './components/AppRouter';
import reportWebVitals from './reportWebVitals';
import configureStore from './store';

import './resources/styles/theme.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);

export const store = configureStore();

root.render(
    process.env.NODE_ENV === 'development' ? (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    ) : (
        <React.StrictMode>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </React.StrictMode>
    ),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

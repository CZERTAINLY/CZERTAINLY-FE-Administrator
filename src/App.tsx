import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import AppRouter from './components/AppRouter';
import configureStore from './store';

export const store = configureStore();

const App = () => {
    const [theme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;

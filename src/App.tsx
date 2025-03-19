import { Provider } from 'react-redux';
import AppRouter from './components/AppRouter';
import configureStore from './store';

export const store = configureStore();

const App = () => {
    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;

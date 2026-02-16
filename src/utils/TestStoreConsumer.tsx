import { useSelector } from 'react-redux';

export default function TestStoreConsumer() {
    const connected = useSelector(() => true);
    return <span data-testid="consumer">{connected ? 'has-store' : 'no-store'}</span>;
}

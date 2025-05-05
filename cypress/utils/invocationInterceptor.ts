type ListenerCallback<T> = (data: T) => void;

const invocationResults: Record<string, any[]> = {};
const pendingListeners: Record<string, ListenerCallback<any>> = {};

// Generate test-specific full listener id
function getFullListenerId(listenerId: string) {
    const titlePath = Cypress?.currentTest?.titlePath?.join('>')?.replace(/\s+/g, '_') ?? 'unknown';
    return `${titlePath}::${listenerId}`;
}

export function createInvocationInterceptor<TArgs extends any[] = any[], TTransformed = TArgs[number]>(
    listenerId: string,
    transform: (...args: TArgs) => TTransformed,
) {
    function invocationInterceptor(...data: TArgs): void {
        const fullListenerId = getFullListenerId(listenerId);
        const transformedData = [transform(...data)];
        invocationResults[fullListenerId] = transformedData;

        const callback = pendingListeners[fullListenerId];
        if (callback) {
            delete pendingListeners[fullListenerId];
            callback(transformedData[0]);
        }
    }

    function invocationListener(callback: (data: TTransformed) => void, timeout = 6000): void {
        const fullListenerId = getFullListenerId(listenerId);

        if (invocationResults.hasOwnProperty(fullListenerId)) {
            callback(invocationResults[fullListenerId][0]);
            return;
        }

        const timer = setTimeout(() => {
            if (pendingListeners[fullListenerId]) {
                delete pendingListeners[fullListenerId];
                throw new Error(`Timeout waiting for invocation: "${listenerId}".\nFull listener id: "${fullListenerId}"`);
            }
        }, timeout);

        pendingListeners[fullListenerId] = (data: TTransformed) => {
            clearTimeout(timer);
            callback(data);
        };
    }

    return {
        invocationInterceptor,
        invocationListener,
    };
}

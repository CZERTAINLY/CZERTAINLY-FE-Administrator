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

    function invocationListener(callback: (data: TTransformed) => void, timeout = 4000): void {
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

// type ListenerCallback = (...data: any[]) => void;

// const invocationResults: Record<string, any[]> = {};
// const pendingListeners: Record<string, ListenerCallback> = {};

// // Used to separate the contexts of two different tests
// function getFullListenerId(listenerId: string) {
//     const titlePath = Cypress?.currentTest?.titlePath?.join('>').replace(/\s+/g, '_') ?? 'unknown';
//     return `${titlePath}::${listenerId}`;
// }

// // Returns a callback, which when called, will save the arguments based on the listenerId.
// //
// export function createInvocationInterceptor(listenerId: string, transform?: (...args: any[]) => any) {
//     const fullListenerId = getFullListenerId(listenerId);

//     return (...data: any[]) => {
//         const transformedData = transform ? [transform(...data)] : data;
//         invocationResults[fullListenerId] = transformedData;

//         const callback = pendingListeners[fullListenerId];
//         if (callback) {
//             delete pendingListeners[fullListenerId];
//             callback(transformedData);
//         }
//     };
// }

// export function interceptInvocation<TArgs = any, TRes = any>(listenerId: string, callback: (arg: TArgs) => TRes, timeout: number = 4000) {
//     const fullListenerId = getFullListenerId(listenerId);

//     return cy
//         .wrap(
//             new Promise((resolve, reject) => {
//                 if (invocationResults.hasOwnProperty(fullListenerId)) {
//                     resolve(invocationResults[fullListenerId][0]);
//                     return;
//                 }

//                 const timer = setTimeout(() => {
//                     if (pendingListeners[fullListenerId]) {
//                         delete pendingListeners[fullListenerId];
//                         reject(new Error(`Timeout waiting for invocation: "${listenerId}".\nFull listener id: "${fullListenerId}"`));
//                     }
//                 }, timeout);

//                 pendingListeners[fullListenerId] = (...data: any[]) => {
//                     clearTimeout(timer);
//                     resolve(data[0]);
//                 };
//             }),
//         )
//         .then((arg) => callback(arg as any));
// }

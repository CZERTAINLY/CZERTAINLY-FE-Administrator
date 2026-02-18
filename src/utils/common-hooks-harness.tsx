import { useEffect, useState } from 'react';
import { useWindowSize, useDeviceType, useCopyToClipboard, useRunOnFinished, useAreDefaultValuesSame } from './common-hooks';

export function UseWindowSizeHarness() {
    const { width, height } = useWindowSize();
    return (
        <div data-testid="window-size">
            <span data-testid="width">{width}</span>
            <span data-testid="height">{height}</span>
        </div>
    );
}

export function UseDeviceTypeHarness() {
    const device = useDeviceType();
    return <div data-testid="device-type">{device}</div>;
}

export function UseCopyToClipboardHarness() {
    const copyToClipboard = useCopyToClipboard();
    return (
        <button type="button" data-testid="copy-btn" onClick={() => copyToClipboard('copied text', 'Success', 'Error')}>
            Copy
        </button>
    );
}

export function UseRunOnFinishedHarness() {
    const [flag, setFlag] = useState(true);
    const [callbackRan, setCallbackRan] = useState(false);
    useRunOnFinished(flag, () => setCallbackRan(true));

    useEffect(() => {
        const t = setTimeout(() => setFlag(false), 100);
        return () => clearTimeout(t);
    }, []);

    return <div data-testid="run-result">{callbackRan ? 'ran' : 'pending'}</div>;
}

export function UseAreDefaultValuesSameHarness() {
    const defaultValues = { a: 1, b: 'x' };
    const areSame = useAreDefaultValuesSame(defaultValues);
    const same = areSame({ a: 1, b: 'x' });
    const diff = areSame({ a: 2, b: 'x' });
    const diffKeys = areSame({ a: 1, b: 'x', c: 3 });
    return (
        <div data-testid="compare-result">
            <span data-testid="same">{String(same)}</span>
            <span data-testid="diff">{String(diff)}</span>
            <span data-testid="diff-keys">{String(diffKeys)}</span>
        </div>
    );
}

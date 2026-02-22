import { useLayoutEffect, useMemo, useState } from 'react';
import Select from './index';

export function SelectHSSelectValueChangeHarness() {
    const [value, setValue] = useState<string>('1');
    const options = useMemo(
        () => [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
        ],
        [],
    );

    useLayoutEffect(() => {
        const state = { close: 0, destroy: 0, autoInit: 0 };
        (window as any).__hsState = state;
        const instance = {
            isOpened: () => true,
            close: () => {
                state.close += 1;
            },
            destroy: () => {
                state.destroy += 1;
            },
        };
        (window as any).HSSelect = {
            getInstance: () => instance,
            autoInit: () => {
                state.autoInit += 1;
            },
        };
        return () => {
            delete (window as any).__hsState;
            delete (window as any).HSSelect;
        };
    }, []);

    return (
        <div>
            <button data-testid="set-second" onClick={() => setValue('2')}>
                set second
            </button>
            <Select id="hs-value-change" value={value} onChange={() => {}} options={options} />
        </div>
    );
}

export function SelectTooltipSyncHarness() {
    const options = [{ value: '1', label: 'One' }];

    useLayoutEffect(() => {
        const dropdown = document.createElement('div');
        dropdown.id = 'hs-tooltip-dropdown';
        dropdown.className = 'hs-select-dropdown';
        dropdown.innerHTML = `
          <div class="hs-select-option-row">
            <span data-title>Option title</span>
            <span data-tooltip-content></span>
          </div>
        `;
        document.body.appendChild(dropdown);
        (window as any).__tooltipCalls = 0;
        (window as any).HSSelect = {
            getInstance: () => ({ dropdown }),
            autoInit: () => {},
        };
        (window as any).HSTooltip = {
            autoInit: () => {
                (window as any).__tooltipCalls += 1;
            },
        };
        return () => {
            dropdown.remove();
            delete (window as any).__tooltipCalls;
            delete (window as any).HSSelect;
            delete (window as any).HSTooltip;
        };
    }, []);

    return <Select id="hs-tooltip-sync" value="" onChange={() => {}} options={options} />;
}

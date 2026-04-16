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

// ---------------------------------------------------------------------------
// Single-select where options arrive AFTER the value is already set.
// ---------------------------------------------------------------------------
export function SelectLateOptionsSingleHarness() {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useLayoutEffect(() => {
        const state: { destroy: number; autoInit: number; valueAtAutoInit: string[] } = {
            destroy: 0,
            autoInit: 0,
            valueAtAutoInit: [],
        };
        (window as any).__hsLateSingleState = state;
        (window as any).HSSelect = {
            getInstance: (el: HTMLSelectElement) => ({
                isOpened: () => false,
                close: () => {},
                destroy: () => {
                    state.destroy += 1;
                    el.value = ''; // simulate real HSSelect clearing value on destroy
                },
            }),
            autoInit: () => {
                state.autoInit += 1;
                const sel = document.getElementById('hs-late-single') as HTMLSelectElement | null;
                state.valueAtAutoInit.push(sel?.value ?? '');
            },
        };
        return () => {
            delete (window as any).__hsLateSingleState;
            delete (window as any).HSSelect;
        };
    }, []);

    return (
        <div>
            <button data-testid="load-single-options" onClick={() => setOptions([{ value: 'uuid-123', label: 'TQC Name' }])}>
                Load Options
            </button>
            <Select id="hs-late-single" value="uuid-123" onChange={() => {}} options={options} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Multi-select where options arrive AFTER the value is already set.
// ---------------------------------------------------------------------------
export function SelectLateOptionsMultiHarness() {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useLayoutEffect(() => {
        const state: { destroy: number; autoInit: number; selectedAtAutoInit: string[][] } = {
            destroy: 0,
            autoInit: 0,
            selectedAtAutoInit: [],
        };
        (window as any).__hsLateMultiState = state;
        (window as any).HSSelect = {
            getInstance: (el: HTMLSelectElement) => ({
                isOpened: () => false,
                close: () => {},
                destroy: () => {
                    state.destroy += 1;
                    Array.from(el.options).forEach((o) => {
                        o.selected = false; // simulate real HSSelect deselecting all on destroy
                    });
                },
            }),
            autoInit: () => {
                state.autoInit += 1;
                const sel = document.getElementById('hs-late-multi') as HTMLSelectElement | null;
                state.selectedAtAutoInit.push(sel ? Array.from(sel.selectedOptions).map((o) => o.value) : []);
            },
        };
        return () => {
            delete (window as any).__hsLateMultiState;
            delete (window as any).HSSelect;
        };
    }, []);

    return (
        <div>
            <button
                data-testid="load-multi-options"
                onClick={() =>
                    setOptions([
                        { value: 'uuid-a', label: 'Option A' },
                        { value: 'uuid-b', label: 'Option B' },
                    ])
                }
            >
                Load Options
            </button>
            <Select
                id="hs-late-multi"
                value={[
                    { value: 'uuid-a', label: 'Option A' },
                    { value: 'uuid-b', label: 'Option B' },
                ]}
                onChange={() => {}}
                options={options}
                isMulti={true}
            />
        </div>
    );
}

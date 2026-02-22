import { useState } from 'react';
import MultipleValueTextInput from './index';

const initialA = [{ value: 'a1', label: 'A1' }];
const initialB = [
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
];

export default function MultipleValueTextInputTestWrapper() {
    const [opts, setOpts] = useState<typeof initialA>(initialA);
    const [values, setValues] = useState<string[]>([]);
    return (
        <div>
            <button type="button" data-testid="switch-options" onClick={() => setOpts(opts === initialA ? initialB : initialA)}>
                Switch
            </button>
            <MultipleValueTextInput selectedValues={values} onValuesChange={setValues} initialOptions={opts} />
        </div>
    );
}

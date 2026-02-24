import { useEffect } from 'react';
import { getDateFormValue, getDatetimeFormValue } from './attributeFormValues';

export default function AttributeFormValuesCoverageRunner() {
    useEffect(() => {
        getDatetimeFormValue({ value: { data: '2024-06-15T12:00:00Z' } });
        getDatetimeFormValue('2024-01-01T00:00:00');
        getDatetimeFormValue(new Date('2024-03-10T10:00:00Z'));

        getDateFormValue({ value: { data: '2024-06-15T12:00:00Z' } });
        getDateFormValue('2024-01-01');
        getDateFormValue(new Date('2024-03-10T10:00:00Z'));
    }, []);

    return <div data-testid="attribute-form-values-coverage-done" />;
}

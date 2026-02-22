import React from 'react';
import * as ReactHookForm from 'react-hook-form';
import { AttributeFieldSelect } from './AttributeFieldSelect';
import type { DataAttributeModel } from 'types/attributes';

export interface AttributeFieldSelectTestWrapperProps {
    name: string;
    descriptor: DataAttributeModel;
    options?: { label: string; value: string | number }[];
    busy?: boolean;
    deleteButton?: React.ReactNode;
    addNewAttributeValue?: { label: string; value: string; disabled?: boolean };
    defaultValues?: Record<string, unknown>;
}

export function AttributeFieldSelectTestWrapper({
    name,
    descriptor,
    options = [],
    busy = false,
    deleteButton,
    addNewAttributeValue,
    defaultValues = {},
}: AttributeFieldSelectTestWrapperProps) {
    const methods = ReactHookForm.useForm({
        defaultValues: {
            [name]: undefined,
            ...defaultValues,
        },
    });

    const onSelectChangeMulti = (fieldOnChange: (v: unknown) => void) => (newValue: unknown) => fieldOnChange(newValue);
    const onSelectChangeSingle = (fieldOnChange: (v: unknown) => void) => (newValue: unknown) => fieldOnChange(newValue);

    return (
        <ReactHookForm.FormProvider {...methods}>
            <AttributeFieldSelect
                name={name}
                descriptor={descriptor}
                options={options}
                busy={busy}
                deleteButton={deleteButton}
                addNewAttributeValue={addNewAttributeValue}
                onSelectChangeMulti={onSelectChangeMulti}
                onSelectChangeSingle={onSelectChangeSingle}
            />
        </ReactHookForm.FormProvider>
    );
}

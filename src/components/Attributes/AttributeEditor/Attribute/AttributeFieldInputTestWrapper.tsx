import React from 'react';
import * as ReactHookForm from 'react-hook-form';
import { AttributeFieldInput } from './AttributeFieldInput';
import type { DataAttributeModel } from 'types/attributes';

export interface AttributeFieldInputTestWrapperProps {
    name: string;
    descriptor: DataAttributeModel;
    busy?: boolean;
    deleteButton?: React.ReactNode;
    defaultValues?: Record<string, unknown>;
}

export function AttributeFieldInputTestWrapper({
    name,
    descriptor,
    busy = false,
    deleteButton,
    defaultValues = {},
}: AttributeFieldInputTestWrapperProps) {
    const methods = ReactHookForm.useForm({
        defaultValues: {
            [name]: undefined,
            ...defaultValues,
        },
    });
    return (
        <ReactHookForm.FormProvider {...methods}>
            <AttributeFieldInput
                name={name}
                descriptor={descriptor}
                busy={busy}
                deleteButton={deleteButton}
            />
        </ReactHookForm.FormProvider>
    );
}

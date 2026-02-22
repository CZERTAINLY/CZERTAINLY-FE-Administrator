import React from 'react';
import * as ReactHookForm from 'react-hook-form';
import ContentDescriptorField from './index';
import { AttributeContentType } from 'types/openapi';

export interface ContentDescriptorFieldTestWrapperProps {
    isList: boolean;
    contentType: AttributeContentType;
    defaultContent?: unknown[];
    readOnly?: boolean;
}

export function ContentDescriptorFieldTestWrapper({
    isList,
    contentType,
    defaultContent = [{ data: '' }],
    readOnly = false,
}: ContentDescriptorFieldTestWrapperProps) {
    const methods = ReactHookForm.useForm({
        defaultValues: {
            content: defaultContent,
            readOnly,
        },
        mode: 'onTouched',
    });
    return (
        <ReactHookForm.FormProvider {...methods}>
            <ContentDescriptorField isList={isList} contentType={contentType} />
        </ReactHookForm.FormProvider>
    );
}

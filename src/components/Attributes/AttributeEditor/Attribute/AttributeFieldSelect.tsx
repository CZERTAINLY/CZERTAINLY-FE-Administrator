import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'components/Select';
import Label from 'components/Label';
import type { CustomAttributeModel, DataAttributeModel } from 'types/attributes';
import { getSelectValueFromField, buildAttributeValidators } from './attributeHelpers';

interface AttributeFieldSelectProps {
    name: string;
    descriptor: DataAttributeModel | CustomAttributeModel;
    options?: { label: string; value: any }[];
    busy: boolean;
    deleteButton?: React.ReactNode;
    addNewAttributeValue?: { label: string; value: string; disabled?: boolean };
    onSelectChangeMulti: (fieldOnChange: (v: any) => void) => (newValue: any) => void;
    onSelectChangeSingle: (fieldOnChange: (v: any) => void) => (newValue: any) => void;
}

export function AttributeFieldSelect({
    name,
    descriptor,
    options = [],
    busy,
    deleteButton,
    addNewAttributeValue,
    onSelectChangeMulti,
    onSelectChangeSingle,
}: AttributeFieldSelectProps): React.ReactNode {
    const { control } = useFormContext<Record<string, any>>();
    const selectOptions = addNewAttributeValue ? [...options, { label: '+', value: '__add_new__', disabled: false }] : options;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: buildAttributeValidators(descriptor) }}
            render={({ field, fieldState }) => {
                const selectValue = getSelectValueFromField(field.value, descriptor.properties.multiSelect);
                const invalidClass = fieldState.isTouched && fieldState.invalid ? 'border-red-500' : '';

                return (
                    <>
                        {descriptor.properties.visible && (
                            <Label htmlFor={`${name}Select`} required={descriptor.properties.required}>
                                {descriptor.properties.label}
                            </Label>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                {descriptor.properties.multiSelect ? (
                                    <Select
                                        id={`${name}Select`}
                                        value={selectValue as { value: string | number; label: string }[]}
                                        onChange={onSelectChangeMulti(field.onChange)}
                                        options={selectOptions}
                                        placeholder={`Select ${descriptor.properties.label}`}
                                        isDisabled={descriptor.properties.readOnly || busy}
                                        isMulti={true}
                                        isClearable={!descriptor.properties.required}
                                        className={invalidClass}
                                    />
                                ) : (
                                    <Select
                                        id={`${name}Select`}
                                        value={selectValue as string | number | { value: string | number; label: string }}
                                        onChange={onSelectChangeSingle(field.onChange)}
                                        options={selectOptions}
                                        placeholder={`Select ${descriptor.properties.label}`}
                                        isDisabled={descriptor.properties.readOnly || busy}
                                        isMulti={false}
                                        isClearable={!descriptor.properties.required}
                                        className={invalidClass}
                                    />
                                )}
                            </div>
                            {deleteButton}
                        </div>
                        {descriptor.properties.visible && (
                            <>
                                {descriptor.description && (
                                    <p className="text-xs text-gray-400 mt-1 dark:text-neutral-400">{descriptor.description}</p>
                                )}
                                {fieldState.isTouched && fieldState.invalid && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                );
            }}
        />
    );
}

import React from 'react';
import { test, expect } from '../../../../playwright/ct-test';
import { AddCustomValueInput } from './AddCustomValueInput';
import { AttributeContentType } from 'types/openapi';

const defaultProps = {
    value: '' as string | number | boolean,
    onChange: () => {},
    readOnly: false,
    fieldStepValue: undefined as number | undefined,
};

test.describe('AddCustomValueInput', () => {
    test('renders text input for text type', async ({ mount, page }) => {
        await mount(<AddCustomValueInput {...defaultProps} id="test-custom" inputType="text" contentType={AttributeContentType.String} />);
        const input = page.getByRole('textbox');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('type', 'text');
    });

    test('renders number input for number type', async ({ mount, page }) => {
        await mount(
            <AddCustomValueInput
                {...defaultProps}
                id="num-custom"
                inputType="number"
                contentType={AttributeContentType.Integer}
                fieldStepValue={1}
            />,
        );
        const input = page.getByRole('spinbutton');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('type', 'number');
    });

    test('renders textarea for text (textarea) type', async ({ mount, page }) => {
        await mount(
            <AddCustomValueInput {...defaultProps} id="textarea-custom" inputType="textarea" contentType={AttributeContentType.Text} />,
        );
        const input = page.getByRole('textbox');
        await expect(input).toBeVisible();
    });

    test('number input has step attribute', async ({ mount, page }) => {
        await mount(
            <AddCustomValueInput
                {...defaultProps}
                id="step-custom"
                inputType="number"
                contentType={AttributeContentType.Float}
                fieldStepValue={0.1}
            />,
        );
        const input = page.getByRole('spinbutton');
        await expect(input).toHaveAttribute('step', '0.1');
    });

    test('readOnly disables input', async ({ mount, page }) => {
        await mount(
            <AddCustomValueInput
                {...defaultProps}
                id="readonly-custom"
                inputType="text"
                contentType={AttributeContentType.String}
                readOnly={true}
            />,
        );
        const input = page.getByRole('textbox');
        await expect(input).toBeDisabled();
    });

    test('date type renders an input', async ({ mount, page }) => {
        await mount(<AddCustomValueInput {...defaultProps} id="date-custom" inputType="date" contentType={AttributeContentType.Date} />);
        await expect(page.locator('#date-custom')).toBeVisible();
    });

    test('time type renders input', async ({ mount, page }) => {
        await mount(<AddCustomValueInput {...defaultProps} id="time-custom" inputType="time" contentType={AttributeContentType.Time} />);
        const input = page.locator('input[type="time"]');
        await expect(input).toBeVisible();
    });

    test('number input parses integer values via onChange', async ({ mount, page }) => {
        let lastValue: unknown = undefined;
        await mount(
            <AddCustomValueInput
                {...defaultProps}
                id="num-parse-int"
                inputType="number"
                contentType={AttributeContentType.Integer}
                fieldStepValue={1}
                onChange={(v) => {
                    lastValue = v;
                }}
            />,
        );
        const input = page.getByRole('spinbutton');
        await input.fill('42');

        await expect
            .poll(() => lastValue, {
                message: 'onChange should receive parsed integer',
            })
            .toBe(42);
    });

    test('number input parses float values via onChange', async ({ mount, page }) => {
        let lastValue: unknown = undefined;
        await mount(
            <AddCustomValueInput
                {...defaultProps}
                id="num-parse-float"
                inputType="number"
                contentType={AttributeContentType.Float}
                fieldStepValue={0.1}
                onChange={(v) => {
                    lastValue = v;
                }}
            />,
        );
        const input = page.getByRole('spinbutton');
        await input.fill('3.14');

        await expect
            .poll(() => lastValue, {
                message: 'onChange should receive parsed float',
            })
            .toBeCloseTo(3.14);
    });
});

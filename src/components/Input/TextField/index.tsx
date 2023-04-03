import { Field } from "react-final-form";
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { composeValidators } from "utils/validators";

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    inputType?: InputType;
    description?: string;
    validators: ((value: any) => string | undefined | Promise<string | undefined>)[];
};

export default function TextField({ id, label, inputType, disabled = false, validators, description }: Props) {
    return (
        <Field name={id} validate={composeValidators(...validators)}>
            {({ input, meta }) => (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        {...input}
                        valid={!meta.error && meta.touched}
                        invalid={!!meta.error && meta.touched}
                        type={inputType ?? "text"}
                        id={id}
                        placeholder={label}
                        disabled={disabled}
                    />
                    {description && <FormText>{description}</FormText>}
                    <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
            )}
        </Field>
    );
}

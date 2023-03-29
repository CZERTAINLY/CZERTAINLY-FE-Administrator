import { Field } from "react-final-form";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { composeValidators } from "utils/validators";

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    validators: ((value: any) => string | undefined | Promise<string | undefined>)[];
};

export default function TextField({ id, label, disabled = false, validators }: Props) {
    return (
        <Field name={id} validate={composeValidators(...validators)}>
            {({ input, meta }) => (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        {...input}
                        valid={!meta.error && meta.touched}
                        invalid={!!meta.error && meta.touched}
                        type="text"
                        id={id}
                        placeholder={label}
                        disabled={disabled}
                    />
                    <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
            )}
        </Field>
    );
}

import { Field } from "react-final-form";
import { FormGroup, Input, Label } from "reactstrap";

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    checked?: boolean;
};

export default function SwitchField({ id, label, onChange = undefined, disabled = false, checked = false }: Props) {
    return (
        <Field name={id} type={"checkbox"}>
            {({ input }) => (
                <FormGroup switch>
                    <Input
                        {...input}
                        type="switch"
                        id={id}
                        disabled={disabled}
                        checked={checked}
                        onChange={(e) => {
                            input.onChange(e);
                            if (onChange) {
                                onChange(e.target.checked);
                            }
                        }}
                    />
                    <Label for={id}>{label}</Label>
                </FormGroup>
            )}
        </Field>
    );
}

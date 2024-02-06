import { Field } from 'react-final-form';
import { FormGroup, Input, Label } from 'reactstrap';

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
};

export default function CheckboxField({ id, label, onChange = undefined, disabled = false }: Props) {
    return (
        <Field name={id} type={'checkbox'}>
            {({ input }) => (
                <FormGroup>
                    <Input
                        {...input}
                        type="checkbox"
                        id={id}
                        disabled={disabled}
                        onChange={(e) => {
                            input.onChange(e);
                            if (onChange) {
                                onChange(e.target.checked);
                            }
                        }}
                    />
                    &nbsp;<Label for={id}>{label}</Label>
                </FormGroup>
            )}
        </Field>
    );
}

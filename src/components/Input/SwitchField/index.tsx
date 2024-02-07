import { Field } from 'react-final-form';
import { FormGroup, Input, Label } from 'reactstrap';

type viewOnly = {
    checked: boolean;
};

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    viewOnly?: viewOnly;
};

export default function SwitchField({ id, label, onChange = undefined, disabled = false, viewOnly }: Props) {
    return !viewOnly ? (
        <Field name={id} type={'checkbox'}>
            {({ input }) => (
                <FormGroup switch>
                    <Input
                        {...input}
                        type="switch"
                        id={id}
                        disabled={disabled}
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
    ) : (
        <FormGroup switch>
            <Input type="switch" id={id} disabled checked={viewOnly.checked} />
            <Label for={id}>{label}</Label>
        </FormGroup>
    );
}

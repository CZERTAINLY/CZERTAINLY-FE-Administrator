import cx from 'classnames';
import { Field } from 'react-final-form';
import { FormFeedback, FormGroup, FormText, Input, InputGroup, InputGroupText, Label } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import { composeValidators } from 'utils/validators';
import styles from './TextField.module.scss';

interface InputGroupIcon {
    icon: string;
    text?: string;
    onClick?: () => void;
}

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    inputType?: InputType;
    description?: string | JSX.Element;
    validators: ((value: any) => string | undefined | Promise<string | undefined>)[];
    inputGroupIcon?: InputGroupIcon;
};

export default function TextField({ id, label, inputType, disabled = false, validators, description, inputGroupIcon }: Props) {
    return (
        <Field name={id} validate={composeValidators(...validators)}>
            {({ input, meta }) => (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <InputGroup>
                        <Input
                            {...input}
                            valid={!meta.error && meta.touched}
                            invalid={!!meta.error && meta.touched}
                            type={inputType ?? 'text'}
                            id={id}
                            placeholder={label}
                            disabled={disabled}
                        />
                        {inputGroupIcon?.icon && (
                            <InputGroupText
                                className={cx({ [styles.inputGroupStyle]: !!inputGroupIcon?.onClick })}
                                onClick={() => (inputGroupIcon?.onClick ? inputGroupIcon?.onClick() : {})}
                            >
                                {inputGroupIcon?.text && <span className="me-2">{inputGroupIcon.text}</span>}
                                <i className={cx('fa', inputGroupIcon?.icon, styles.inputGroupIconStyle)} />
                            </InputGroupText>
                        )}
                    </InputGroup>
                    {description && <FormText>{description}</FormText>}
                    <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
            )}
        </Field>
    );
}

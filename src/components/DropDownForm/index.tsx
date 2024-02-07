import ProgressButton from 'components/ProgressButton';
import { Field, Form } from 'react-final-form';
import { Form as BootstrapForm, Button, ButtonGroup, Container } from 'reactstrap';

import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';

import { validateRequired } from 'utils/validators';
import style from './dropDownForm.module.scss';
interface DropDownOptions {
    label: string;
    value: string | number;
}

interface DropDownOptionsData {
    formLabel: string;
    formValue: string;
    options: DropDownOptions[];
}

interface Props {
    dropDownOptionsList: DropDownOptionsData[];
    onSubmit: (values: Record<string, any>) => void;
    onClose: () => void;
    isBusy?: boolean;
}
const DropDownListForm = ({ onSubmit, onClose, dropDownOptionsList, isBusy = false }: Props) => {
    return (
        <Container className={style.certificateDownloadContainer}>
            <Form onSubmit={onSubmit}>
                {({ handleSubmit, submitting, valid, values, errors, pristine }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        {dropDownOptionsList.map((dropDownOptionsListItem, i) => {
                            return (
                                <Field key={i} name={dropDownOptionsListItem.formValue} validate={validateRequired()}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label for={dropDownOptionsListItem.formValue}>{dropDownOptionsListItem.formLabel}</Label>
                                            <Select
                                                {...input}
                                                id={dropDownOptionsListItem.formValue}
                                                maxMenuHeight={140}
                                                menuPlacement="auto"
                                                options={dropDownOptionsListItem.options}
                                                placeholder={`Select ${dropDownOptionsListItem.formLabel}`}
                                                isClearable={true}
                                            />
                                        </FormGroup>
                                    )}
                                </Field>
                            );
                        })}
                        <div className="d-flex">
                            <ButtonGroup className="ms-auto">
                                <ProgressButton
                                    inProgress={isBusy}
                                    title={isBusy ? 'Submitting' : 'Submit'}
                                    type="submit"
                                    color="primary"
                                    disabled={pristine || isBusy || !valid}
                                    onClick={handleSubmit}
                                />

                                <Button type="button" color="secondary" disabled={isBusy} onClick={onClose}>
                                    Close
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>{' '}
        </Container>
    );
};

export default DropDownListForm;

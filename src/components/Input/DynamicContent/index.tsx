import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { Field, useForm, useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import { AttributeContentType, PlatformEnum } from 'types/openapi';
import { composeValidators, validateFloat, validateInteger, validateRequired } from 'utils/validators';
import ContentDescriptorField from './ContentDescriptorField';

const AllowedAttributeContentType = [
    AttributeContentType.String,
    AttributeContentType.Integer,
    AttributeContentType.Boolean,
    AttributeContentType.Date,
    AttributeContentType.Float,
    AttributeContentType.Text,
    AttributeContentType.Time,
    AttributeContentType.Datetime,
];

type Props = {
    editable: boolean;
    isList: boolean;
};

export const ContentFieldConfiguration: {
    [key: string]: { validators?: ((value: any) => undefined | string)[]; type: InputType; initial: string | boolean | number };
} = {
    [AttributeContentType.Text]: {
        validators: [],
        type: 'textarea',
        initial: '',
    },
    [AttributeContentType.String]: {
        validators: [],
        type: 'text',
        initial: '',
    },
    [AttributeContentType.Integer]: {
        validators: [validateInteger()],
        type: 'number',
        initial: '0',
    },
    [AttributeContentType.Float]: {
        validators: [validateFloat()],
        type: 'number',
        initial: '0',
    },
    [AttributeContentType.Boolean]: {
        type: 'checkbox',
        initial: false,
    },
    [AttributeContentType.Datetime]: {
        validators: [validateRequired()],
        type: 'datetime-local',
        initial: '',
    },
    [AttributeContentType.Date]: {
        validators: [validateRequired()],
        type: 'date',
        initial: '',
    },
    [AttributeContentType.Time]: {
        validators: [validateRequired()],
        type: 'time',
        initial: '',
    },
};

export default function DynamicContent({ editable, isList }: Props) {
    const form = useForm();
    const formState = useFormState();
    const contentTypeValue = formState.values['contentType'];
    const attributeContentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));

    return (
        <>
            <Field name="contentType" validate={composeValidators(validateRequired())}>
                {({ input, meta }) => (
                    <FormGroup>
                        <Label for="contentType">Content Type</Label>
                        <Input
                            {...input}
                            valid={!meta.error && meta.touched}
                            invalid={!!meta.error && meta.touched}
                            type="select"
                            id="contentType"
                            placeholder="Content Type"
                            disabled={!editable}
                            onChange={(e) => {
                                input.onChange(e);
                                form.change('content', []);
                            }}
                        >
                            {AllowedAttributeContentType.map((contentType) => (
                                <option key={contentType} value={contentType}>
                                    {getEnumLabel(attributeContentTypeEnum, contentType)}
                                </option>
                            ))}
                        </Input>
                        <FormFeedback>{meta.error}</FormFeedback>
                    </FormGroup>
                )}
            </Field>

            <ContentDescriptorField isList={isList} contentType={contentTypeValue} />
        </>
    );
}

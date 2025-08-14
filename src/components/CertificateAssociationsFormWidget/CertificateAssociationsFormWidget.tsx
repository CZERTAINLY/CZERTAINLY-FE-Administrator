import { Field } from 'react-final-form';
import { FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import Widget from 'components/Widget';
import { actions as groupsActions, selectors as groupsSelectors } from 'ducks/certificateGroups';
import { actions as userAction, selectors as userSelectors } from 'ducks/users';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buildUserOption } from 'utils/widget';

interface Props {
    userOptions: { value: string; label: string }[];
    groupOptions: { value: string; label: string }[];
    setUserOptions: (options: { value: string; label: string }[]) => void;
    setGroupOptions: (options: { value: string; label: string }[]) => void;
    renderCustomAttributes: React.ReactNode;
}

export default function CertificateAssociationsFormWidget({
    renderCustomAttributes,
    userOptions,
    groupOptions,
    setUserOptions,
    setGroupOptions,
}: Props) {
    const dispatch = useDispatch();
    const users = useSelector(userSelectors.users);
    const groups = useSelector(groupsSelectors.certificateGroups);

    useEffect(() => {
        dispatch(userAction.list());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0) {
            setUserOptions(users.map((user) => buildUserOption(user)));
        }
    }, [setUserOptions, users]);

    useEffect(() => {
        dispatch(groupsActions.listGroups());
    }, [dispatch]);

    useEffect(() => {
        if (groups.length > 0) {
            setGroupOptions(
                groups.map((group) => ({
                    value: group.uuid,
                    label: group.name,
                })),
            );
        }
    }, [groups, setGroupOptions]);

    return (
        <Widget title="Certificate associations">
            <Field name="owner">
                {({ input }) => (
                    <FormGroup>
                        <Label for="owner">Owner</Label>
                        <Select {...input} id="owner" options={userOptions} placeholder="Select Owner" isClearable />
                    </FormGroup>
                )}
            </Field>

            <Field name="groups">
                {({ input }) => (
                    <FormGroup>
                        <Label for="groups">Groups</Label>
                        <Select {...input} id="groups" options={groupOptions} placeholder="Select Groups" isClearable isMulti />
                    </FormGroup>
                )}
            </Field>

            <Widget title="Custom Attributes">{renderCustomAttributes}</Widget>
        </Widget>
    );
}

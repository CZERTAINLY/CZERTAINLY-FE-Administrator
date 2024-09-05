import CertificateUploadDialog from 'components/_pages/certificates/CertificateUploadDialog';

import CertificateAttributes from 'components/CertificateAttributes';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';
import { actions as groupActions, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as certActions, selectors as certSelectors } from 'ducks/certificates';
import { selectors as pagingSelectors } from 'ducks/paging';
import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';

import { actions as userActions, selectors as userSelectors } from 'ducks/users';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { Badge, Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';
import { UserDetailModel } from 'types/auth';
import { CertificateDetailResponseModel, CertificateListResponseModel } from 'types/certificate';

import { EntityType } from 'ducks/filters';
import {
    composeValidators,
    validateAlphaNumericWithSpecialChars,
    validateEmail,
    validateLength,
    validateRequired,
    validateUrlSafe,
} from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { CertificateState as CertStatus, Resource } from '../../../../types/openapi';
import { mutators } from '../../../../utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from '../../../../utils/attributes/attributes';
import AttributeEditor from '../../../Attributes/AttributeEditor';
import TabLayout from '../../../Layout/TabLayout';

interface SelectChangeValue {
    value: string;
    label: string;
}

interface FormValues {
    username: string;
    selectedGroups: SelectChangeValue[];
    description: string;
    firstName: string;
    lastName: string;
    email: string;
    inputType: { value: 'upload' | 'select' };
    certFile: FileList | undefined;
    certificateUuid?: string;
    enabled: boolean;
}

function UserForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const userSelector = useSelector(userSelectors.user);
    const rolesSelector = useSelector(rolesSelectors.roles);
    const groups = useSelector(groupSelectors.certificateGroups);
    const certificates = useSelector(certSelectors.certificates);
    const certificateDetail = useSelector(certSelectors.certificateDetail);

    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const isFetchingResourceSecondaryCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceSecondaryCustomAttributes);
    const isFetchingUserDetail = useSelector(userSelectors.isFetchingDetail);
    const isFetchingRoles = useSelector(rolesSelectors.isFetchingList);

    const isFetchingCertsList = useSelector(pagingSelectors.isFetchingList(EntityType.CERTIFICATE));
    const isFetchingCertDetail = useSelector(certSelectors.isFetchingDetail);

    const isCreatingUser = useSelector(userSelectors.isCreating);
    const isUpdatingUser = useSelector(userSelectors.isUpdating);

    const isUpdatingContent = useSelector(customAttributesSelectors.isUpdatingContent);
    const [loadedCerts, setLoadedCerts] = useState<CertificateListResponseModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState<UserDetailModel>();

    const [userRoles, setUserRoles] = useState<string[]>([]);

    const [optionsForCertificate, setOptionsForCertificate] = useState<{ label: string; value: string }[]>([]);

    const isBusy = useMemo(
        () =>
            isFetchingUserDetail ||
            isFetchingCertsList ||
            isFetchingCertDetail ||
            isFetchingRoles ||
            isUpdatingUser ||
            isCreatingUser ||
            isFetchingResourceCustomAttributes ||
            isFetchingResourceSecondaryCustomAttributes ||
            isUpdatingContent,
        [
            isFetchingUserDetail,
            isFetchingCertsList,
            isFetchingCertDetail,
            isFetchingRoles,
            isUpdatingUser,
            isCreatingUser,
            isFetchingResourceCustomAttributes,
            isFetchingResourceSecondaryCustomAttributes,
            isUpdatingContent,
        ],
    );

    const optionsForInput: { label: string; value: 'upload' | 'select' }[] = useMemo(
        () => [
            {
                label: 'Upload a new Certificate',
                value: 'upload',
            },
            {
                label: 'Choose Existing Certificate',
                value: 'select',
            },
        ],
        [],
    );

    const optionsForGroup = useMemo(
        () =>
            groups.map((g) => ({
                label: g.name,
                value: g.uuid,
            })),
        [groups],
    );

    const [selectedCertificate, setSelectedCertificate] = useState<{ label: string; value: string }>();

    const [certUploadDialog, setCertUploadDialog] = useState(false);
    const [certToUpload, setCertToUpload] = useState<CertificateDetailResponseModel>();
    const [certFileContent, setCertFileContent] = useState<string>();

    /* Load first page of certificates & all roles available */

    useEffect(() => {
        dispatch(certActions.resetState());
        dispatch(rolesActions.resetState());
        dispatch(userActions.resetState());
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Users));

        dispatch(
            certActions.listCertificates({
                itemsPerPage: 100,
                pageNumber: 1,
                filters: [],
            }),
        );

        dispatch(rolesActions.list());
        dispatch(groupActions.listGroups());
    }, [dispatch]);

    /* Load user */

    useEffect(() => {
        if (id && (!userSelector || userSelector.uuid !== id)) dispatch(userActions.getDetail({ uuid: id }));
    }, [dispatch, id, userSelector]);

    /* Copy loaded user to the state && possibly load the certificate */

    useEffect(() => {
        if (id && userSelector?.uuid === id) {
            setUser(userSelector);
            setUserRoles(userSelector.roles.map((role) => role.uuid));

            if (userSelector.certificate) dispatch(certActions.getCertificateDetail({ uuid: userSelector.certificate.uuid }));
        } else {
            if (!user)
                setUser({
                    uuid: '',
                    description: '',
                    username: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    enabled: false,
                    roles: [],
                    systemUser: false,
                    groups: [],
                });

            setUserRoles([]);
        }
    }, [dispatch, id, user, userSelector]);

    /* Process cert detail loaded for user */

    useEffect(() => {
        if (user && user.certificate && user.certificate.uuid && certificateDetail && certificateDetail.uuid === user.certificate.uuid) {
            const certs = [...loadedCerts];

            setSelectedCertificate({
                label:
                    certificateDetail.commonName && certificateDetail.fingerprint
                        ? `${certificateDetail.commonName} (${certificateDetail.fingerprint})`
                        : `( empty ) ( ${certificateDetail.commonName} )`,
                value: certificateDetail.uuid,
            });

            const idx = certs.findIndex((c) => c.uuid === certificateDetail.uuid);
            if (idx > 0) certs.splice(idx, 1);
            else return;

            setLoadedCerts([certificateDetail, ...certs]);
        }
    }, [certificateDetail, loadedCerts, user]);

    /* Process fetched certs and store them to loaded certs */

    useEffect(() => {
        const fpc = certificates
            .filter((pagedCert) => !['expired', 'revoked', 'invalid'].includes(pagedCert.state))
            .filter((pagedCert) => loadedCerts.find((loadedCert) => loadedCert.uuid === pagedCert.uuid) === undefined);

        if (fpc.length === 0) return;

        const certs = [...loadedCerts, ...fpc];

        setLoadedCerts(certs);
        setCurrentPage(currentPage + 1);
    }, [certificates, currentPage, loadedCerts]);

    /* Update cert list */

    useEffect(() => {
        setOptionsForCertificate(
            loadedCerts
                .filter((e) => e.state !== CertStatus.Requested)
                .map((loadedCert) => ({
                    label:
                        loadedCert.commonName && loadedCert.serialNumber
                            ? `${loadedCert.commonName} (${loadedCert.serialNumber})`
                            : `( ${loadedCert.commonName} ) ( empty )`,
                    value: loadedCert.uuid,
                })),
        );
    }, [loadedCerts]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (editMode) {
                dispatch(
                    userActions.update({
                        uuid: user!.uuid,
                        roles: userRoles,
                        updateUserRequest: {
                            description: values.description,
                            firstName: values.firstName || undefined,
                            lastName: values.lastName || undefined,
                            email: values.email,
                            groupUuids: values.selectedGroups.map((g) => g.value),
                            certificateUuid:
                                values.inputType.value === 'select'
                                    ? values.certificateUuid
                                        ? values.certificateUuid
                                        : undefined
                                    : undefined,
                            certificateData: values.inputType?.value === 'upload' && certToUpload ? certFileContent : undefined,
                            customAttributes: collectFormAttributes('customUser', resourceCustomAttributes, values),
                        },
                    }),
                );
            } else {
                dispatch(
                    userActions.create({
                        roles: userRoles,
                        userAddRequest: {
                            username: values.username,
                            description: values.description,
                            firstName: values.firstName || undefined,
                            lastName: values.lastName || undefined,
                            email: values.email || undefined,
                            groupUuids: values.selectedGroups.map((g) => g.value),
                            enabled: values.enabled,
                            certificateData: values.inputType?.value === 'upload' && certToUpload ? certFileContent : undefined,
                            certificateUuid:
                                values.inputType?.value === 'select'
                                    ? values.certificateUuid
                                        ? values.certificateUuid
                                        : undefined
                                    : undefined,
                            customAttributes: collectFormAttributes('customUser', resourceCustomAttributes, values),
                        },
                    }),
                );
            }
        },

        [user, certToUpload, certFileContent, dispatch, editMode, userRoles, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const loadNextCertificates = useCallback(() => {
        if (loadedCerts.length === 0) return;

        dispatch(
            certActions.listCertificates({
                itemsPerPage: 100,
                pageNumber: currentPage,
                filters: [],
            }),
        );
    }, [dispatch, currentPage, loadedCerts]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const defaultValues = useMemo(
        () => ({
            username: editMode ? user?.username : '',
            description: editMode ? user?.description : '',
            selectedGroups: editMode
                ? user?.groups?.length
                    ? user?.groups.map((group) => ({ label: group.name, value: group.uuid }))
                    : []
                : [],
            firstName: editMode ? user?.firstName || '' : '',
            lastName: editMode ? user?.lastName : '',
            email: editMode ? user?.email : '',
            enabled: editMode ? user?.enabled : true,
            systemUser: editMode ? user?.systemUser : false,
            inputType: optionsForInput[1],
            certificateUuid: editMode && user?.certificate ? user.certificate.uuid : undefined,
        }),
        [user, editMode, optionsForInput],
    );

    const rolesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'roleName',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: 'auto',
            },
            {
                id: 'roleDescription',
                content: 'Role description',
                sortable: true,
                sort: 'asc',
                width: 'auto',
            },
            {
                id: 'systemRole',
                content: 'System role',
                sortable: true,
                sort: 'asc',
                width: 'auto',
            },
        ],
        [],
    );

    const rolesTableData: TableDataRow[] = useMemo(
        () =>
            rolesSelector.map((role) => ({
                id: role.uuid,

                columns: [
                    role.name,

                    role.description || '',

                    <Badge color={!role.systemRole ? 'success' : 'danger'}>{role.systemRole ? 'Yes' : 'No'}</Badge>,
                ],
            })),

        [rolesSelector],
    );

    const hasRolesChanged: boolean = useMemo(() => {
        if (!user) return false;

        const usrRoleUuids = user.roles.map((role) => role.uuid);

        if (userRoles.length === usrRoleUuids.length && userRoles.length === 0) return true;

        return userRoles.length !== usrRoleUuids.length || userRoles.some((roleUuid) => !usrRoleUuids.includes(roleUuid));
    }, [user, userRoles]);

    const enableCheckButton = useMemo(
        () =>
            editMode ? (
                <></>
            ) : (
                <div className="ms-auto">
                    <Field name="enabled">
                        {({ input, meta }) => (
                            <Label for="enabled">
                                <Input {...input} id="enabled" type="checkbox" label="Enabled" checked={input.value} />
                                &nbsp;&nbsp;Enabled
                            </Label>
                        )}
                    </Field>
                </div>
            ),
        [editMode],
    );
    const title = useMemo(() => (editMode ? 'Edit user' : 'Create user'), [editMode]);

    const renderCustomAttributesEditor = useCallback(() => {
        if (isBusy) return <></>;
        return (
            <TabLayout
                tabs={[
                    {
                        title: 'Custom attributes',
                        content: (
                            <AttributeEditor
                                id="customUser"
                                attributeDescriptors={resourceCustomAttributes}
                                attributes={user?.customAttributes}
                            />
                        ),
                    },
                ]}
            />
        );
    }, [resourceCustomAttributes, user, isBusy]);

    return (
        <>
            <Form onSubmit={onSubmit} initialValues={defaultValues} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Widget title={title} busy={isBusy} widgetExtraTopNode={enableCheckButton}>
                            <Field name="username" validate={composeValidators(validateRequired(), validateUrlSafe())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="username">Username</Label>

                                        <Input
                                            id="username"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            disabled={editMode || user?.systemUser}
                                            type="text"
                                            placeholder="Username"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="selectedGroups">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="selectedGroupsSelect">Groups</Label>

                                        <Select
                                            {...input}
                                            inputId="selectedGroupsSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForGroup}
                                            placeholder="Select Groups"
                                            isClearable
                                            isMulti
                                        />
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="description">Description</Label>

                                        <Input
                                            {...input}
                                            id="description"
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Description"
                                            disabled={user?.systemUser}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="firstName" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="firstName">First Name</Label>

                                        <Input
                                            id="firstName"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="First Name"
                                            disabled={user?.systemUser}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="lastName" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="lastName">Last Name</Label>

                                        <Input
                                            id="lastName"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Last name"
                                            disabled={user?.systemUser}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="email" validate={composeValidators(validateEmail())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="email">Email</Label>

                                        <Input
                                            id="email"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Email address"
                                            disabled={user?.systemUser}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="inputType">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label for="inputTypeSelect">Input Type</Label>

                                        <Select
                                            inputId="inputTypeSelect"
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForInput}
                                            placeholder="Select Input Type"
                                            isDisabled={user?.systemUser}
                                        />
                                    </FormGroup>
                                )}
                            </Field>

                            {values.inputType.value === 'upload' ? (
                                <FormGroup>
                                    <Label for="certFile">Client Certificate</Label>

                                    <div>
                                        {certToUpload ? (
                                            <CertificateAttributes certificate={certToUpload} />
                                        ) : certFileContent ? (
                                            <>Certificate to be uploaded selected.&nbsp;&nbsp;&nbsp;</>
                                        ) : (
                                            <>Certificate to be uploaded not selected&nbsp;&nbsp;&nbsp;</>
                                        )}

                                        <Button color="secondary" onClick={() => setCertUploadDialog(true)}>
                                            Choose File
                                        </Button>
                                    </div>

                                    <FormText color="muted">
                                        Upload certificate of client based on which will be authenticated to RA profile.
                                    </FormText>
                                </FormGroup>
                            ) : (
                                <Field name="certificateUuid">
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label for="certificateUuidSelect">Certificate</Label>

                                            <Select
                                                {...input}
                                                //ref={certSelectRef}
                                                inputId="certificateUuidSelect"
                                                maxMenuHeight={140}
                                                menuPlacement="auto"
                                                value={selectedCertificate}
                                                onChange={(value) => {
                                                    if (!value) {
                                                        setSelectedCertificate(undefined);
                                                        form.change('certificateUuid', undefined);
                                                        return;
                                                    }
                                                    setSelectedCertificate({
                                                        label: value.label,
                                                        value: value.value,
                                                    });
                                                    input.onChange(value.value);
                                                }}
                                                options={optionsForCertificate}
                                                placeholder="Select Certificate"
                                                onMenuScrollToBottom={loadNextCertificates}
                                                isDisabled={user?.systemUser}
                                                styles={{
                                                    control: (provided) =>
                                                        meta.touched && meta.invalid
                                                            ? {
                                                                  ...provided,
                                                                  border: 'solid 1px red',
                                                                  '&:hover': { border: 'solid 1px red' },
                                                              }
                                                            : { ...provided },
                                                }}
                                                isClearable={true}
                                            />

                                            <div
                                                className="invalid-feedback"
                                                style={meta.touched && meta.invalid ? { display: 'block' } : {}}
                                            >
                                                {meta.error}
                                            </div>
                                        </FormGroup>
                                    )}
                                </Field>
                            )}

                            <br />
                            {renderCustomAttributesEditor()}
                            <br />

                            <p>Assigned User Roles</p>

                            <CustomTable
                                headers={rolesTableHeader}
                                data={rolesTableData}
                                checkedRows={userRoles}
                                hasCheckboxes={true}
                                hasAllCheckBox={false}
                                onCheckedRowsChanged={(roles) => {
                                    setUserRoles(roles as string[]);
                                }}
                            />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={submitTitle}
                                        inProgressTitle={inProgressTitle}
                                        inProgress={submitting || isCreatingUser || isUpdatingUser}
                                        disabled={
                                            (pristine && !hasRolesChanged) ||
                                            submitting ||
                                            isCreatingUser ||
                                            isUpdatingUser ||
                                            !valid ||
                                            userSelector?.systemUser
                                        }
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting || isCreatingUser || isUpdatingUser}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Widget>
                    </BootstrapForm>
                )}
            </Form>

            <Dialog
                isOpen={certUploadDialog}
                caption={`Choose Certificate`}
                body={
                    <CertificateUploadDialog
                        okButtonTitle="Choose"
                        onCancel={() => setCertUploadDialog(false)}
                        onUpload={(data) => {
                            setCertToUpload(data.certificate);
                            setCertFileContent(data.fileContent);
                            setCertUploadDialog(false);
                        }}
                    />
                }
                toggle={() => setCertUploadDialog(false)}
                buttons={[]}
            />
        </>
    );
}

export default UserForm;

import TabLayout from 'components/Layout/TabLayout';
import { selectors as profileApprovalSelectors } from 'ducks/approval-profiles';
import { actions as groupAction, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';
import { actions as userAction, selectors as userSelectors } from 'ducks/users';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { ApprovalStepRequestModel, ApproverType } from 'types/approval-profiles';
import { composeValidators, validateLength, validateNonZeroInteger, validatePositiveInteger, validateRequired } from 'utils/validators';
import styles from './approvalProfile.module.scss';

type Props = {
    approvalSteps: ApprovalStepRequestModel[];
    inProgress: boolean;
    onCancelClick: () => void;
};

type SelectOptionApprover = { label: string; value: string } | null;
type SelectOptionApproverType = { label: string; value: string };

const approverTypeOptions = Object.values(ApproverType).map((type) => ({
    value: type.toLocaleLowerCase() + 'Uuid',
    label: type,
}));

export default function ApprovalStepField({ approvalSteps }: Props) {
    const form = useForm();
    const [selectedApprovalTypeList, setselectedApprovalTypeList] = useState<SelectOptionApproverType[] | undefined>(undefined);
    const [selectedApproverList, setSelectedApproverList] = useState<SelectOptionApprover[]>([]);
    const profileApprovalDetail = useSelector(profileApprovalSelectors.profileApprovalDetail);
    const dispatch = useDispatch();
    const users = useSelector(userSelectors.users);
    const roles = useSelector(rolesSelectors.roles);
    const groups = useSelector(groupSelectors.certificateGroups);
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    useEffect(() => {
        dispatch(userAction.list());
    }, [dispatch]);

    useEffect(() => {
        dispatch(groupAction.listGroups());
    }, [dispatch]);

    useEffect(() => {
        dispatch(rolesActions.list());
    }, [dispatch]);

    const updateAppoverAfterRemove = useCallback(
        (index: number) => {
            const newSelectedApprovalTypeList = selectedApprovalTypeList?.filter((_, i) => i !== index);
            setselectedApprovalTypeList(newSelectedApprovalTypeList);

            const newSelectedApproverList = selectedApproverList?.filter((_, i) => i !== index);
            setSelectedApproverList(newSelectedApproverList);
        },
        [selectedApprovalTypeList, selectedApproverList],
    );

    useEffect(() => {
        if (editMode && profileApprovalDetail?.approvalSteps.length) {
            const newSelectedApprovalTypeList: SelectOptionApproverType[] = profileApprovalDetail?.approvalSteps.map((step) => {
                if (step.userUuid) {
                    return { label: ApproverType.User, value: ApproverType.User.toLocaleLowerCase() + 'Uuid' };
                }
                if (step.groupUuid) {
                    return { label: ApproverType.Group, value: ApproverType.Group.toLocaleLowerCase() + 'Uuid' };
                }
                if (step.roleUuid) {
                    return { label: ApproverType.Role, value: ApproverType.Role.toLocaleLowerCase() + 'Uuid' };
                }
                return { label: '', value: '' };
            });
            setselectedApprovalTypeList(newSelectedApprovalTypeList);

            const newSelectedApproverList: SelectOptionApprover[] = profileApprovalDetail?.approvalSteps.map((step) => {
                if (step.userUuid) {
                    return { label: users.find((user) => user.uuid === step.userUuid)?.username ?? '', value: step.userUuid };
                }
                if (step.groupUuid) {
                    return { label: groups.find((group) => group.uuid === step.groupUuid)?.name ?? '', value: step.groupUuid };
                }
                if (step.roleUuid) {
                    return { label: roles.find((role) => role.uuid === step.roleUuid)?.name ?? '', value: step.roleUuid };
                }
                return null;
            });

            setSelectedApproverList(newSelectedApproverList);
        }
    }, [profileApprovalDetail, editMode, users, roles, groups, setSelectedApproverList, setselectedApprovalTypeList]);

    const resetFormUuids = useCallback(
        (index: number) => {
            form.change(`approvalSteps[${index}].${ApproverType.User.toLocaleLowerCase()}Uuid`, undefined);
            form.change(`approvalSteps[${index}].${ApproverType.Group.toLocaleLowerCase()}Uuid`, undefined);
            form.change(`approvalSteps[${index}].${ApproverType.Role.toLocaleLowerCase()}Uuid`, undefined);
        },
        [form],
    );

    const handleApprovalTypeChange = useCallback(
        (e: SelectOptionApprover, index: number) => {
            if (!e || e.value === selectedApprovalTypeList?.[index]?.value) return;

            const newSelectedApprovalTypeList = [...(selectedApprovalTypeList ?? [])];
            newSelectedApprovalTypeList[index] = e;
            setselectedApprovalTypeList(newSelectedApprovalTypeList);

            const newSelectedApproverList = [...(selectedApproverList ?? [])];
            newSelectedApproverList[index] = null;
            setSelectedApproverList(newSelectedApproverList);

            resetFormUuids(index);

            if (e.label === ApproverType.User) {
                form.change(`approvalSteps[${index}].requiredApprovals`, 1);
            }
        },
        [selectedApprovalTypeList, selectedApproverList, form, resetFormUuids],
    );

    const handleApproverChange = useCallback(
        (e: SelectOptionApprover, index: number) => {
            if (!e || !selectedApprovalTypeList || e.value === selectedApproverList?.[index]?.value) return;

            resetFormUuids(index);
            form.change(`approvalSteps[${index}].${selectedApprovalTypeList[index].value}`, e.value);

            setSelectedApproverList((prevList) => {
                const newList = [...(prevList ?? [])];
                newList[index] = e;
                return newList;
            });
        },
        [selectedApprovalTypeList, selectedApproverList, form, setSelectedApproverList, resetFormUuids],
    );

    const getApproverOptions = useCallback(
        (approverType: string) => {
            if (approverType === ApproverType.User) {
                return users.map((user) => ({
                    value: user.uuid,
                    label: user.username,
                }));
            }

            if (approverType === ApproverType.Role) {
                return roles.map((role) => ({
                    value: role.uuid,
                    label: role.name,
                }));
            }

            if (approverType === ApproverType.Group) {
                return groups.map((group) => ({
                    value: group.uuid,
                    label: group.name,
                }));
            }

            return [];
        },
        [users, roles, groups],
    );

    const handleAddStepClick = (): void => {
        const newStep: ApprovalStepRequestModel = {
            order: approvalSteps.length + 1,
        };
        const newApprovalSteps = [...approvalSteps, newStep];
        form.change('approvalSteps', newApprovalSteps);
        setSelectedTab(newApprovalSteps.length - 1);
    };

    const handleRemoveStepClick = useCallback(
        (index: number): void => {
            if (approvalSteps.length === 1) return;

            const newApprovalSteps = approvalSteps.filter((step, i) => i !== index);
            const orderedApprovalSteps = newApprovalSteps.map((step, i) => ({ ...step, order: i + 1 }));

            form.change('approvalSteps', orderedApprovalSteps);
            updateAppoverAfterRemove(index);

            if (selectedTab === approvalSteps.length - 1) {
                setSelectedTab(selectedTab - 1);
            }
        },
        [approvalSteps, form, selectedTab, updateAppoverAfterRemove],
    );

    const renderApprovalSteps = useCallback(
        (index: number) => {
            return (
                <div key={index}>
                    <br />

                    <Row>
                        <Col>
                            <Field name={`approvalSteps[${index}].description`} validate={composeValidators(validateLength(0, 300))}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label htmlFor="stepDescription" className={styles.textInputLabel}>
                                            Description
                                        </Label>
                                        <Input
                                            {...input}
                                            id="stepDescription"
                                            placeholder="Enter Description"
                                            type="text"
                                            className={styles.textInput}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                        />
                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="approverTypeSelect">Approver Type</Label>
                                <Select
                                    id="approverType"
                                    inputId="approverTypeSelect"
                                    maxMenuHeight={140}
                                    menuPlacement="auto"
                                    options={approverTypeOptions}
                                    placeholder="Select Approver Type"
                                    isSearchable={false}
                                    onChange={(e) => handleApprovalTypeChange(e, index)}
                                    value={selectedApprovalTypeList?.length ? selectedApprovalTypeList[index] : undefined}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Field
                                name={`approvalSteps[${index}].requiredApprovals`}
                                validate={composeValidators(validateRequired(), validatePositiveInteger(), validateNonZeroInteger())}
                            >
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label htmlFor="requiredApprovals" className={styles.textInputLabel}>
                                            Required Approvals
                                        </Label>

                                        <Input
                                            {...input}
                                            id="requiredApprovals"
                                            className={styles.textInput}
                                            placeholder="Enter Required Approvals"
                                            disabled={
                                                selectedApprovalTypeList && selectedApprovalTypeList[index]?.label === ApproverType.User
                                            }
                                            type="number"
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                        />
                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>
                        </Col>
                        <Col>
                            {selectedApprovalTypeList && selectedApprovalTypeList[index]?.label && (
                                <Field
                                    name={`approvalSteps[${index}].${selectedApprovalTypeList[index].value}`}
                                    validate={validateRequired()}
                                >
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label htmlFor="approverSelect">Select {selectedApprovalTypeList[index].label}</Label>
                                            <Select
                                                {...input}
                                                id="approver"
                                                inputId="approverSelect"
                                                maxMenuHeight={140}
                                                menuPlacement="auto"
                                                options={getApproverOptions(selectedApprovalTypeList[index].label)}
                                                placeholder="Select Approver"
                                                isSearchable={false}
                                                onChange={(e) => handleApproverChange(e, index)}
                                                value={selectedApproverList?.length ? selectedApproverList[index] : null}
                                            />
                                        </FormGroup>
                                    )}
                                </Field>
                            )}
                        </Col>
                    </Row>
                </div>
            );
        },
        [selectedApprovalTypeList, handleApprovalTypeChange, selectedApproverList, handleApproverChange, getApproverOptions],
    );

    const tabs = useMemo(
        () =>
            approvalSteps.map((approvalStep, index) => ({
                title: (
                    <div className="d-flex align-items-center align-content-center justify-content-center ">
                        <h6 className="m-0" onClick={() => setSelectedTab(index)}>
                            Approval Step {index + 1}
                        </h6>
                        <Button
                            color="danger"
                            outline
                            size="sm"
                            className={styles.closeButton}
                            onClick={() => handleRemoveStepClick(index)}
                        >
                            <i className="fa fa-close" />
                        </Button>
                    </div>
                ),
                content: renderApprovalSteps(index),
            })),
        [approvalSteps, renderApprovalSteps, handleRemoveStepClick],
    );

    return (
        <>
            <TabLayout
                tabs={[
                    ...tabs,
                    {
                        title: <i className="fa fa-plus" />,
                        content: <></>,
                        onClick: () => handleAddStepClick(),
                    },
                ]}
                selectedTab={selectedTab}
            />
        </>
    );
}

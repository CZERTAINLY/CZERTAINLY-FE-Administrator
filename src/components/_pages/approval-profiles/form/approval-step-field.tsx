import TabLayout from "components/Layout/TabLayout";
import { actions as groupAction, selectors as groupSelectors } from "ducks/certificateGroups";
import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import { actions as userAction, selectors as userSelectors } from "ducks/users";
import { useCallback, useEffect, useState } from "react";
import { Field, useForm } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, ButtonGroup, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { ApproverType, ProfileApprovalStepModel } from "types/approval-profiles";
import {
    composeValidators,
    validateAlphaNumeric,
    validateNonZeroInteger,
    validatePositiveInteger,
    validateRequired,
} from "utils/validators";

type Props = {
    approvalSteps: ProfileApprovalStepModel[];
    inProgress: boolean;
    disabled: boolean;
    onCancelClick: () => void;
};

type SelectOptionApprover = { label: string; value: string } | null;
type SelectOptionApproverType = { label: string; value: string };

const approverTypeOptions = Object.values(ApproverType).map((type) => ({
    value: type.toLocaleLowerCase() + "Uuid",
    label: type,
}));

export default function ApprovalStepField({ approvalSteps, disabled, inProgress, onCancelClick }: Props) {
    const form = useForm();
    const [selectedApprovalTypeList, setselectedApprovalTypeList] = useState<SelectOptionApproverType[] | undefined>(undefined);
    const [selectedApproverList, setSelectedApproverList] = useState<SelectOptionApprover[]>([]);
    const dispatch = useDispatch();
    const users = useSelector(userSelectors.users);
    const roles = useSelector(rolesSelectors.roles);
    const groups = useSelector(groupSelectors.certificateGroups);

    useEffect(() => {
        dispatch(userAction.list());
    }, [dispatch]);

    useEffect(() => {
        dispatch(groupAction.listGroups());
    }, [dispatch]);

    useEffect(() => {
        dispatch(rolesActions.list());
    }, [dispatch]);

    const resetFormUuids = (index: number) => {
        form.change(`approvalSteps[${index}].${ApproverType.User.toLocaleLowerCase()}Uuid`, undefined);
        form.change(`approvalSteps[${index}].${ApproverType.Group.toLocaleLowerCase()}Uuid`, undefined);
        form.change(`approvalSteps[${index}].${ApproverType.Role.toLocaleLowerCase()}Uuid`, undefined);
    };

    const handleApprovalTypeChange = (e: SelectOptionApprover, index: number) => {
        if (!e) return;
        setselectedApprovalTypeList((prevList) => {
            const newList = [...(prevList ?? [])];
            newList[index] = e;
            return newList;
        });

        setSelectedApproverList((prevList) => {
            const newList = [...(prevList ?? [])];
            newList[index] = null;
            return newList;
        });
        resetFormUuids(index);
        if (e.label === ApproverType.User) {
            form.change(`approvalSteps[${index}].requiredApprovals`, 1);
        }
    };

    const handleApproverChange = (e: SelectOptionApprover, index: number) => {
        if (!e || !selectedApprovalTypeList) return;
        resetFormUuids(index);
        form.change(`approvalSteps[${index}].${selectedApprovalTypeList[index].value}`, e.value);
        setSelectedApproverList((prevList) => {
            const newList = [...(prevList ?? [])];
            newList[index] = e;
            return newList;
        });
    };

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

    const renderApprovalSteps = (index: number) => {
        return (
            <div key={index}>
                <br />

                <Row>
                    <Col>
                        <Field
                            name={`approvalSteps[${index}].description`}
                            validate={composeValidators(validateRequired(), validateAlphaNumeric())}
                        >
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label style={{ marginBottom: "9px" }}>Description:</Label>
                                    <Input
                                        {...input}
                                        type="text"
                                        style={{ padding: ".47rem" }}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="approverType">Approver Type</Label>
                            <Select
                                id="approverType"
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
                                    <Label className="mb-2">Required Approvals:</Label>

                                    <Input
                                        {...input}
                                        disabled={selectedApprovalTypeList && selectedApprovalTypeList[index]?.label === ApproverType.User}
                                        type="number"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                    </Col>
                    <Col>
                        {selectedApprovalTypeList && selectedApprovalTypeList[index]?.label && (
                            <FormGroup>
                                <Label>Select {selectedApprovalTypeList[index].label}:</Label>
                                <Select
                                    id="selectedApprover"
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
                    </Col>
                </Row>

                <ButtonGroup>
                    <Button
                        color="primary"
                        onClick={() => {
                            const newStep: ProfileApprovalStepModel = {
                                order: approvalSteps.length + 1,
                                description: "",
                                requiredApprovals: 0,
                            };
                            const newApprovalSteps = [...approvalSteps, newStep];
                            form.change("approvalSteps", newApprovalSteps);
                        }}
                    >
                        Add Step
                    </Button>

                    <Button
                        color="secondary"
                        onClick={() => {
                            const newApprovalSteps = approvalSteps.filter((step, i) => i !== index);
                            form.change("approvalSteps", newApprovalSteps);
                        }}
                    >
                        Remove Step
                    </Button>
                </ButtonGroup>
            </div>
        );
    };

    return (
        <>
            <TabLayout
                tabs={
                    approvalSteps.map((approvalStep, index) => ({
                        title: `Apprvoal Step ${index + 1}`,
                        content: renderApprovalSteps(index),
                    })) ?? []
                }
            />
        </>
    );
}

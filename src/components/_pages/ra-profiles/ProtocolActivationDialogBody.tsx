import AttributeEditor from 'components/Attributes/AttributeEditor';
import Spinner from 'components/Spinner';

import { actions as acmeProfilesActions, selectors as acmeProfilesSelectors } from 'ducks/acme-profiles';
import { actions as cmpProfilesActions, selectors as cmpProfilesSelectors } from 'ducks/cmp-profiles';
import { actions as raProfilesActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { actions as scepProfilesActions, selectors as scepProfilesSelectors } from 'ducks/scep-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { validateRequired } from 'utils/validators';
import TabLayout from '../../Layout/TabLayout';

export enum Protocol {
    ACME = 'ACME',
    SCEP = 'SCEP',
    CMP = 'CMP',
}

interface Props {
    protocol: Protocol;
    raProfileUuid?: string;
    authorityInstanceUuid?: string;
    visible: boolean;
    onClose: () => void;
}

export default function ProtocolActivationDialogBody({ protocol, raProfileUuid, authorityInstanceUuid, visible, onClose }: Props) {
    const dispatch = useDispatch();

    const acmeProfiles = useSelector(acmeProfilesSelectors.acmeProfiles);
    const scepProfiles = useSelector(scepProfilesSelectors.scepProfiles);
    const cmpProfiles = useSelector(cmpProfilesSelectors.cmpProfiles);

    const profileMap = {
        [Protocol.ACME]: acmeProfiles,
        [Protocol.CMP]: cmpProfiles,
        [Protocol.SCEP]: scepProfiles,
    };
    const profiles = profileMap[protocol];

    const issuanceAttributes = useSelector(raProfilesSelectors.issuanceAttributes);
    const revocationAttributes = useSelector(raProfilesSelectors.revocationAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [revokeGroupAttributesCallbackAttributes, setRevokeGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const fetchingSelectorMap = {
        [Protocol.ACME]: acmeProfilesSelectors.isFetchingList,
        [Protocol.CMP]: cmpProfilesSelectors.isFetchingList,
        [Protocol.SCEP]: scepProfilesSelectors.isFetchingList,
    };
    const isFetchingProfiles = useSelector(fetchingSelectorMap[protocol]);
    const isFetchingIssuanceAttributes = useSelector(raProfilesSelectors.isFetchingIssuanceAttributes);
    const isFetchingRevocationAttributes = useSelector(raProfilesSelectors.isFetchingRevocationAttributes);

    const isBusy = useMemo(
        () => isFetchingProfiles || isFetchingIssuanceAttributes || isFetchingRevocationAttributes,
        [isFetchingProfiles, isFetchingIssuanceAttributes, isFetchingRevocationAttributes],
    );

    useEffect(
        () => {
            if (!visible) return;

            const profileListActions = {
                [Protocol.ACME]: acmeProfilesActions.listAcmeProfiles,
                [Protocol.CMP]: cmpProfilesActions.listCmpProfiles,
                [Protocol.SCEP]: scepProfilesActions.listScepProfiles,
            };

            dispatch(profileListActions[protocol]());

            if (!raProfileUuid) return;

            dispatch(
                raProfilesActions.listIssuanceAttributeDescriptors({
                    authorityUuid: authorityInstanceUuid ?? '',
                    uuid: raProfileUuid,
                }),
            );
            dispatch(
                raProfilesActions.listRevocationAttributeDescriptors({
                    authorityUuid: authorityInstanceUuid ?? '',
                    uuid: raProfileUuid,
                }),
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible],
    );

    const optionsForProfiles = useMemo(
        () =>
            profiles.map((profile) => ({
                value: profile.uuid,
                label: profile.name,
            })),
        [profiles],
    );

    const onActivateSubmit = useCallback(
        (values: any) => {
            if (!raProfileUuid) return;

            const issuanceAttribs: AttributeRequestModel[] =
                issuanceAttributes && issuanceAttributes.length > 0
                    ? collectFormAttributes(
                          'issuanceAttributes',
                          [...(issuanceAttributes ?? []), ...issueGroupAttributesCallbackAttributes],
                          values,
                      ) || []
                    : [];

            const revocationAttribs: AttributeRequestModel[] =
                revocationAttributes && revocationAttributes.length > 0
                    ? collectFormAttributes(
                          'revocationAttributes',
                          [...(revocationAttributes ?? []), ...revokeGroupAttributesCallbackAttributes],
                          values,
                      ) || []
                    : [];

            const activationPayloadMap = {
                [Protocol.ACME]: raProfilesActions.activateAcme({
                    authorityUuid: authorityInstanceUuid || '',
                    uuid: raProfileUuid,
                    acmeProfileUuid: values.profiles.value,
                    raProfileActivateAcmeRequest: {
                        issueCertificateAttributes: issuanceAttribs,
                        revokeCertificateAttributes: revocationAttribs,
                    },
                }),
                [Protocol.CMP]: raProfilesActions.activateCmp({
                    authorityUuid: authorityInstanceUuid || '',
                    uuid: raProfileUuid,
                    cmpProfileUuid: values.profiles.value,
                    raProfileActivateCmpRequest: {
                        issueCertificateAttributes: issuanceAttribs,
                        revokeCertificateAttributes: revocationAttribs,
                    },
                }),
                [Protocol.SCEP]: raProfilesActions.activateScep({
                    authorityUuid: authorityInstanceUuid || '',
                    uuid: raProfileUuid,
                    scepProfileUuid: values.profiles.value,
                    raProfileActivateScepRequest: {
                        issueCertificateAttributes: issuanceAttribs,
                    },
                }),
            };

            dispatch(activationPayloadMap[protocol]);

            onClose();
        },
        [
            dispatch,
            issuanceAttributes,
            revocationAttributes,
            issueGroupAttributesCallbackAttributes,
            revokeGroupAttributesCallbackAttributes,
            raProfileUuid,
            authorityInstanceUuid,
            onClose,
            protocol,
        ],
    );

    if (!raProfileUuid) return <></>;

    const attributeTabs = [
        {
            title: 'Issue attributes',
            content:
                !issuanceAttributes || issuanceAttributes.length === 0 ? (
                    <></>
                ) : (
                    <Field name="IssuanceAttributes">
                        {({ input, meta }) => (
                            <FormGroup>
                                <AttributeEditor
                                    id="issuanceAttributes"
                                    attributeDescriptors={issuanceAttributes}
                                    groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                    setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                                />
                            </FormGroup>
                        )}
                    </Field>
                ),
        },
    ];
    if (protocol === Protocol.ACME || protocol === Protocol.CMP) {
        attributeTabs.push({
            title: 'Revocation attributes',
            content:
                !revocationAttributes || revocationAttributes.length === 0 ? (
                    <></>
                ) : (
                    <Field name="RevocationAttributes">
                        {({ input, meta }) => (
                            <FormGroup>
                                <AttributeEditor
                                    id="revocationAttributes"
                                    attributeDescriptors={revocationAttributes}
                                    groupAttributesCallbackAttributes={revokeGroupAttributesCallbackAttributes}
                                    setGroupAttributesCallbackAttributes={setRevokeGroupAttributesCallbackAttributes}
                                />
                            </FormGroup>
                        )}
                    </Field>
                ),
        });
    }

    return (
        <>
            <Form onSubmit={onActivateSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="profiles" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="profilesSelect">{`Select ${protocol} profile`}</Label>

                                    <Select
                                        {...input}
                                        inputId="profilesSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForProfiles}
                                        placeholder={`Select ${protocol} profile to be activated`}
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        Required Field
                                    </div>
                                </FormGroup>
                            )}
                        </Field>
                        <br />

                        <TabLayout tabs={attributeTabs} />

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                                    Activate
                                </Button>

                                <Button type="button" color="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>

            <Spinner active={isBusy} />
        </>
    );
}

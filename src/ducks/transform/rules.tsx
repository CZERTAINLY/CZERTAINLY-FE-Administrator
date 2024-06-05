import cx from 'classnames';
import { CustomNode } from 'components/FlowChart';
import style from 'components/FlowChart/CustomFlowNode/customFlowNode.module.scss';
import SwitchWidget from 'components/SwitchWidget';
import { actions as alertActions } from 'ducks/alerts';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions } from 'ducks/rules';
import { useDispatch, useSelector } from 'react-redux';
import { Edge } from 'reactflow';
import { OtherProperties } from 'types/flowchart';
import { PlatformEnum, Resource, UpdateTriggerRequestDtoEventEnum } from 'types/openapi';

import {
    ActionDetailDto,
    ActionDetailModel,
    ActionDto,
    ActionModel,
    ActionRequestDto,
    ActionRequestModel,
    ConditionDto,
    ConditionItemDto,
    ConditionItemModel,
    ConditionItemRequestDto,
    ConditionItemRequestModel,
    ConditionModel,
    ConditionRequestDto,
    ConditionRequestModel,
    ExecutionDto,
    ExecutionItemDto,
    ExecutionItemModel,
    ExecutionItemRequestDto,
    ExecutionItemRequestModel,
    ExecutionModel,
    ExecutionRequestDto,
    ExecutionRequestModel,
    RuleDetailDto,
    RuleDetailModel,
    RuleDto,
    RuleModel,
    RuleRequestDto,
    RuleRequestModel,
    TriggerDetailDto,
    TriggerDetailModel,
    TriggerDto,
    TriggerHistoryDto,
    TriggerHistoryModel,
    TriggerHistoryObjectSummaryDto,
    TriggerHistoryObjectSummaryModel,
    TriggerHistoryObjectTriggerSummaryDto,
    TriggerHistoryObjectTriggerSummaryModel,
    TriggerHistoryRecordDto,
    TriggerHistoryRecordModel,
    TriggerHistorySummaryDto,
    TriggerHistorySummaryModel,
    TriggerModel,
    TriggerRequestDto,
    TriggerRequestModel,
    UpdateActionRequestDto,
    UpdateActionRequestModel,
    UpdateConditionRequestDto,
    UpdateConditionRequestModel,
    UpdateExecutionRequestDto,
    UpdateExecutionRequestModel,
    UpdateRuleRequestDto,
    UpdateRuleRequestModel,
    UpdateTriggerRequestDto,
    UpdateTriggerRequestModel,
} from 'types/rules';

export function transformTriggerHistoryRecordDtoToModel(ruleTriggerHistory: TriggerHistoryRecordDto): TriggerHistoryRecordModel {
    return {
        ...ruleTriggerHistory,
    };
}

export function transformTriggerHistoryDtoToModel(ruleTriggerHistory: TriggerHistoryDto): TriggerHistoryModel {
    return {
        ...ruleTriggerHistory,
        records: ruleTriggerHistory?.records?.length ? ruleTriggerHistory.records.map(transformTriggerHistoryRecordDtoToModel) : [],
    };
}

export function transformExecutionItemRequestModelToDto(executionItemRequestModel: ExecutionItemRequestModel): ExecutionItemRequestDto {
    return {
        ...executionItemRequestModel,
    };
}
export function transformUpdateExecutionRequestModelToDto(
    updateExecutionRequestModel: UpdateExecutionRequestModel,
): UpdateExecutionRequestDto {
    return {
        ...updateExecutionRequestModel,
        items: updateExecutionRequestModel.items.map(transformExecutionItemRequestModelToDto),
    };
}

export function tranformExecutionRequestModelToDto(executionRequestModel: ExecutionRequestModel): ExecutionRequestDto {
    return {
        ...executionRequestModel,
        items: executionRequestModel.items.map(transformExecutionItemRequestModelToDto),
    };
}

export function transformExecutionItemDtoToModel(executionItemDto: ExecutionItemDto): ExecutionItemModel {
    return {
        ...executionItemDto,
    };
}

export function transformExecutionDtoToModel(executionDto: ExecutionDto): ExecutionModel {
    return {
        ...executionDto,
        items: executionDto.items.map(transformExecutionItemDtoToModel),
    };
}

export function transformTriggerDtoToModel(triggerDto: TriggerDto): TriggerModel {
    return { ...triggerDto };
}

export function transformRuleDtoToModel(ruleDto: RuleDto): RuleModel {
    return { ...ruleDto };
}

export function transformConditionItemDtoToModel(conditionItemDto: ConditionItemDto): ConditionItemModel {
    return {
        ...conditionItemDto,
    };
}

export function transformConditionDtoToModel(conditionDto: ConditionDto): ConditionModel {
    return {
        ...conditionDto,
        items: conditionDto.items.map(transformConditionItemDtoToModel),
    };
}

export function transformRuleDetailDtoToModel(ruleDetailDto: RuleDetailDto): RuleDetailModel {
    return {
        ...ruleDetailDto,
        conditions: ruleDetailDto.conditions.map(transformConditionDtoToModel),
    };
}

export function transformConditionItemModelDto(conditionItemModel: ConditionItemModel): ConditionItemDto {
    return {
        ...conditionItemModel,
    };
}

export function transformConditionItemRequestModelDto(conditionItemRequestModel: ConditionItemRequestModel): ConditionItemRequestDto {
    return {
        ...conditionItemRequestModel,
    };
}

export function transformConditionRequestModelToDto(conditionRequestModel: ConditionRequestModel): ConditionRequestDto {
    return {
        ...conditionRequestModel,
        items: conditionRequestModel.items.map(transformConditionItemRequestModelDto),
    };
}

export function transformRuleRequestModelToDto(ruleRequestModel: RuleRequestModel): RuleRequestDto {
    return {
        ...ruleRequestModel,
    };
}

export function transformTriggerRequestModelToDto(triggerRequestModel: TriggerRequestModel): TriggerRequestDto {
    return {
        ...triggerRequestModel,
    };
}

export function transformActionDtoToModel(actionDto: ActionDto): ActionModel {
    return {
        ...actionDto,
    };
}

export function transformTriggerDetailDtoToModel(triggerDetailDto: TriggerDetailDto): TriggerDetailModel {
    return {
        ...triggerDetailDto,
        rules: triggerDetailDto.rules.map(transformRuleDtoToModel),
        actions: triggerDetailDto.actions.map(transformActionDtoToModel),
    };
}

export function transformConditionItemRequestModelToDto(conditionItemRequestModel: ConditionItemRequestModel): ConditionItemRequestDto {
    return {
        ...conditionItemRequestModel,
    };
}

export function transformUpdateConditionRequestModelToDto(
    updateConditionRequestModel: UpdateConditionRequestModel,
): UpdateConditionRequestDto {
    return {
        ...updateConditionRequestModel,
        items: updateConditionRequestModel.items.map(transformConditionItemRequestModelToDto),
    };
}

export function transformUpdateTriggerRequestModelToDto(updateTriggerRequestModel: UpdateTriggerRequestModel): UpdateTriggerRequestDto {
    return {
        ...updateTriggerRequestModel,
    };
}

export function transformUpdateRuleRequestModelToDto(updateRuleRequestModel: UpdateRuleRequestModel): UpdateRuleRequestDto {
    return {
        ...updateRuleRequestModel,
    };
}

export function transformActionRequestModelToDto(actionRequestModel: ActionRequestModel): ActionRequestDto {
    return {
        ...actionRequestModel,
    };
}

export function transformActionDetailDtoToModel(actionDetailDto: ActionDetailDto): ActionDetailModel {
    return {
        ...actionDetailDto,
    };
}

export function transformUpdateActionRequestModelToDto(updateActionRequestModel: UpdateActionRequestModel): UpdateActionRequestDto {
    return {
        ...updateActionRequestModel,
    };
}

export function transformTriggerHistoryObjectTriggerSummaryDtoToModel(
    triggerHistoryObjectTriggerSummaryDto: TriggerHistoryObjectTriggerSummaryDto,
): TriggerHistoryObjectTriggerSummaryModel {
    return {
        ...triggerHistoryObjectTriggerSummaryDto,
        records: triggerHistoryObjectTriggerSummaryDto.records.map(transformTriggerHistoryRecordDtoToModel),
    };
}

export function transformTriggerHistoryObjectSummaryDtoToModel(
    triggerHistoryObjectSummaryDto: TriggerHistoryObjectSummaryDto,
): TriggerHistoryObjectSummaryModel {
    return {
        ...triggerHistoryObjectSummaryDto,
        triggers: triggerHistoryObjectSummaryDto.triggers.map(transformTriggerHistoryObjectTriggerSummaryDtoToModel),
    };
}

export function transformTriggerHistorySummaryDtoToModel(triggerHistorySummaryDto: TriggerHistorySummaryDto): TriggerHistorySummaryModel {
    return {
        ...triggerHistorySummaryDto,
        objects: triggerHistorySummaryDto.objects.map(transformTriggerHistoryObjectSummaryDtoToModel),
    };
}

// export function transformCertifacetObjectToNodesAndEdges(
//     certificate?: CertificateDetailResponseModel,
//     users?: UserResponseModel[],
//     locations?: LocationResponseModel[],
//     raProfileSelected?: RaProfileResponseModel,
//     certificateChain?: CertificateChainResponseModel,
// ) {
//     const nodes: CustomNode[] = [];
//     const edges: Edge[] = [];

//     if (!certificate) {
//         return { nodes, edges };
//     }

//     const otherPropertiesCurrentCertificate: OtherProperties[] = [
//         {
//             propertyName: 'State',
//             propertyContent: <CertificateStatus status={certificate.state} />,
//         },
//     ];

//     if (certificate?.validationStatus) {
//         otherPropertiesCurrentCertificate.push({
//             propertyName: 'Validation Status',
//             propertyContent: <CertificateStatus status={certificate.validationStatus} />,
//         });
//     }

//     otherPropertiesCurrentCertificate.push({
//         propertyName: 'Subject DN',
//         propertyValue: certificate.subjectDn,
//         copyable: true,
//     });

//     if (certificate?.serialNumber) {
//         otherPropertiesCurrentCertificate.push({
//             propertyName: 'Serial Number',
//             propertyValue: certificate.serialNumber,
//             copyable: true,
//         });
//     }
//     if (certificate?.fingerprint) {
//         otherPropertiesCurrentCertificate.push({
//             propertyName: 'Fingerprint',
//             propertyValue: certificate.fingerprint,
//             copyable: true,
//         });
//     }

//     if (!certificateChain?.certificates?.length && !certificateChain?.completeChain) {
//         if (certificate?.issuerDn) {
//             otherPropertiesCurrentCertificate.push({
//                 propertyName: 'Issuer DN',
//                 propertyValue: certificate.issuerDn,
//                 copyable: true,
//             });
//         }
//         if (certificate?.issuerSerialNumber) {
//             otherPropertiesCurrentCertificate.push({
//                 propertyName: 'Issuer Sr. No.',
//                 propertyValue: certificate.issuerSerialNumber,
//                 copyable: true,
//             });
//         }
//     }
//     nodes.push({
//         id: '1',
//         type: 'customFlowNode',
//         position: { x: 0, y: 0 },
//         width: defaultNodeWidth,
//         height: defaultNodeHeight,
//         data: {
//             customNodeCardTitle: 'Current Certificate',
//             entityLabel: certificate.commonName,
//             icon: 'fa fa-certificate',
//             isMainNode: true,
//             certificateNodeStatus: certificate.state,
//             certificateNodeValidationStatus: certificate.validationStatus,
//             otherProperties: otherPropertiesCurrentCertificate,
//         },
//     });

//     if (certificateChain && certificateChain?.certificates?.length) {
//         certificateChain.certificates.forEach((chain, index) => {
//             const chainLength = certificateChain?.certificates?.length || 0;

//             const otherProperties: OtherProperties[] = [
//                 {
//                     propertyName: 'State',
//                     propertyContent: <CertificateStatus status={chain.state} />,
//                 },
//                 {
//                     propertyName: 'Validation Status',
//                     propertyContent: <CertificateStatus status={chain.validationStatus} />,
//                 },
//                 {
//                     propertyName: 'Subject DN',
//                     propertyValue: chain.subjectDn,
//                     copyable: true,
//                 },
//             ];

//             if (chain?.serialNumber) {
//                 otherProperties.push({
//                     propertyName: 'Serial Number',
//                     propertyValue: chain?.serialNumber,
//                     copyable: true,
//                 });
//             }

//             if (chain?.fingerprint) {
//                 otherProperties.push({
//                     propertyName: 'Fingerprint',
//                     propertyValue: chain.fingerprint,
//                     copyable: true,
//                 });
//             }

//             if (chainLength - 1 === index && !certificateChain?.completeChain) {
//                 if (chain?.issuerDn) {
//                     otherProperties.push({
//                         propertyName: 'Issuer DN',
//                         propertyValue: chain.issuerDn,
//                         copyable: true,
//                     });
//                 }
//                 if (chain?.issuerSerialNumber) {
//                     otherProperties.push({
//                         propertyName: 'Issuer Sr. No.',
//                         propertyValue: chain.issuerSerialNumber,
//                         copyable: true,
//                     });
//                 }
//             }

//             nodes.push({
//                 id: `chain-${index}`,
//                 type: 'customFlowNode',
//                 position: { x: 0, y: 0 },
//                 width: defaultNodeWidth,
//                 height: defaultNodeHeight,
//                 data: {
//                     customNodeCardTitle: chainLength - 1 === index && certificateChain?.completeChain ? `Root CA` : `Intermediate CA`,
//                     redirectUrl: chain?.uuid ? `/certificates/detail/${chain.uuid}` : undefined,
//                     entityLabel: chain.commonName,
//                     icon: chainLength - 1 === index && certificateChain?.completeChain ? 'fa fa-medal' : 'fa fa-certificate',
//                     isMainNode: true,
//                     certificateNodeStatus: chain.state,
//                     certificateNodeValidationStatus: chain.validationStatus,
//                     otherProperties: otherProperties,
//                 },
//             });
//             edges.push({
//                 id: `e1-chain-${index}`,
//                 // source: "1",
//                 source: index === 0 ? '1' : `chain-${index - 1}`,
//                 // target: `chain-${index}`,
//                 target: `chain-${index}`,
//                 type: 'floating',
//                 markerEnd: { type: MarkerType.Arrow },
//             });
//         });
//     }

//     if (users?.length) {
//         const user = users.find((u) => u.username === certificate?.owner);
//         if (user) {
//             const userOtherProperties: OtherProperties[] = [
//                 {
//                     propertyName: 'Username',
//                     propertyValue: user.username,
//                     copyable: true,
//                 },
//                 { propertyName: 'User UUID', propertyValue: user.uuid, copyable: true },
//                 {
//                     propertyName: 'User Enabled',
//                     propertyValue: user.enabled ? 'Yes' : 'No',
//                 },
//             ];

//             if (user?.email) {
//                 userOtherProperties.push({
//                     propertyName: 'Email',
//                     propertyValue: user.email,
//                     copyable: true,
//                 });
//             }

//             nodes.push({
//                 id: '2',
//                 type: 'customFlowNode',
//                 position: { x: 0, y: 0 },
//                 width: defaultNodeWidth,
//                 height: defaultNodeHeight,
//                 data: {
//                     customNodeCardTitle: 'Owner',
//                     icon: 'fa fa fa-user',
//                     entityLabel: user?.username || '',
//                     description: user?.description || '',
//                     redirectUrl: user?.uuid ? `/users/detail/${user?.uuid}` : undefined,
//                     otherProperties: userOtherProperties,
//                 },
//             });
//             edges.push({
//                 id: 'e1-2',
//                 source: '1',
//                 target: '2',
//                 type: 'floating',
//                 markerEnd: { type: MarkerType.Arrow },
//             });
//         }
//     }

//     if (certificate?.key) {
//         const keyOtherProperties: OtherProperties[] = [];

//         if (certificate?.key?.owner) {
//             keyOtherProperties.push({
//                 propertyName: 'Key Owner',
//                 propertyValue: certificate.key.owner,
//                 copyable: true,
//             });
//         }

//         if (certificate?.key?.tokenProfileName) {
//             keyOtherProperties.push({
//                 propertyName: 'Key Token ProfileName',
//                 propertyValue: certificate.key.tokenProfileName,
//                 copyable: true,
//             });
//         }
//         nodes.push({
//             id: '4',
//             type: 'customFlowNode',
//             position: { x: 0, y: 0 },
//             width: defaultNodeWidth,
//             height: defaultNodeHeight,
//             data: {
//                 customNodeCardTitle: 'Key',
//                 entityLabel: certificate?.key?.name || '',
//                 icon: 'fa fa fa-key',
//                 description: certificate?.key?.description || '',
//                 redirectUrl:
//                     certificate?.key?.uuid && certificate?.key?.tokenInstanceUuid
//                         ? `/keys/detail/${certificate.key.tokenInstanceUuid}/${certificate.key.uuid}`
//                         : undefined,
//                 otherProperties: keyOtherProperties,
//             },
//         });
//         edges.push({
//             id: 'e1-4',
//             source: '4',
//             target: '1',
//             type: 'floating',
//             markerEnd: { type: MarkerType.Arrow },
//         });
//     }

//     if (certificate?.groups?.length) {
//         certificate?.groups.forEach((group) => {
//             nodes.push({
//                 id: '3',
//                 type: 'customFlowNode',
//                 position: { x: 0, y: 0 },
//                 width: defaultNodeWidth,
//                 height: defaultNodeHeight,
//                 data: {
//                     customNodeCardTitle: 'Group',
//                     description: group?.description || '',
//                     icon: 'fa fa fa-users',
//                     entityLabel: group?.name || '',
//                     redirectUrl: group?.uuid ? `/groups/detail/${group?.uuid}` : undefined,
//                 },
//             });
//             edges.push({
//                 id: 'e1-3',
//                 source: '3',
//                 target: '1',
//                 type: 'floating',
//                 markerEnd: { type: MarkerType.Arrow },
//             });
//         });
//     }

//     if (certificate?.raProfile) {
//         const raProfileOtherProperties: OtherProperties[] = [];

//         if (certificate?.raProfile?.enabled) {
//             raProfileOtherProperties.push({
//                 propertyName: 'RA Profile Enabled',
//                 propertyValue: certificate.raProfile.enabled ? 'Yes' : 'No',
//             });
//         }

//         nodes.push({
//             id: '5',
//             type: 'customFlowNode',
//             position: { x: 0, y: 0 },
//             width: defaultNodeWidth,
//             height: defaultNodeHeight,
//             data: {
//                 customNodeCardTitle: 'RA Profile',
//                 icon: 'fa fa fa-address-card',
//                 entityLabel: certificate?.raProfile?.name || '',
//                 redirectUrl:
//                     certificate?.raProfile?.uuid && certificate?.raProfile.authorityInstanceUuid
//                         ? `/raProfiles/detail/${certificate.raProfile.authorityInstanceUuid}/${certificate.raProfile.uuid}`
//                         : undefined,
//                 otherProperties: raProfileOtherProperties,
//             },
//         });
//         edges.push({
//             id: 'e1-5',
//             source: '1',
//             target: '5',
//             type: 'floating',
//             markerEnd: { type: MarkerType.Arrow },
//         });

//         if (raProfileSelected) {
//             nodes.push({
//                 id: '7',
//                 type: 'customFlowNode',
//                 position: { x: 0, y: 0 },
//                 width: defaultNodeWidth,
//                 height: defaultNodeHeight,
//                 data: {
//                     customNodeCardTitle: 'Authority',
//                     icon: 'fa fa fa-stamp',
//                     entityLabel: raProfileSelected.authorityInstanceName || '',
//                     redirectUrl: `/authorities/detail/${raProfileSelected.authorityInstanceUuid}`,
//                     otherProperties: [
//                         {
//                             propertyName: 'Authority Instance Name',
//                             propertyValue: raProfileSelected.authorityInstanceName,
//                             copyable: true,
//                         },

//                         {
//                             propertyName: 'Authority UUID',
//                             propertyValue: raProfileSelected.authorityInstanceUuid,
//                             copyable: true,
//                         },
//                     ],
//                 },
//             });
//             edges.push({
//                 id: 'e7-5',
//                 target: '7',
//                 source: '5',
//                 type: 'floating',
//                 markerEnd: { type: MarkerType.Arrow },
//             });
//         }
//     }
//     if (locations?.length) {
//         locations.forEach((location) => {
//             const otherPropertiesLocation: OtherProperties[] = [
//                 {
//                     propertyName: 'Location Enabled',
//                     propertyValue: location.enabled ? 'Yes' : 'No',
//                 },
//             ];
//             if (location?.description) {
//                 otherPropertiesLocation.push({
//                     propertyName: 'Description',
//                     propertyValue: location?.description,
//                 });
//             }
//             nodes.push({
//                 id: location?.uuid || '',
//                 type: 'customFlowNode',
//                 position: { x: 0, y: 0 },
//                 width: defaultNodeWidth,
//                 height: defaultNodeHeight,
//                 data: {
//                     customNodeCardTitle: 'Location',
//                     icon: 'fa fa fa-map-marker',
//                     entityLabel: location?.name || '',
//                     redirectUrl: location?.uuid ? `/locations/detail/${certificate?.uuid}/${location?.uuid}` : undefined,
//                     otherProperties: otherPropertiesLocation,
//                 },
//             });
//             edges.push({
//                 id: `e${location?.uuid}-1`,
//                 target: location?.uuid || '',
//                 source: '1',
//                 type: 'floating',
//                 markerEnd: { type: MarkerType.Arrow },
//             });
//         });
//     }

//     return { nodes, edges };
// }

export function useTransformTriggerObjectToNodesAndEdges(triggerDetails?: TriggerDetailModel): { nodes: CustomNode[]; edges: Edge[] } {
    const nodes: CustomNode[] = [];
    const edges: Edge[] = [];
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const dispatch = useDispatch();
    if (!triggerDetails) {
        return { nodes, edges };
    }

    const otherPropertiesCurrentCertificate: OtherProperties[] = [];

    // calculate the number of rules and actions that the trigger has push it as other properties

    // if (triggerDetails.rules.length) {
    //     triggerDetails.rules.forEach((rule) => {
    //         otherPropertiesCurrentCertificate.push({
    //             propertyName: 'Rule',
    //             propertyValue: rule.name,
    //             // propertyContent: rule.description,
    //         });
    //     });
    // }

    // if (triggerDetails?.description) {
    //     otherPropertiesCurrentCertificate.push({
    //         propertyName: 'Description',
    //         propertyValue: triggerDetails.description,
    //     });
    // }
    // if (triggerDetails?.ignoreTrigger) {
    otherPropertiesCurrentCertificate.push({
        // propertyName: 'Ignore Trigger',
        // propertyContent: <Container>,
        // propertyValue: triggerDetails.ignoreTrigger ? 'Yes' : 'No',
        // propertyContent: <div>hi</div>,
        propertyContent: (
            <div className={cx('d-flex align-items-center ')}>
                <h6 className={cx('m-0', style.entityLabel)}>Entity Name :</h6>
                <div className="ms-1">
                    <SwitchWidget
                        checked={triggerDetails.ignoreTrigger}
                        onClick={() => {
                            if (triggerDetails?.ignoreTrigger) {
                                dispatch(alertActions.info('Please add actions from the actions table'));
                                // triggerHighlight();
                            } else {
                                dispatch(
                                    rulesActions.updateTrigger({
                                        triggerUuid: triggerDetails.uuid,
                                        trigger: {
                                            ignoreTrigger: true,
                                            description: triggerDetails.description || '',
                                            rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                                            resource: triggerDetails.resource,
                                            type: triggerDetails.type,
                                            actionsUuids: [],
                                            eventResource: triggerDetails.eventResource,
                                            event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                                        },
                                    }),
                                );
                            }
                        }}
                    />
                </div>
            </div>
        ),
    });
    // }

    otherPropertiesCurrentCertificate.push({
        propertyName: 'Resource',
        propertyValue: getEnumLabel(resourceTypeEnum, triggerDetails.resource),
        // entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
    });

    if (triggerDetails?.eventResource) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Event Resource',
            propertyValue: getEnumLabel(resourceTypeEnum, triggerDetails.eventResource),
            // entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
        });
    }

    otherPropertiesCurrentCertificate.push({
        propertyName: 'Type',
        propertyValue: triggerDetails.type,
    });

    if (triggerDetails?.event) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Event',
            propertyValue: getEnumLabel(eventNameEnum, triggerDetails.event),
        });
    }

    nodes.push({
        id: '1',
        type: 'customFlowNode',
        position: { x: 0, y: 0 },
        // width: defaultNodeWidth,
        // height: defaultNodeHeight,
        data: {
            customNodeCardTitle: triggerDetails.name,
            entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
            icon: 'fa fa-rocket',
            isMainNode: true,
            // redirectUrl: triggerDetails.uuid ? `/triggers/detail/${triggerDetails.uuid}` : undefined,
            description: triggerDetails.description,
            expandedByDefault: true,
            // certificateNodeStatus: triggerDetails.state,
            // certificateNodeValidationStatus: triggerDetails.validationStatus,
            // otherProperties: otherPropertiesCurrentCertificate,
            otherProperties: otherPropertiesCurrentCertificate,
        },
    });

    return { nodes, edges };
}

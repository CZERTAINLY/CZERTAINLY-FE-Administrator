import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './customAttributes';
import { transformAttributeResponseDtoToModel, transformCustomAttributeDtoToModel } from './transform/attributes';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import {
    transformCustomAttributeCreateRequestModelToDto,
    transformCustomAttributeDetailResponseDtoToModel,
    transformCustomAttributeResponseDtoToModel,
    transformCustomAttributeUpdateRequestModelToDto,
} from './transform/customAttributes';

const listCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.listCustomAttributes({ attributeContentType: action.payload.attributeContentType }).pipe(
                switchMap((list) =>
                    of(
                        slice.actions.listCustomAttributesSuccess(list.map(transformCustomAttributeResponseDtoToModel)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfCustomAttributes),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listCustomAttributesFailure({ error: extractError(err, 'Failed to get Custom Attributes list') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfCustomAttributes),
                    ),
                ),
            ),
        ),
    );
};

const listResources: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listResources.match),
        switchMap(() =>
            deps.apiClients.customAttributes.getResources().pipe(
                map((list) => slice.actions.listResourcesSuccess(list)),
                catchError((err) =>
                    of(
                        slice.actions.listResourcesFailure({ error: extractError(err, 'Failed to get list of resources') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get list of resources' }),
                    ),
                ),
            ),
        ),
    );
};

const listResourceCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listResourceCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.getResourceCustomAttributes({ resource: action.payload }).pipe(
                switchMap((list) =>
                    of(
                        slice.actions.listResourceCustomAttributesSuccess(list.map(transformCustomAttributeDtoToModel)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CustomAttributeWidget),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listResourceCustomAttributesFailure({
                            error: extractError(err, 'Failed to get Resource Custom Attributes list'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Resource Custom Attributes list' }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.CustomAttributeWidget),
                    ),
                ),
            ),
        ),
    );
};

const listSecondaryResourceCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSecondaryResourceCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.getResourceCustomAttributes({ resource: action.payload }).pipe(
                map((list) => slice.actions.listSecondaryResourceCustomAttributesSuccess(list.map(transformCustomAttributeDtoToModel))),
                catchError((err) =>
                    of(
                        slice.actions.listSecondaryResourceCustomAttributesFailure({
                            error: extractError(err, 'Failed to get Resource Custom Attributes list'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Resource Custom Attributes list' }),
                    ),
                ),
            ),
        ),
    );
};

const createCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes
                .createCustomAttribute({ customAttributeCreateRequestDto: transformCustomAttributeCreateRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((obj) =>
                        of(
                            slice.actions.createCustomAttributeSuccess({ uuid: obj.uuid }),
                            appRedirectActions.redirect({ url: `../customattributes/detail/${obj.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createCustomAttributeFailure({ error: extractError(err, 'Failed to create custom attribute') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create custom attribute' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes
                .editCustomAttribute({
                    uuid: action.payload.uuid,
                    customAttributeUpdateRequestDto: transformCustomAttributeUpdateRequestModelToDto(
                        action.payload.customAttributeUpdateRequest,
                    ),
                })
                .pipe(
                    mergeMap((customAttributeDetail) =>
                        of(
                            slice.actions.updateCustomAttributeSuccess(
                                transformCustomAttributeDetailResponseDtoToModel(customAttributeDetail),
                            ),
                            slice.actions.getCustomAttribute(customAttributeDetail.uuid),
                            appRedirectActions.redirect({ url: `../../customattributes/detail/${customAttributeDetail.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateCustomAttributeFailure({ error: extractError(err, 'Failed to update custom attribute') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateCustomAttributeContent: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateCustomAttributeContent.match),
        switchMap((action) =>
            deps.apiClients.customAttributes
                .updateAttributeContentForResource({
                    resourceName: action.payload.resource,
                    objectUuid: action.payload.resourceUuid,
                    attributeUuid: action.payload.attributeUuid,
                    baseAttributeContentDto: action.payload.content,
                })
                .pipe(
                    map((response) =>
                        slice.actions.updateCustomAttributeContentSuccess({
                            resource: action.payload.resource,
                            resourceUuid: action.payload.resourceUuid,
                            customAttributes: response.map(transformAttributeResponseDtoToModel),
                        }),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateCustomAttributeContentFailure({
                                resource: action.payload.resource,
                                resourceUuid: action.payload.resourceUuid,
                                error: extractError(err, 'Failed to update custom attribute content'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute content' }),
                        ),
                    ),
                ),
        ),
    );
};

const removeCustomAttributeContent: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.removeCustomAttributeContent.match),
        switchMap((action) =>
            deps.apiClients.customAttributes
                .deleteAttributeContentForResource({
                    resourceName: action.payload.resource,
                    objectUuid: action.payload.resourceUuid,
                    attributeUuid: action.payload.attributeUuid,
                })
                .pipe(
                    map((response) =>
                        slice.actions.removeCustomAttributeContentSuccess({
                            resource: action.payload.resource,
                            resourceUuid: action.payload.resourceUuid,
                            customAttributes: response.map(transformAttributeResponseDtoToModel),
                        }),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.removeCustomAttributeContentFailure({
                                resource: action.payload.resource,
                                resourceUuid: action.payload.resourceUuid,
                                error: extractError(err, 'Failed to remove custom attribute content'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to remove custom attribute content' }),
                        ),
                    ),
                ),
        ),
    );
};

const getCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.getCustomAttribute({ uuid: action.payload }).pipe(
                switchMap((customAttributeDetail) =>
                    of(
                        slice.actions.getCustomAttributeSuccess(transformCustomAttributeDetailResponseDtoToModel(customAttributeDetail)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CustomAttributeDetails),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getCustomAttributeFailure({ error: extractError(err, 'Failed to get custom attribute detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.CustomAttributeDetails),
                    ),
                ),
            ),
        ),
    );
};

const deleteCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.deleteCustomAttribute({ uuid: action.payload }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteCustomAttributeSuccess(action.payload),
                        appRedirectActions.redirect({ url: '../../customattributes' }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteCustomAttributeFailure({ error: extractError(err, 'Failed to delete custom attribute') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete custom attribute' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.bulkDeleteCustomAttributes({ requestBody: action.payload }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteCustomAttributesSuccess(action.payload),
                        alertActions.success('Selected custom attributes successfully deleted.'),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteCustomAttributesFailure({ error: extractError(err, 'Failed to delete custom attributes') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete custom attributes' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.bulkEnableCustomAttributes({ requestBody: action.payload }).pipe(
                map((errors) => slice.actions.bulkEnableCustomAttributesSuccess(action.payload)),
                catchError((err) =>
                    of(
                        slice.actions.bulkEnableCustomAttributesFailure({ error: extractError(err, 'Failed to enable custom attributes') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable custom attributes' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableCustomAttributes.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.bulkDisableCustomAttributes({ requestBody: action.payload }).pipe(
                map((errors) => slice.actions.bulkDisableCustomAttributesSuccess(action.payload)),
                catchError((err) =>
                    of(
                        slice.actions.bulkDisableCustomAttributesFailure({
                            error: extractError(err, 'Failed to disable custom attributes'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable custom attributes' }),
                    ),
                ),
            ),
        ),
    );
};

const enableCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.enableCustomAttribute({ uuid: action.payload }).pipe(
                map((errors) => slice.actions.enableCustomAttributeSuccess(action.payload)),
                catchError((err) =>
                    of(
                        slice.actions.enableCustomAttributeFailure({ error: extractError(err, 'Failed to enable custom attribute') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable custom attribute' }),
                    ),
                ),
            ),
        ),
    );
};

const disableCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableCustomAttribute.match),
        switchMap((action) =>
            deps.apiClients.customAttributes.disableCustomAttribute({ uuid: action.payload }).pipe(
                map((errors) => slice.actions.disableCustomAttributeSuccess(action.payload)),
                catchError((err) =>
                    of(
                        slice.actions.disableCustomAttributeFailure({ error: extractError(err, 'Failed to disable custom attribute') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable custom attribute' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listCustomAttributes,
    listResources,
    listResourceCustomAttributes,
    listSecondaryResourceCustomAttributes,
    createCustomAttribute,
    updateCustomAttribute,
    getCustomAttribute,
    deleteCustomAttribute,
    bulkDeleteCustomAttributes,
    bulkEnableCustomAttributes,
    enableCustomAttribute,
    bulkDisableCustomAttributes,
    disableCustomAttribute,
    updateCustomAttributeContent,
    removeCustomAttributeContent,
];

export default epics;

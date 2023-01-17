import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./customAttributes";

import {
    transformCustomAttributeCreateRequestModelToDto,
    transformCustomAttributeDetailResponseDtoToModel,
    transformCustomAttributeResponseDtoToModel,
    transformCustomAttributeUpdateRequestModelToDto,
} from "./transform/customAttributes";

const listCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.listCustomAttributes.match,
        ),
        switchMap(
            () => deps.apiClients.customAttributes.listCustomAttributes().pipe(
                map(
                    list => slice.actions.listCustomAttributesSuccess(list.map(transformCustomAttributeResponseDtoToModel)),
                ),
                catchError(
                    err => of(
                        slice.actions.listCustomAttributesFailure({error: extractError(err, "Failed to get Custom Attributes list")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to get Custom Attributes list"}),
                    ),
                ),
            ),
        ),
    );

};

const createCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.createCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.createCustomAttribute({customAttributeCreateRequestDto: transformCustomAttributeCreateRequestModelToDto(action.payload)},
            ).pipe(
                mergeMap(
                    obj => of(
                        slice.actions.createCustomAttributeSuccess({uuid: obj.uuid}),
                        appRedirectActions.redirect({url: `../detail/${obj.uuid}`}),
                    ),
                ),
                catchError(
                    err => of(
                        slice.actions.createCustomAttributeFailure({error: extractError(err, "Failed to create custom attribute")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to create custom attribute"}),
                    ),
                ),
            ),
        ),
    );
};

const updateCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.updateCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.editCustomAttribute({
                    uuid: action.payload.uuid,
                    customAttributeUpdateRequestDto: transformCustomAttributeUpdateRequestModelToDto(action.payload.customAttributeUpdateRequest),
                },
            ).pipe(
                mergeMap(
                    customAttributeDetail => of(
                        slice.actions.updateCustomAttributeSuccess(transformCustomAttributeDetailResponseDtoToModel(customAttributeDetail)),
                        appRedirectActions.redirect({url: `../../detail/${customAttributeDetail.uuid}`}),
                    ),
                ),
                catchError(
                    err => of(
                        slice.actions.updateCustomAttributeFailure({error: extractError(err, "Failed to update custom attribute")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to update custom attribute"}),
                    ),
                ),
            ),
        ),
    );
};

const getCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.getCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.getCustomAttribute({uuid: action.payload}).pipe(
                map(
                    customAttributeDetail => slice.actions.getCustomAttributeSuccess(transformCustomAttributeDetailResponseDtoToModel(customAttributeDetail)),
                ),
                catchError(
                    err => of(
                        slice.actions.getCustomAttributeFailure({error: extractError(err, "Failed to get custom attribute detail")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to get custom attribute detail"}),
                    ),
                ),
            ),
        ),
    );
};

const deleteCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.deleteCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.deleteCustomAttribute({uuid: action.payload}).pipe(
                mergeMap(
                    () => of(
                        slice.actions.deleteCustomAttributeSuccess(action.payload),
                        appRedirectActions.redirect({url: "../../"}),
                    ),
                ),
                catchError(
                    err => of(
                        slice.actions.deleteCustomAttributeFailure({error: extractError(err, "Failed to delete custom attribute")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to delete custom attribute"}),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.bulkDeleteCustomAttributes.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.bulkDeleteCustomAttributes({requestBody: action.payload}).pipe(
                map(
                    errors => slice.actions.bulkDeleteCustomAttributesSuccess(action.payload),
                ),
                catchError(
                    err => of(
                        slice.actions.bulkDeleteCustomAttributesFailure({error: extractError(err, "Failed to delete custom attributes")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to delete custom attributes"}),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.bulkEnableCustomAttributes.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.bulkEnableCustomAttributes({requestBody: action.payload}).pipe(
                map(
                    errors => slice.actions.bulkEnableCustomAttributesSuccess(action.payload),
                ),
                catchError(
                    err => of(
                        slice.actions.bulkEnableCustomAttributesFailure({error: extractError(err, "Failed to enable custom attributes")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to enable custom attributes"}),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableCustomAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.bulkDisableCustomAttributes.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.bulkDisableCustomAttributes({requestBody: action.payload}).pipe(
                map(
                    errors => slice.actions.bulkDisableCustomAttributesSuccess(action.payload),
                ),
                catchError(
                    err => of(
                        slice.actions.bulkDisableCustomAttributesFailure({error: extractError(err, "Failed to disable custom attributes")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to disable custom attributes"}),
                    ),
                ),
            ),
        ),
    );
};

const enableCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.enableCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.enableCustomAttribute({uuid: action.payload}).pipe(
                map(
                    errors => slice.actions.enableCustomAttributeSuccess(action.payload),
                ),
                catchError(
                    err => of(
                        slice.actions.enableCustomAttributeFailure({error: extractError(err, "Failed to enable custom attribute")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to enable custom attribute"}),
                    ),
                ),
            ),
        ),
    );
};

const disableCustomAttribute: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.disableCustomAttribute.match,
        ),
        switchMap(
            action => deps.apiClients.customAttributes.disableCustomAttribute({uuid: action.payload}).pipe(
                map(
                    errors => slice.actions.disableCustomAttributeSuccess(action.payload),
                ),
                catchError(
                    err => of(
                        slice.actions.disableCustomAttributeFailure({error: extractError(err, "Failed to disable custom attribute")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to disable custom attribute"}),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listCustomAttributes,
    createCustomAttribute,
    updateCustomAttribute,
    getCustomAttribute,
    deleteCustomAttribute,
    bulkDeleteCustomAttributes,
    bulkEnableCustomAttributes,
    enableCustomAttribute,
    bulkDisableCustomAttributes,
    disableCustomAttribute,
];

export default epics;
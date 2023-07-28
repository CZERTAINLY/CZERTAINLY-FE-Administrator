import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { actions as appRedirectActions } from "./app-redirect";
// import { actions as widgetLockActions } from "./widget-locks";

import { extractError } from "utils/net";
import { slice } from "./approval-profiles";
import { transformProfileApprovalDetailDtoToModel } from "./transform/approval-profiles";
// import { transformSearchRequestModelToDto } from "./transform/certificates";

const getApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.getApprovalProfile({ uuid: action.payload.uuid }).pipe(
                switchMap((response) => of(slice.actions.getApprovalProfileSuccess(transformProfileApprovalDetailDtoToModel(response)))),

                catchError((err) =>
                    of(
                        slice.actions.getApprovalProfileFailure({ error: extractError(err, "Failed to get Approval Profile details") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get approval profile detail" }),
                    ),
                ),
            ),
        ),
    );
};

const createApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.createApprovalProfile({ approvalProfileRequestDto: action.payload }).pipe(
                switchMap((response) =>
                    of(
                        slice.actions.createApprovalProfileSuccess(response),
                        appRedirectActions.redirect({ url: `/approvalprofiles/detail/${response.uuid}` }),
                    ),
                ),

                catchError((err) =>
                    of(
                        appRedirectActions.fetchError({ error: err, message: "Failed to create approvalprofile" }),
                        slice.actions.createApprovalProfileFailure({ error: extractError(err, "Failed to create Approval Profile") }),
                    ),
                ),
            ),
        ),
    );
};

const listApprovalProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listApprovalProfiles.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.listApprovalProfiles({ paginationRequestDto: action.payload }).pipe(
                switchMap((response) => of(slice.actions.listApprovalProfilesSuccess(response))),

                catchError((err) =>
                    of(
                        appRedirectActions.fetchError({ error: err, message: "Failed to list approvalprofiles" }),

                        slice.actions.listApprovalProfilesFailure({ error: extractError(err, "Failed to get Approval Profiles list") }),
                        // widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.SchedulerJobDetail),
                    ),
                ),
            ),
        ),
    );
};

const enableApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.enableApprovalProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableApprovalProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        appRedirectActions.fetchError({ error: err, message: "Failed to enable approval profile" }),
                        slice.actions.enableApprovalProfileFailure(err),
                    ),
                ),
            ),
        ),
    );
};

const disableApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.disableApprovalProfile({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableApprovalProfileSuccess({ uuid: action.payload.uuid })),

                catchError((err) =>
                    of(
                        appRedirectActions.fetchError({ error: err, message: "Failed to disable approval profile" }),
                        slice.actions.disableApprovalProfileFailure(err),
                    ),
                ),
            ),
        ),
    );
};

const deleteApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles.deleteApprovalProfile({ uuid: action.payload.uuid }).pipe(
                switchMap((response) =>
                    of(slice.actions.deleteApprovalProfileSuccess(response), appRedirectActions.redirect({ url: `/approvalprofiles` })),
                ),
                catchError((err) =>
                    of(
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete approval profile" }),
                        slice.actions.deleteApprovalProfileFailure({ error: extractError(err, "Failed to delete Approval Profile") }),
                    ),
                ),
            ),
        ),
    );
};

const editApprovalProfile: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editApprovalProfile.match),

        switchMap((action) =>
            deps.apiClients.approvalProfiles
                .editApprovalProfile({
                    uuid: action.payload.uuid,
                    approvalProfileUpdateRequestDto: action.payload.editProfileApproval,
                })
                .pipe(
                    switchMap((response) =>
                        of(
                            slice.actions.editApprovalProfileSuccess({ uuid: action.payload.uuid }),
                            appRedirectActions.redirect({ url: `/approvalprofiles/detail/${action.payload.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            appRedirectActions.fetchError({ error: err, message: "Failed to update approval profile" }),
                            slice.actions.editApprovalProfile(err),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    getApprovalProfile,
    createApprovalProfile,
    listApprovalProfiles,
    enableApprovalProfile,
    disableApprovalProfile,
    deleteApprovalProfile,
    editApprovalProfile,
];

export default epics;

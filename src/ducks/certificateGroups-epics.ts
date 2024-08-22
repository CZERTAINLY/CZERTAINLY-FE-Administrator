import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './certificateGroups';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import { transformCertificateGroupRequestModelToDto, transformCertificateGroupResponseDtoToModel } from './transform/certificateGroups';

const listGroups: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listGroups.match),
        switchMap(() =>
            deps.apiClients.certificateGroups.listGroups().pipe(
                switchMap((list) =>
                    of(
                        slice.actions.listGroupsSuccess({
                            groups: list.map(transformCertificateGroupResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfGroups),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.listGroupsFailure({ error: extractError(err, 'Failed to get Group list') }),
                        alertActions.error(extractError(err, 'Failed to get Group list')),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfGroups),
                    ),
                ),
            ),
        ),
    );
};

const getGroupDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getGroupDetail.match),
        switchMap((action) =>
            deps.apiClients.certificateGroups.getGroup({ uuid: action.payload.uuid }).pipe(
                switchMap((groupDto) =>
                    of(
                        slice.actions.getGroupDetailSuccess({
                            group: transformCertificateGroupResponseDtoToModel(groupDto),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.GroupDetails),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.getGroupDetailFailure({ error: extractError(err, 'Failed to get Group detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.GroupDetails),
                    ),
                ),
            ),
        ),
    );
};

const createGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createGroup.match),

        switchMap((action) =>
            deps.apiClients.certificateGroups
                .createGroup({ groupRequestDto: transformCertificateGroupRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((obj) =>
                        of(
                            slice.actions.createGroupSuccess({ uuid: obj.uuid }),
                            appRedirectActions.redirect({ url: `../groups/detail/${obj.uuid}` }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.createGroupFailure({ error: extractError(err, 'Failed to create group') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create group' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateGroup.match),
        switchMap((action) =>
            deps.apiClients.certificateGroups
                .editGroup({
                    uuid: action.payload.groupUuid,
                    groupRequestDto: transformCertificateGroupRequestModelToDto(action.payload.editGroupRequest),
                })
                .pipe(
                    mergeMap((groupDTO) =>
                        of(
                            slice.actions.updateGroupSuccess({ group: transformCertificateGroupResponseDtoToModel(groupDTO) }),
                            appRedirectActions.redirect({ url: `../../groups/detail/${groupDTO.uuid}` }),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.updateGroupFailure({ error: extractError(err, 'Failed to update group') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update group' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteGroup: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteGroup.match),
        switchMap((action) =>
            deps.apiClients.certificateGroups.deleteGroup({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteGroupSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../groups' }),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteGroupFailure({ error: extractError(err, 'Failed to delete group') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete group' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteProfiles: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteGroups.match),
        switchMap((action) =>
            deps.apiClients.certificateGroups.bulkDeleteGroup({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteGroupsSuccess({ uuids: action.payload.uuids }),
                        alertActions.success('Selected groups successfully deleted.'),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteGroupsFailure({ error: extractError(err, 'Failed to delete groups') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete groups' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [listGroups, getGroupDetail, createGroup, updateGroup, deleteGroup, bulkDeleteProfiles];

export default epics;

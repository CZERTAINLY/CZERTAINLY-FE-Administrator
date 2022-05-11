import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { AdministratorDetailDTO, AdminInfoResponse } from "api/administrators";
import { Administrator, AdministratorDetail, Role } from "models";
import { readCertificate } from "utils/file";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions, selectors } from "./administrators";

const createAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(
      ({
        name,
        surname,
        username,
        email,
        certificate,
        description,
        superAdmin,
        enabled,
        certificateUuid,
        history,
      }) =>
        readCertificate(certificate).pipe(
          switchMap((adminCertificate) =>
            apiClients.admins
              .createAdmin(
                name,
                surname,
                username,
                email,
                adminCertificate,
                description,
                superAdmin ? Role.SuperAdmin : Role.Admin,
                enabled,
                certificateUuid
              )
              .pipe(
                map((uuid) => {
                  history.push(`./detail/${uuid}`);
                  return actions.receiveCreate(uuid);
                }),
                catchError((err) =>
                  of(
                    actions.failCreate(
                      extractError(err, "Failed to create administrator")
                    )
                  )
                )
              )
          ),
          catchError((err) =>
            of(
              actions.failCreate(
                extractError(err, "Failed to read certificate")
              )
            )
          )
        )
    )
  );

const deleteAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DeleteRequest)),
    switchMap(({ uuid, history }) =>
      apiClients.admins.deleteAdmin(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveDelete(uuid);
        }),
        catchError((err) =>
          of(actions.failDelete(extractError(err, "Failed to delete client")))
        )
      )
    )
  );

const disableAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.disableAdmin(uuid).pipe(
        map(() => actions.receiveDisable(uuid)),
        catchError((err) =>
          of(
            actions.failDisable(
              extractError(err, "Failed to disable administrator")
            )
          )
        )
      )
    )
  );

const enableAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.EnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.enableAdmin(uuid).pipe(
        map(() => actions.receiveEnable(uuid)),
        catchError((err) =>
          of(
            actions.failEnable(
              extractError(err, "Failed to enable administrator")
            )
          )
        )
      )
    )
  );

const bulkDeleteAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDeleteRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.bulkDeleteAdmin(uuid).pipe(
        map(() => actions.receiveBulkDelete(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDelete(
              extractError(err, "Failed to delete administrators")
            )
          )
        )
      )
    )
  );

const bulkDisableAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.bulkDisableAdmin(uuid).pipe(
        map(() => actions.receiveBulkDisable(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDisable(
              extractError(err, "Failed to disable administrator")
            )
          )
        )
      )
    )
  );

const bulkEnableAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.BulkEnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.bulkEnableAdmin(uuid).pipe(
        map(() => actions.receiveBulkEnable(uuid)),
        catchError((err) =>
          of(
            actions.failBulkEnable(
              extractError(err, "Failed to enable administrator")
            )
          )
        )
      )
    )
  );

const fetchAdditionalDetailData: Epic<Action, Action, AppState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    mergeMap(({ uuid }) => {
      const result = [] as Action[];
      const admins = selectors.selectAdministrators(state$.value);

      if (!admins.find((a) => a.uuid === uuid)) {
        result.push(actions.requestAdministratorsList());
      }

      return result;
    })
  );

const getAdminDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.admins.getAdminDetail(uuid).pipe(
        map((detail) => actions.receiveDetail(mapAdminDetail(uuid, detail))),
        catchError((err) =>
          of(
            actions.failDetail(
              extractError(err, "Failed to retrieve administrator details")
            )
          )
        )
      )
    )
  );

const getAdminsList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.admins.getAdminsList().pipe(
        map((admins) =>
          Array.isArray(admins)
            ? actions.receiveAdministratorsList(admins.map(mapAdministrator))
            : actions.failAdministratorsList(
                "Failed to retrieve administrators list"
              )
        ),
        catchError((err) =>
          of(
            actions.failAdministratorsList(
              extractError(err, "Failed to retrieve administrators list")
            )
          )
        )
      )
    )
  );

const updateAdmin: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateRequest)),
    switchMap(
      ({
        uuid,
        name,
        surname,
        username,
        email,
        certificate,
        description,
        superAdmin,
        certificateUuid,
        history,
      }) =>
        (certificate ? readCertificate(certificate) : of("")).pipe(
          switchMap((adminCertificate) =>
            apiClients.admins
              .updateAdmin(
                uuid,
                name,
                surname,
                username,
                email,
                adminCertificate || undefined,
                description,
                superAdmin ? Role.SuperAdmin : Role.Admin,
                certificateUuid
              )
              .pipe(
                map((admin) => {
                  history.push(`../detail/${uuid}`);
                  return actions.receiveUpdate(mapAdminDetail(uuid, admin));
                }),
                catchError((err) =>
                  of(
                    actions.failUpdate(
                      extractError(err, "Failed to update administrator")
                    )
                  )
                )
              )
          ),
          catchError((err) =>
            of(
              actions.failUpdate(
                extractError(err, "Failed to read certificate")
              )
            )
          )
        )
    )
  );

function mapAdministrator(admin: AdminInfoResponse): Administrator {
  return {
    uuid: admin.uuid,
    name: admin.name,
    surname: admin.surname,
    username: admin.username,
    certificate: admin.certificate,
    superAdmin: admin.role === Role.SuperAdmin,
    enabled: admin.enabled,
    serialNumber: admin.serialNumber,
  };
}

function mapAdminDetail(
  uuid: string,
  data: AdministratorDetailDTO
): AdministratorDetail {
  return {
    uuid,
    certificate: data.certificate,
    name: data.name,
    surname: data.surname,
    username: data.username,
    description: data.description,
    email: data.email,
    superAdmin: data.role === Role.SuperAdmin,
    enabled: data.enabled,
    serialNumber: data.serialNumber,
  };
}

const epics = [
  createAdmin,
  deleteAdmin,
  disableAdmin,
  enableAdmin,
  bulkDeleteAdmin,
  bulkEnableAdmin,
  bulkDisableAdmin,
  fetchAdditionalDetailData,
  getAdminDetail,
  getAdminsList,
  updateAdmin,
];

export default epics;

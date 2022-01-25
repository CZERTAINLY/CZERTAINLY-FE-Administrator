import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";

import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./acme-profiles";

const getProfilesList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(() =>
      apiClients.acmeProfiles.getAcmeProfilesList().pipe(
        map((profiles) =>
          Array.isArray(profiles)
            ? actions.receiveAcmeProfilesList(profiles)
            : actions.failAcmeProfilesList("Failed to get ACME Profiles list")
        ),
        catchError((err) =>
          of(
            actions.failAcmeProfilesList(
              extractError(err, "Failed to get ACME Profiles list")
            )
          )
        )
      )
    )
  );

const getProfileDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.getAcmeProfileDetail(uuid).pipe(
        map((detail) => {
          try {
            return actions.receiveProfileDetail(detail);
          } catch (err) {
            return actions.failProfileDetail(
              "Failed to get ACME Profile detail"
            );
          }
        }),
        catchError((err) =>
          of(
            actions.failProfileDetail(
              extractError(err, "Failed to get ACME Profile detail")
            )
          )
        )
      )
    )
  );

const createAcmeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.CreateRequest)),
    switchMap(
      ({
        name,
        description,
        termsOfServiceUrl,
        dnsResolverIp,
        dnsResolverPort,
        raProfileUuid,
        websiteUrl,
        retryInterval,
        termsOfServiceChangeApproval,
        validity,
        issueCertificateAttributes,
        revokeCertificateAttributes,
        insistContact,
        insistTermsOfService,
        changeTermsOfServiceUrl,
        history,
      }) =>
        apiClients.acmeProfiles
          .createAcmeProfile(
            name,
            description,
            termsOfServiceUrl,
            dnsResolverIp,
            dnsResolverPort,
            raProfileUuid,
            websiteUrl,
            retryInterval,
            termsOfServiceChangeApproval,
            validity,
            issueCertificateAttributes,
            revokeCertificateAttributes,
            insistContact,
            insistTermsOfService,
            changeTermsOfServiceUrl
          )
          .pipe(
            map((uuid) => {
              history.push(`./detail/${uuid}`);
              return actions.receiveCreateAcmeProfile(uuid);
            }),
            catchError((err) =>
              of(
                actions.failCreateAcmeProfile(
                  extractError(err, "Failed to create ACME Profile")
                )
              )
            )
          )
    )
  );

const deleteAcmeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ConfirmDelete)),
    switchMap(({ uuid, history }) =>
      apiClients.acmeProfiles.deleteAcmeProfile(uuid).pipe(
        map(() => {
          history.push("..");
          return actions.receiveDeleteProfile(uuid);
        }),
        catchError((err) =>
          of(
            actions.failDeleteProfile(
              extractError(err, "Failed to delete profile")
            )
          )
        )
      )
    )
  );

const enableAcmeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.EnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.enableAcmeProfile(uuid).pipe(
        map(() => actions.receiveEnableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failEnableProfile(
              extractError(err, "Failed to enable profile")
            )
          )
        )
      )
    )
  );

const disableAcmeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.disableAcmeProfile(uuid).pipe(
        map(() => actions.receiveDisableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failDisableProfile(
              extractError(err, "Failed to disable profile")
            )
          )
        )
      )
    )
  );

const bulkDeleteAcmeProfile: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkConfirmDelete)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.bulkDeleteAcmeProfile(uuid).pipe(
        map(() => actions.receiveBulkDeleteProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDeleteProfile(
              extractError(err, "Failed to delete profile")
            )
          )
        )
      )
    )
  );

const bulkEnableAcmeProfile: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkEnableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.bulkEnableAcmeProfile(uuid).pipe(
        map(() => actions.receiveBulkEnableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkEnableProfile(
              extractError(err, "Failed to enable profile")
            )
          )
        )
      )
    )
  );

const bulkDisableAcmeProfile: Epic<
  Action,
  Action,
  AppState,
  EpicDependencies
> = (action$, _, { apiClients }) =>
  action$.pipe(
    filter(isOfType(Actions.BulkDisableRequest)),
    switchMap(({ uuid }) =>
      apiClients.acmeProfiles.bulkDisableAcmeProfile(uuid).pipe(
        map(() => actions.receiveBulkDisableProfile(uuid)),
        catchError((err) =>
          of(
            actions.failBulkDisableProfile(
              extractError(err, "Failed to disable profile")
            )
          )
        )
      )
    )
  );

const updateAcmeProfile: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.UpdateProfileRequest)),
    switchMap(
      ({
        uuid,
        description,
        termsOfServiceUrl,
        dnsResolverIp,
        dnsResolverPort,
        raProfileUuid,
        websiteUrl,
        retryInterval,
        termsOfServiceChangeApproval,
        validity,
        issueCertificateAttributes,
        revokeCertificateAttributes,
        insistContact,
        insistTermsOfService,
        changeTermsOfServiceUrl,
        history,
      }) =>
        apiClients.acmeProfiles
          .updateAcmeProfile(
            uuid,
            description,
            termsOfServiceUrl,
            dnsResolverIp,
            dnsResolverPort,
            raProfileUuid,
            websiteUrl,
            retryInterval,
            termsOfServiceChangeApproval,
            validity,
            issueCertificateAttributes,
            revokeCertificateAttributes,
            insistContact,
            insistTermsOfService,
            changeTermsOfServiceUrl
          )
          .pipe(
            map((profile) => {
              history.push(`../detail/${uuid}`);
              return actions.receiveUpdateProfile(profile);
            }),
            catchError((err) =>
              of(
                actions.failUpdateProfile(
                  extractError(err, "Failed to update profile")
                )
              )
            )
          )
    )
  );

const epics = [
  createAcmeProfile,
  deleteAcmeProfile,
  enableAcmeProfile,
  disableAcmeProfile,
  bulkDeleteAcmeProfile,
  bulkDisableAcmeProfile,
  bulkEnableAcmeProfile,
  getProfilesList,
  getProfileDetail,
  updateAcmeProfile,
];

export default epics;

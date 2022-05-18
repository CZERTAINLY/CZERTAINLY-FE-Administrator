import { Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { isOfType } from "typesafe-actions";
import { extractError } from "utils/net";
import { EpicDependencies, State as AppState } from "./app-state";
import { Action, Actions, actions } from "./certificates";

const getCertificatesList: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.ListRequest)),
    switchMap(({ searchField }) =>
      apiClients.certificates.getCertificatesList(searchField).pipe(
        map((certificates) =>
          Array.isArray(certificates.certificates)
            ? actions.receiveCertificatesList(certificates)
            : actions.failCertificatesList(
                "Failed to retrieve certificates list"
              )
        ),
        catchError((err) =>
          of(
            actions.failCertificatesList(
              extractError(err, "Failed to retrieve certificates list")
            )
          )
        )
      )
    )
  );

const getCertificateDetail: Epic<Action, Action, AppState, EpicDependencies> = (
  action$,
  _,
  { apiClients }
) =>
  action$.pipe(
    filter(isOfType(Actions.DetailRequest)),
    switchMap(({ uuid }) =>
      apiClients.certificates.getCertificateDetail(uuid).pipe(
        map((certificates) => actions.receiveCertificateDetail(certificates)),
        catchError((err) =>
          of(
            actions.failCertificateDetail(
              extractError(err, "Failed to retrieve certificates information")
            )
          )
        )
      )
    )
  );

const epics = [getCertificatesList, getCertificateDetail];

export default epics;

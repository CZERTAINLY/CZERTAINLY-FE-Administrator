import { CertificateDetailResponse } from "models";
import { createSelector } from "reselect";
import { ActionType, createCustomAction, getType } from "typesafe-actions";
import { createFeatureSelector } from "utils/ducks";
import { createErrorAlertAction } from "./alerts";

export const statePath = "certificates";

export enum Actions {
  DetailRequest = "@@certificates/DETAIL_REQUEST",
  DetailSuccess = "@@certificates/DETAIL_SUCCESS",
  DetailFailure = "@@certificates/DETAIL_FAILURE",
  ListRequest = "@@certificates/LIST_REQUEST",
  ListSuccess = "@@certificates/LIST_SUCCESS",
  ListFailure = "@@certificates/LIST_FAILURE",
}

export const actions = {
  requestCertificateDetail: createCustomAction(
    Actions.DetailRequest,
    (uuid: string) => ({ uuid })
  ),
  receiveCertificateDetail: createCustomAction(
    Actions.DetailSuccess,
    (data: CertificateDetailResponse) => ({ data })
  ),
  failCertificateDetail: createCustomAction(
    Actions.DetailFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
  requestCertificatesList: createCustomAction(Actions.ListRequest),
  receiveCertificatesList: createCustomAction(
    Actions.ListSuccess,
    (certificates: CertificateDetailResponse[]) => ({ certificates })
  ),
  failCertificatesList: createCustomAction(
    Actions.ListFailure,
    (error?: string) => createErrorAlertAction(error)
  ),
};

export type Action = ActionType<typeof actions>;

export type State = {
  certificates: CertificateDetailResponse[];
  isFetchingList: boolean;
  isFetchingDetail: boolean;
};

export const initialState: State = {
  certificates: [],
  isFetchingList: false,
  isFetchingDetail: false,
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(actions.requestCertificatesList):
      return {
        ...state,
        certificates: [],
        isFetchingList: true,
      };
    case getType(actions.receiveCertificatesList):
      return {
        ...state,
        isFetchingList: false,
        certificates: action.certificates,
      };
    case getType(actions.failCertificatesList):
      return { ...state, isFetchingList: false };

    default:
      return state;
  }
}

const selectState = createFeatureSelector<State>(statePath);

const selectCertificates = createSelector(
  selectState,
  (state) => state.certificates
);

const isFetchingList = createSelector(
  selectState,
  (state) => state.isFetchingList
);

const isFetchingDetail = createSelector(
  selectState,
  (state) => state.isFetchingDetail
);

export const selectors = {
  selectState,
  selectCertificates,
  isFetchingList,
  isFetchingDetail,
};

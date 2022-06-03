import { AttributeModel } from "models/attributes";
import { AuthorityModel } from "models/ca-authorities";
import { ErrorDeleteObject } from "models/commons";
import { ConnectorModel } from "models/connectors";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";

export type State = {
    authorities: AuthorityModel[];
    authorityProviders: ConnectorModel[];
    authorityProviderAttributes: AttributeModel[];
    isCreatingAuthority: boolean;
    isDeletingAuthority: boolean;
    isFetchingProfiles: boolean;
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingAttributes: boolean;
    isEditing: boolean;
    confirmDeleteAuthority: string;
    selectedAuthority: AuthorityModel | null;
    authorityConnectorUuid: string;
    authorityCredentialUuid: string;
    authorityCredentialName: string;
    deleteAuthorityErrors: ErrorDeleteObject[];
};

export const initialState: State = {
    authorities: [],
    authorityProviders: [],
    authorityProviderAttributes: [],
    isCreatingAuthority: false,
    isDeletingAuthority: false,
    isFetchingProfiles: false,
    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingAttributes: false,
    isEditing: false,
    confirmDeleteAuthority: "",
    selectedAuthority: null,
    authorityConnectorUuid: "",
    authorityCredentialUuid: "",
    authorityCredentialName: "",
    deleteAuthorityErrors: [],
};

export const slice = createSlice({
    name: "authorities",
    initialState,
    reducers: {
        listAuthorities: (state, action: PayloadAction<void>) => {
            state.authorities = [];
            state.isFetchingList = true;
        },
        listAuthoritiesSuccess: (state, action: PayloadAction<AuthorityModel[]>) => {
            state.authorities = action.payload;
            state.isFetchingList = false;
        },
        listAuthoritiesFailure: (state, action: PayloadAction<string>) => {
            state.isFetchingList = false;
        },
        getAuthorityDetail: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        getAuthorityDetailSuccess: (state, action: PayloadAction<AuthorityModel>) => {
            state.selectedAuthority = action.payload;
            state.isFetchingDetail = false;
        },
        getAuthorityDetailFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false;
        },
        getAuthorityAttributes: (state, action: PayloadAction<{ uuid: string, kind: string, functionGroup: string }>) => {
            state.isFetchingAttributes = true;
        },
        getAuthorityAttributesSuccess: (state, action: PayloadAction<AttributeModel[]>) => {
            state.authorityProviderAttributes = action.payload;
            state.isFetchingAttributes = false;
        },
        getAuthorityAttributesFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingAttributes = false;
        },
        getAuthorityProviders: (state, action: PayloadAction<void>) => {
            state.authorityProviders = [];
            state.isFetchingProfiles = true;
        },
        getAuthorityProvidersSuccess: (state, action: PayloadAction<ConnectorModel[]>) => {
            state.authorityProviders = action.payload;
            state.isFetchingProfiles = false;
        },
        getAuthorityProvidersFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingProfiles = false;
        },
        createAuthority: (state, action: PayloadAction<{
            name: string,
            connectorUuid: string,
            credential: any,
            status: string,
            attributes: AttributeModel[],
            kind: string,
        }>) => {
            state.isCreatingAuthority = true;
        },
        createAuthoritySuccess: (state, action: PayloadAction<string>) => {
            state.isCreatingAuthority = false;
        },
        createAuthorityFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isCreatingAuthority = false;
        },
        editAuthority: (state, action: PayloadAction<AuthorityModel>) => {
            state.isEditing = true;
        },
        editAuthoritySuccess: (state, action: PayloadAction<AuthorityModel>) => {
            state.isEditing = false;
        },
        editAuthorityFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isEditing = false;
        },
        deleteAuthority: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = true;
        },
        deleteAuthoritySuccess: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
            const index = state.authorities.findIndex(a => a.uuid === action.payload);
            if (index !== -1) {
                state.authorities.splice(index, 1);
            }
        },
        deleteAuthorityFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
        },
        forceDeleteAuthority: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = true;
        },
        forceDeleteAuthoritySuccess: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
            const index = state.authorities.findIndex(a => a.uuid === action.payload);
            if (index !== -1) {
                state.authorities.splice(index, 1);
            }
        },
        forceDeleteAuthorityFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
        },
        bulkDeleteAuthority: (state, action: PayloadAction<string[]>) => {
            state.isDeletingAuthority = true;
        },
        bulkDeleteAuthoritySuccess: (state, action: PayloadAction<{ uuid: string[], error: DeleteObjectErrorModel[] }>) => {
            let upd: AuthorityModel[] = [];
            const failedDelete: (string | number)[] = action.payload.error.map(
                function (conn: ErrorDeleteObject) {
                    return conn.uuid;
                }
            );
            for (let i of state.authorities) {
                if (action.payload.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
                    upd.push(i);
                } else if (!action.payload.uuid.includes(i.uuid)) {
                    upd.push(i);
                }
            }
            state.authorities = upd;
            state.isDeletingAuthority = false;
        },
        bulkDeleteAuthorityFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
        },

        bulkForceDeleteAuthority: (state, action: PayloadAction<string[]>) => {
            state.isDeletingAuthority = true;
        },
        bulkForceDeleteAuthoritySuccess: (state, action: PayloadAction<string[]>) => {
            state.isDeletingAuthority = false;
            action.payload.forEach(uuid => {
                const index = state.authorities.findIndex(a => a.uuid === uuid);
                if (index !== -1) {
                    state.authorities.splice(index, 1);
                }
            });
        },
        bulkForceDeleteAuthorityFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingAuthority = false;
        }
    }
}
)

const state = createFeatureSelector<State>(slice.name);

const isCreatingAuthority = createSelector(
    state,
    (state) => state.isCreatingAuthority
);

const isDeletingAuthority = createSelector(
    state,
    (state) => state.isDeletingAuthority
);

const isEditing = createSelector(state, (state) => state.isEditing);

const isFetchingAttributes = createSelector(
    state,
    (state) => state.isFetchingAttributes
);

const isFetching = createSelector(
    state,
    (state) => state.isFetchingList || state.isFetchingDetail
);

const authorities = createSelector(
    state,
    (state) => state.authorities
);

const authorityProviders = createSelector(
    state,
    (state) => state.authorityProviders
);

const authorityProviderAttributes = createSelector(
    state,
    (state) => state.authorityProviderAttributes
);

const authority = createSelector(
    state,
    (state) => state.selectedAuthority
);

const authorityDetails = createSelector(
    state,
    (state) => state.selectedAuthority
);


const authorityConnectorId = createSelector(
    state,
    (state) => state.authorityConnectorUuid
);

const authorityCredentialId = createSelector(
    state,
    (state) => state.authorityCredentialUuid
);

const authorityCredentialName = createSelector(
    state,
    (state) => state.authorityCredentialName
);

const deleteAuthorityError = createSelector(
    state,
    (state) => state.deleteAuthorityErrors
);

export const selectors = {
    state,
    isCreatingAuthority,
    isDeletingAuthority,
    isEditing,
    isFetching,
    isFetchingAttributes,
    authorities,
    authorityProviders,
    authorityProviderAttributes,
    authority,
    authorityDetails,
    authorityConnectorId,
    authorityCredentialId,
    authorityCredentialName,
    deleteAuthorityError,
};

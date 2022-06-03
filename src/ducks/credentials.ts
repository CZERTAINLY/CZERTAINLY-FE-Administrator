import { ErrorDeleteObject } from "models/commons";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CredentialModel, CredentialProviderModel } from "models/credentials";
import { AttributeModel } from "models/attributes";
import { CredentialDTO } from "api/credential";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";

export type State = {
    credentials: CredentialModel[];
    credentialProviders: CredentialProviderModel[];
    credentialProviderAttributes: AttributeModel[];
    isCreatingCredential: boolean;
    isDeletingCredential: boolean;
    isFetchingAttributes: boolean;
    isFetchingProfiles: boolean;
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isAuthorizingProfile: boolean;
    isEditing: boolean;
    confirmDeleteCredential: string;
    credential: CredentialModel | null;
    credentialConnectorUuid: string;
    deleteCredentialErrors: ErrorDeleteObject[];
};

export const initialState: State = {
    credentials: [],
    credentialProviders: [],
    credentialProviderAttributes: [],
    isCreatingCredential: false,
    isDeletingCredential: false,
    isFetchingAttributes: false,
    isFetchingProfiles: false,
    isFetchingList: false,
    isFetchingDetail: false,
    isAuthorizingProfile: false,
    isEditing: false,
    confirmDeleteCredential: "",
    credential: null,
    credentialConnectorUuid: "",
    deleteCredentialErrors: [],
};


export const slice = createSlice({

    name: "credentials",

    initialState,

    reducers: {
        listCredentials: (state, action: PayloadAction<void>) => {
            state.credentials = [];
            state.isFetchingList = true;
        },

        listCredentialsSuccess: (state, action: PayloadAction<CredentialModel[]>) => {
            state.credentials = action.payload;
            state.isFetchingList = false;
        },

        listCredentialsFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingList = false;
        },

        listCredentialProviders: (state, action: PayloadAction<void>) => {
            state.credentialProviders = [];
        },

        listCredentialProvidersSuccess: (state, action: PayloadAction<CredentialProviderModel[]>) => {
            state.credentialProviders = action.payload;
        },

        listCredentialProvidersFailure: (state, action: PayloadAction<string | undefined>) => { },

        listCredentialProviderAttributes: (state, action: PayloadAction<void>) => {
            state.credentialProviderAttributes = [];
        },

        listCredentialProviderAttributesSuccess: (state, action: PayloadAction<AttributeModel[]>) => {
            state.credentialProviderAttributes = action.payload;
        },

        listCredentialProviderAttributesFailure: (state, action: PayloadAction<string | undefined>) => { },

        getCredentialDetail: (state, action: PayloadAction<void>) => {
            state.credential = null;
            state.isFetchingDetail = true;
        },

        getCredentialDetailSuccess: (state, action: PayloadAction<CredentialModel>) => {
            state.credential = action.payload;
            state.isFetchingDetail = false;
        },

        getCredentialDetailFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false;
        },

        createCredential: (state, action: PayloadAction<{
            name: string,
            kind: string,
            connectorUuid: string,
            attributes: any
        }>) => {
            state.isCreatingCredential = true;
        },

        createCredentialSuccess: (state, action: PayloadAction<string>) => {
            state.isCreatingCredential = false;
        },

        createCredentialFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isCreatingCredential = false;
        },

        deleteCredential: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = true;
        },

        deleteCredentialSuccess: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = false;
            const index = state.credentials.findIndex(credential => credential.uuid === action.payload);
            if (index >= 0) state.credentials.splice(index, 1);
        },

        deleteCredentialFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = false;
        },

        forceDeleteCredential: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = true;
        },

        forceDeleteCredentialSuccess: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = false;
            const index = state.credentials.findIndex(credential => credential.uuid === action.payload);
            if (index >= 0) state.credentials.splice(index, 1);
        },

        forceDeleteCredentialFailure: (state, action: PayloadAction<ErrorDeleteObject[]>) => {
            state.isDeletingCredential = false;
            state.deleteCredentialErrors = action.payload;
        },

        bulkDeleteCredentials: (state, action: PayloadAction<string[]>) => {
            state.isDeletingCredential = true;
        },

        bulkDeleteCredentialsSuccess: (state, action: PayloadAction<{ uuid: string[], error: DeleteObjectErrorModel[] }>) => {
            let upd: CredentialModel[] = [];
            const failedDelete: string[] = action.payload.error.map(
                function (conn: ErrorDeleteObject) {
                    return conn.uuid;
                }
            );
            for (let i of state.credentials) {
                if (action.payload.uuid.includes(i.uuid) && failedDelete.includes(i.uuid)) {
                    upd.push(i);
                } else if (!action.payload.uuid.includes(i.uuid)) {
                    upd.push(i);
                }
            }
            state.credentials = upd;
            state.isDeletingCredential = false;
            state.deleteCredentialErrors = action.payload.error;
        },

        bulkDeleteCredentialsFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = false;
        },

        bulkForceDeleteCredentials: (state, action: PayloadAction<string[]>) => {
            state.isDeletingCredential = true;
        },

        bulkForceDeleteCredentialsSuccess: (state, action: PayloadAction<string[]>) => {
            state.isDeletingCredential = false;
            action.payload.forEach(uuid => {
                const index = state.credentials.findIndex(credential => credential.uuid === uuid);
                if (index >= 0) state.credentials.splice(index, 1);
            }
            );
        },

        bulkForceDeleteCredentialsFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingCredential = false;
        },

        editCredential: (state, action: PayloadAction<{ uuid: string, attributes: AttributeModel[] }>) => {
            state.isEditing = true;
        },

        editCredentialSuccess: (state, action: PayloadAction<CredentialModel>) => {
            state.isEditing = false;
            state.credential = action.payload;
        },

        editCredentialFailure: (state, action: PayloadAction<string | undefined>) => {
            state.isEditing = false;
        }
    }
}
)

const state = createFeatureSelector<State>(slice.name);


const isCreatingCredential = createSelector(
    state,
    (state) => state.isCreatingCredential
);

const isDeletingCredential = createSelector(
    state,
    (state) => state.isDeletingCredential
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

const credentials = createSelector(
    state,
    (state) => state.credentials
);

const credentialProviders = createSelector(
    state,
    (state) => state.credentialProviders
);

const credentialProviderAttributes = createSelector(
    state,
    (state) => state.credentialProviderAttributes
);

const credential = createSelector(
    state,
    (state) => state.credential
);

const selectCredentialDetails = createSelector(
    state,
    (state) => state.credential
);

const selectConfirmDeleteCredentialId = createSelector(
    state,
    (state) => state.confirmDeleteCredential
);

const selectCredentialConnectorId = createSelector(
    state,
    (state) => state.credentialConnectorUuid
);

const selectDeleteCredentialError = createSelector(
    state,
    (state) => state.deleteCredentialErrors
);

export const selectors = {
    state,
    isCreatingCredential,
    isDeletingCredential,
    isEditing,
    isFetchingAttributes,
    isFetching,
    credentials,
    credentialProviders,
    credentialProviderAttributes,
    credential,
    selectCredentialDetails,
    selectCredentialConnectorId,
    selectConfirmDeleteCredentialId,
    selectDeleteCredentialError,
};
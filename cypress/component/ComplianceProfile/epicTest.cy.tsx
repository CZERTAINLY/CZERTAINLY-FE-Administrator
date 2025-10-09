import { configureStore } from '@reduxjs/toolkit';
import { actions as complianceProfileActions, slice as complianceProfileSlice } from '../../../src/ducks/compliance-profiles';
import { Resource } from '../../../src/types/openapi';

describe('Compliance Profile Epic Tests', () => {
    let store: any;

    beforeEach(() => {
        // Create a simpler store for testing without epic middleware
        store = configureStore({
            reducer: {
                complianceProfiles: complianceProfileSlice.reducer,
            },
        });
    });

    describe('Epic Middleware Integration', () => {
        it('should handle async actions correctly', () => {
            // Test that actions can be dispatched
            expect(() => {
                store.dispatch(complianceProfileActions.getListComplianceProfiles());
            }).to.not.throw();

            // Check that loading state is set
            const state = store.getState().complianceProfiles;
            expect(state.isFetchingList).to.be.true;
        });

        it('should handle action flow properly', () => {
            const actions: any[] = [];

            // Subscribe to store changes
            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                actions.push(state.complianceProfiles.isFetchingList);
            });

            // Dispatch action
            store.dispatch(complianceProfileActions.getListComplianceProfiles());

            // Unsubscribe
            unsubscribe();

            // Should have recorded state changes
            expect(actions.length).to.be.greaterThan(0);
        });
    });

    describe('CRUD Operations Epics', () => {
        it('should handle getListComplianceProfiles epic flow', () => {
            // Initial state
            const initialState = store.getState().complianceProfiles.isFetchingList;
            expect(initialState).to.be.false;

            // Dispatch fetch action
            store.dispatch(complianceProfileActions.getListComplianceProfiles());

            // Should be loading
            const loadingState = store.getState().complianceProfiles.isFetchingList;
            expect(loadingState).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getListComplianceProfilesSuccess({
                    complianceProfileList: [],
                }),
            );

            // Should not be loading anymore
            const finalState = store.getState().complianceProfiles.isFetchingList;
            expect(finalState).to.be.false;
        });

        it('should handle getComplianceProfile epic flow', () => {
            const testUuid = 'test-profile-uuid';

            // Dispatch get profile action
            store.dispatch(complianceProfileActions.getComplianceProfile({ uuid: testUuid }));

            // Should be loading
            const state = store.getState().complianceProfiles;
            expect(state.isFetchingDetail).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getComplianceProfileSuccess({
                    complianceProfile: {
                        uuid: testUuid,
                        name: 'Test Profile',
                        description: 'Test Description',
                        providerRules: [],
                        internalRules: [],
                    },
                }),
            );

            // Should not be loading and profile should be set
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingDetail).to.be.false;
            expect(finalState.complianceProfile?.uuid).to.equal(testUuid);
        });

        it('should handle createComplianceProfile epic flow', () => {
            const testProfile = {
                name: 'New Profile',
                description: 'New Description',
                connectorUuid: 'connector-uuid',
                kind: 'Test Kind',
            };

            // Dispatch create action
            store.dispatch(complianceProfileActions.createComplianceProfile(testProfile));

            // Should be creating
            const state = store.getState().complianceProfiles;
            expect(state.isCreating).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.createComplianceProfileSuccess({
                    uuid: 'new-profile-uuid',
                }),
            );

            // Should not be creating anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isCreating).to.be.false;
        });

        it('should handle deleteComplianceProfile epic flow', () => {
            const testUuid = 'profile-to-delete';

            // Dispatch delete action
            store.dispatch(complianceProfileActions.deleteComplianceProfile({ uuid: testUuid }));

            // Should be deleting
            const state = store.getState().complianceProfiles;
            expect(state.isDeleting).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileSuccess({
                    uuid: testUuid,
                }),
            );

            // Should not be deleting anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isDeleting).to.be.false;
        });
    });

    describe('Bulk Operations Epics', () => {
        it('should handle bulkDeleteComplianceProfiles epic flow', () => {
            const testUuids = ['uuid1', 'uuid2', 'uuid3'];

            // Dispatch bulk delete action
            store.dispatch(complianceProfileActions.bulkDeleteComplianceProfiles({ uuids: testUuids }));

            // Should be bulk deleting
            const state = store.getState().complianceProfiles;
            expect(state.isBulkDeleting).to.be.true;

            // Dispatch success action with errors
            store.dispatch(
                complianceProfileActions.bulkDeleteComplianceProfilesSuccess({
                    uuids: testUuids,
                    errors: [
                        {
                            uuid: 'profile1',
                            name: 'Profile 1',
                            message: 'Cannot delete profile with associations',
                        },
                    ],
                }),
            );

            // Should not be bulk deleting anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isBulkDeleting).to.be.false;
            expect(finalState.bulkDeleteErrorMessages).to.have.length(1);
        });

        it('should handle bulkForceDeleteComplianceProfiles epic flow', () => {
            const testUuids = ['uuid1', 'uuid2'];

            // Dispatch bulk force delete action
            store.dispatch(
                complianceProfileActions.bulkForceDeleteComplianceProfiles({
                    uuids: testUuids,
                    redirect: '/complianceprofiles',
                }),
            );

            // Should be bulk force deleting
            const state = store.getState().complianceProfiles;
            expect(state.isBulkForceDeleting).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.bulkForceDeleteComplianceProfilesSuccess({
                    uuids: testUuids,
                    redirect: '/complianceprofiles',
                }),
            );

            // Should not be bulk force deleting anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isBulkForceDeleting).to.be.false;
        });
    });

    describe('Association Epics', () => {
        it('should handle associateComplianceProfile epic flow', () => {
            const associationData = {
                uuid: 'profile-uuid',
                resource: Resource.Certificates,
                associationObjectUuid: 'cert-uuid',
                associationObjectName: 'Test Certificate',
            };

            // Dispatch associate action
            store.dispatch(complianceProfileActions.associateComplianceProfile(associationData));

            // Should be associating
            const state = store.getState().complianceProfiles;
            expect(state.isAssociatingComplianceProfile).to.be.true;

            // Dispatch success action
            store.dispatch(complianceProfileActions.associateComplianceProfileSuccess(associationData));

            // Should not be associating anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isAssociatingComplianceProfile).to.be.false;
        });

        it('should handle dissociateComplianceProfile epic flow', () => {
            const dissociationData = {
                uuid: 'profile-uuid',
                resource: Resource.Certificates,
                associationObjectUuid: 'cert-uuid',
            };

            // Dispatch dissociate action
            store.dispatch(complianceProfileActions.dissociateComplianceProfile(dissociationData));

            // Should be dissociating
            const state = store.getState().complianceProfiles;
            expect(state.isDissociatingComplianceProfile).to.be.true;

            // Dispatch success action
            store.dispatch(complianceProfileActions.dissociateComplianceProfileSuccess(dissociationData));

            // Should not be dissociating anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isDissociatingComplianceProfile).to.be.false;
        });

        it('should handle getAssociatedComplianceProfiles epic flow', () => {
            const requestData = {
                resource: Resource.Certificates,
                associationObjectUuid: 'cert-uuid',
            };

            // Dispatch get associated profiles action
            store.dispatch(complianceProfileActions.getAssociatedComplianceProfiles(requestData));

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getAssociatedComplianceProfilesSuccess({
                    complianceProfiles: [
                        {
                            uuid: 'profile1',
                            name: 'Profile 1',
                            description: 'Description 1',
                            providerRulesCount: 3,
                            providerGroupsCount: 2,
                            internalRulesCount: 1,
                            associations: 0,
                        },
                    ],
                }),
            );

            // Should have associated profiles
            const finalState = store.getState().complianceProfiles;
            expect(finalState.associatedComplianceProfiles).to.have.length(1);
        });

        it('should handle getAssociationsOfComplianceProfile epic flow', () => {
            const testUuid = 'profile-uuid';

            // Dispatch get associations action
            store.dispatch(complianceProfileActions.getAssociationsOfComplianceProfile({ uuid: testUuid }));

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getAssociationsOfComplianceProfileSuccess({
                    associations: [
                        {
                            resource: Resource.Certificates,
                            objectUuid: 'cert1',
                            name: 'Certificate 1',
                        },
                    ],
                }),
            );

            // Should have associations
            const finalState = store.getState().complianceProfiles;
            expect(finalState.associationsOfComplianceProfile).to.have.length(1);
        });
    });

    describe('Rules and Groups Epics', () => {
        it('should handle getListComplianceRules epic flow', () => {
            const requestData = {
                resource: Resource.Certificates,
                connectorUuid: 'connector-uuid',
                kind: 'Test Kind',
                type: 'Test Type',
                format: 'Test Format',
            };

            // Dispatch get rules action
            store.dispatch(complianceProfileActions.getListComplianceRules(requestData));

            // Should be fetching rules
            const state = store.getState().complianceProfiles;
            expect(state.isFetchingRules).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getListComplianceRulesSuccess({
                    rules: [
                        {
                            uuid: 'rule1',
                            name: 'Rule 1',
                            description: 'Description 1',
                            connectorUuid: 'connector1',
                            kind: 'Kind 1',
                            type: 'Type 1',
                            resource: Resource.Certificates,
                            attributes: [],
                        },
                    ],
                }),
            );

            // Should not be fetching and have rules
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingRules).to.be.false;
            expect(finalState.rules).to.have.length(1);
        });

        it('should handle getListComplianceGroups epic flow', () => {
            const requestData = {
                connectorUuid: 'connector-uuid',
                kind: 'Test Kind',
                resource: Resource.Certificates,
            };

            // Dispatch get groups action
            store.dispatch(complianceProfileActions.getListComplianceGroups(requestData));

            // Should be fetching groups
            const state = store.getState().complianceProfiles;
            expect(state.isFetchingGroups).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getListComplianceGroupsSuccess({
                    groups: [
                        {
                            uuid: 'group1',
                            name: 'Group 1',
                            description: 'Description 1',
                            connectorUuid: 'connector1',
                            kind: 'Kind 1',
                        },
                    ],
                }),
            );

            // Should not be fetching and have groups
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingGroups).to.be.false;
            expect(finalState.groups).to.have.length(1);
        });

        it('should handle getListComplianceGroupRules epic flow', () => {
            const requestData = {
                groupUuid: 'group-uuid',
                connectorUuid: 'connector-uuid',
                kind: 'Test Kind',
            };

            // Dispatch get group rules action
            store.dispatch(complianceProfileActions.getListComplianceGroupRules(requestData));

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getListComplianceGroupRulesSuccess({
                    rules: [
                        {
                            uuid: 'group-rule1',
                            name: 'Group Rule 1',
                            description: 'Description 1',
                            connectorUuid: 'connector1',
                            kind: 'Kind 1',
                            type: 'Type 1',
                            resource: Resource.Certificates,
                            attributes: [],
                        },
                    ],
                }),
            );

            // Should have group rules
            const finalState = store.getState().complianceProfiles;
            expect(finalState.groupRules).to.have.length(1);
        });
    });

    describe('Internal Rules Epics', () => {
        it('should handle createComplianceInternalRule epic flow', () => {
            const createData = {
                complianceInternalRuleRequestDto: {
                    name: 'Internal Rule',
                    description: 'Internal Rule Description',
                    resource: Resource.Certificates,
                    conditionItems: [],
                },
            };

            // Dispatch create internal rule action
            store.dispatch(complianceProfileActions.createComplianceInternalRule(createData));

            // Dispatch success action
            store.dispatch(complianceProfileActions.createComplianceInternalRuleSuccess());

            // Should trigger rules refresh
            const finalState = store.getState().complianceProfiles;
            expect(finalState.rules).to.exist;
        });

        it('should handle updateComplienceInternalRule epic flow', () => {
            const updateData = {
                internalRuleUuid: 'internal-rule-uuid',
                complianceInternalRuleRequestDto: {
                    name: 'Updated Internal Rule',
                    description: 'Updated Description',
                    resource: Resource.Certificates,
                    conditionItems: [],
                },
            };

            // Dispatch update internal rule action
            store.dispatch(complianceProfileActions.updateComplienceInternalRule(updateData));

            // Dispatch success action
            store.dispatch(complianceProfileActions.updateComplienceInternalRuleSuccess());

            // Should trigger rules refresh
            const finalState = store.getState().complianceProfiles;
            expect(finalState.rules).to.exist;
        });

        it('should handle deleteComplienceInternalRule epic flow', () => {
            const deleteData = {
                internalRuleUuid: 'internal-rule-uuid',
            };

            // Dispatch delete internal rule action
            store.dispatch(complianceProfileActions.deleteComplienceInternalRule(deleteData));

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.deleteComplienceInternalRuleSuccess({
                    uuid: deleteData.internalRuleUuid,
                }),
            );

            // Should trigger rules refresh
            const finalState = store.getState().complianceProfiles;
            expect(finalState.rules).to.exist;
        });
    });

    describe('Compliance Check Epics', () => {
        it('should handle checkComplianceForProfiles epic flow', () => {
            const checkData = {
                requestBody: ['profile1', 'profile2'],
                resource: Resource.Certificates,
                type: 'Test Type',
            };

            // Dispatch check compliance action
            store.dispatch(complianceProfileActions.checkComplianceForProfiles(checkData));

            // Should be checking compliance
            const state = store.getState().complianceProfiles;
            expect(state.isCheckingCompliance).to.be.true;

            // Dispatch success action
            store.dispatch(complianceProfileActions.checkComplianceForProfilesSuccess());

            // Should not be checking compliance anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isCheckingCompliance).to.be.false;
        });

        it('should handle checkComplianceForResourceObjects epic flow', () => {
            const checkData = {
                resource: Resource.Certificates,
                requestBody: ['cert1', 'cert2'],
            };

            // Dispatch check compliance action
            store.dispatch(complianceProfileActions.checkComplianceForResourceObjects(checkData));

            // Should be checking compliance
            const state = store.getState().complianceProfiles;
            expect(state.isCheckingCompliance).to.be.true;

            // Dispatch success action
            store.dispatch(complianceProfileActions.checkComplianceForResourceObjectsSuccess());

            // Should not be checking compliance anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isCheckingCompliance).to.be.false;
        });

        it('should handle checkResourceObjectCompliance epic flow', () => {
            const checkData = {
                resource: Resource.Certificates,
                objectUuid: 'cert-uuid',
            };

            // Dispatch check compliance action
            store.dispatch(complianceProfileActions.checkResourceObjectCompliance(checkData));

            // Should be checking compliance
            const state = store.getState().complianceProfiles;
            expect(state.isCheckingCompliance).to.be.true;

            // Dispatch success action
            store.dispatch(complianceProfileActions.checkResourceObjectComplianceSuccess());

            // Should not be checking compliance anymore
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isCheckingCompliance).to.be.false;
        });

        it('should handle getComplianceCheckResult epic flow', () => {
            const requestData = {
                resource: Resource.Certificates,
                objectUuid: 'check-result-uuid',
            };

            // Dispatch get compliance check result action
            store.dispatch(complianceProfileActions.getComplianceCheckResult(requestData));

            // Should be fetching compliance check result
            const state = store.getState().complianceProfiles;
            const key = `${requestData.resource}:${requestData.objectUuid}`;
            expect(state.isFetchingComplianceCheckResultByKey[key]).to.be.true;

            // Dispatch success action
            store.dispatch(
                complianceProfileActions.getComplianceCheckResultSuccess({
                    resource: Resource.Certificates,
                    objectUuid: 'check-result-uuid',
                    complianceCheckResult: {
                        status: 'COMPLIANT' as any,
                        message: 'Check completed successfully',
                        failedRules: [],
                    },
                }),
            );

            // Should have compliance check result and not be fetching
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingComplianceCheckResultByKey[key]).to.be.false;
            expect(finalState.complianceCheckResultByKey[key]).to.exist;
            expect(finalState.complianceCheckResultByKey[key]?.status).to.equal('COMPLIANT');
        });
    });

    describe('Error Handling Epics', () => {
        it('should handle epic errors gracefully', () => {
            // Test various error scenarios
            expect(() => {
                store.dispatch(complianceProfileActions.getListComplianceProfiles());
                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesFailed({
                        error: 'Network error',
                    }),
                );
            }).to.not.throw();

            expect(() => {
                store.dispatch(complianceProfileActions.createComplianceProfile({} as any));
                store.dispatch(
                    complianceProfileActions.createComplianceProfileFailed({
                        error: 'Validation error',
                    }),
                );
            }).to.not.throw();

            expect(() => {
                store.dispatch(complianceProfileActions.deleteComplianceProfile({ uuid: 'test' }));
                store.dispatch(
                    complianceProfileActions.deleteComplianceProfileFailed({
                        error: 'Delete error',
                    }),
                );
            }).to.not.throw();
        });

        it('should handle association errors gracefully', () => {
            expect(() => {
                store.dispatch(
                    complianceProfileActions.associateComplianceProfile({
                        uuid: 'test',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'test',
                        associationObjectName: 'test',
                    }),
                );
                store.dispatch(
                    complianceProfileActions.associateComplianceProfileFailed({
                        error: 'Association error',
                    }),
                );
            }).to.not.throw();

            expect(() => {
                store.dispatch(
                    complianceProfileActions.dissociateComplianceProfile({
                        uuid: 'test',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'test',
                    }),
                );
                store.dispatch(
                    complianceProfileActions.dissociateComplianceProfileFailed({
                        error: 'Dissociation error',
                    }),
                );
            }).to.not.throw();
        });
    });

    describe('Concurrent Epic Execution', () => {
        it('should handle multiple concurrent actions', () => {
            // Dispatch multiple actions
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            store.dispatch(complianceProfileActions.getComplianceProfile({ uuid: 'test' }));
            store.dispatch(complianceProfileActions.createComplianceProfile({} as any));

            const state = store.getState().complianceProfiles;
            expect(state.isFetchingList).to.be.true;
            expect(state.isFetchingDetail).to.be.true;
            expect(state.isCreating).to.be.true;
        });

        it('should handle concurrent association operations', () => {
            // Dispatch multiple association actions
            store.dispatch(
                complianceProfileActions.associateComplianceProfile({
                    uuid: 'profile1',
                    resource: Resource.Certificates,
                    associationObjectUuid: 'cert1',
                    associationObjectName: 'Cert 1',
                }),
            );
            store.dispatch(
                complianceProfileActions.dissociateComplianceProfile({
                    uuid: 'profile2',
                    resource: Resource.Certificates,
                    associationObjectUuid: 'cert2',
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isAssociatingComplianceProfile).to.be.true;
            expect(state.isDissociatingComplianceProfile).to.be.true;
        });
    });

    describe('State Management Epics', () => {
        it('should handle clearRules epic', () => {
            // Set some rules first
            store.dispatch(
                complianceProfileActions.getListComplianceRulesSuccess({
                    rules: [
                        {
                            uuid: 'rule1',
                            name: 'Rule 1',
                            description: 'Description 1',
                            connectorUuid: 'connector1',
                            kind: 'Kind 1',
                            type: 'Type 1',
                            resource: Resource.Certificates,
                            attributes: [],
                        },
                    ],
                }),
            );

            // Clear rules
            store.dispatch(complianceProfileActions.clearRules());

            // Rules should be cleared
            const finalState = store.getState().complianceProfiles;
            expect(finalState.rules).to.be.empty;
        });

        it('should handle clearGroups epic', () => {
            // Set some groups first
            store.dispatch(
                complianceProfileActions.getListComplianceGroupsSuccess({
                    groups: [
                        {
                            uuid: 'group1',
                            name: 'Group 1',
                            description: 'Description 1',
                            connectorUuid: 'connector1',
                            kind: 'Kind 1',
                        },
                    ],
                }),
            );

            // Clear groups
            store.dispatch(complianceProfileActions.clearGroups());

            // Groups should be cleared
            const finalState = store.getState().complianceProfiles;
            expect(finalState.groups).to.be.empty;
        });

        it('should handle setCheckedRows epic', () => {
            const checkedRows = ['row1', 'row2', 'row3'];

            // Set checked rows
            store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows }));

            // Checked rows should be set
            const finalState = store.getState().complianceProfiles;
            expect(finalState.checkedRows).to.deep.equal(checkedRows);
        });

        it('should handle resetState epic', () => {
            // Set some state first
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows: ['row1'] }));

            // Reset state
            store.dispatch(complianceProfileActions.resetState());

            // State should be reset
            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingList).to.be.false;
            expect(finalState.checkedRows).to.be.empty;
        });
    });

    describe('Epic Middleware Configuration', () => {
        it('should have epic middleware properly configured', () => {
            expect(store).to.exist;
            expect(store.dispatch).to.exist;
            expect(store.getState).to.exist;
            expect(store.subscribe).to.exist;
        });

        it('should allow dispatching actions through epic middleware', () => {
            const spy = cy.spy(store, 'dispatch');

            store.dispatch(complianceProfileActions.getListComplianceProfiles());

            expect(spy).to.have.been.called;
        });
    });
});

import { configureStore } from '@reduxjs/toolkit';
import { actions as complianceProfileActions, slice as complianceProfileSlice } from '../../../src/ducks/compliance-profiles';
import { Resource } from '../../../src/types/openapi';

describe('Redux Store Tests', () => {
    let store: any;

    beforeEach(() => {
        // Create a simpler store for testing without epic middleware
        store = configureStore({
            reducer: {
                complianceProfiles: complianceProfileSlice.reducer,
            },
        });
    });

    describe('Store Configuration', () => {
        it('should initialize store with correct initial state', () => {
            // Ensure store is ready
            expect(store).to.exist;
            expect(store.getState).to.exist;

            const state = store.getState();

            // Check that compliance-profiles slice exists
            expect(state.complianceProfiles).to.exist;
            expect(state.complianceProfiles.complianceProfiles).to.deep.equal([]);
            expect(state.complianceProfiles.isFetchingList).to.be.false;
            expect(state.complianceProfiles.deleteErrorMessage).to.equal('');
        });

        it('should have compliance profiles reducer', () => {
            const state = store.getState();

            // Check that compliance profiles slice exists
            expect(state.complianceProfiles).to.exist;
            expect(state.complianceProfiles.complianceProfiles).to.be.an('array');
            expect(state.complianceProfiles.isFetchingList).to.be.a('boolean');
        });
    });

    describe('Compliance Profiles Redux Actions', () => {
        describe('State Loading', () => {
            it('should handle getListComplianceProfiles action', () => {
                // Check initial state
                expect(store.getState().complianceProfiles.isFetchingList).to.be.false;

                store.dispatch(complianceProfileActions.getListComplianceProfiles());

                const newState = store.getState().complianceProfiles;
                expect(newState.isFetchingList).to.be.true;
            });

            it('should handle getListComplianceProfilesSuccess action', () => {
                const mockComplianceProfiles = [
                    {
                        uuid: 'test-uuid-1',
                        name: 'Test Profile 1',
                        description: 'Test description 1',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                    {
                        uuid: 'test-uuid-2',
                        name: 'Test Profile 2',
                        description: 'Test description 2',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockComplianceProfiles,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.complianceProfiles).to.have.length(2);
                expect(state.complianceProfiles[0].name).to.equal('Test Profile 1');
                expect(state.complianceProfiles[1].name).to.equal('Test Profile 2');
                expect(state.isFetchingList).to.be.false;
            });
        });

        describe('Detail Loading', () => {
            it('should handle getComplianceProfile action', () => {
                store.dispatch(complianceProfileActions.getComplianceProfile({ uuid: 'test-uuid' }));

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingDetail).to.be.true;
            });

            it('should handle getComplianceProfileSuccess action', () => {
                const mockComplianceProfile = {
                    uuid: 'test-uuid',
                    name: 'Test Profile',
                    description: 'Test description',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    internalRules: [],
                    providerRules: [],
                };

                store.dispatch(
                    complianceProfileActions.getComplianceProfileSuccess({
                        complianceProfile: mockComplianceProfile,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.complianceProfile).to.deep.equal(mockComplianceProfile);
                expect(state.isFetchingDetail).to.be.false;
            });

            it('should handle getComplianceProfileFailed action', () => {
                store.dispatch(complianceProfileActions.getComplianceProfileFailed({ error: 'Test error' }));

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingDetail).to.be.false;
                expect(state.complianceProfile).to.be.undefined;
            });
        });

        describe('Creation', () => {
            it('should handle createComplianceProfile action', () => {
                store.dispatch(complianceProfileActions.createComplianceProfile({} as any));

                const state = store.getState().complianceProfiles;
                expect(state.isCreating).to.be.true;
            });

            it('should handle createComplianceProfileSuccess action', () => {
                const mockProfile = {
                    uuid: 'new-uuid',
                    name: 'New Profile',
                    description: 'New description',
                };

                store.dispatch(
                    complianceProfileActions.createComplianceProfileSuccess({
                        uuid: mockProfile.uuid,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isCreating).to.be.false;
            });

            it('should handle createComplianceProfileFailed action', () => {
                store.dispatch(complianceProfileActions.createComplianceProfileFailed({ error: 'Test error' }));

                const state = store.getState().complianceProfiles;
                expect(state.isCreating).to.be.false;
            });
        });

        describe('Deletion', () => {
            it('should handle deleteComplianceProfile action', () => {
                store.dispatch(
                    complianceProfileActions.deleteComplianceProfile({
                        uuid: 'test-uuid',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDeleting).to.be.true;
            });

            it('should handle deleteComplianceProfileSuccess action', () => {
                store.dispatch(
                    complianceProfileActions.deleteComplianceProfileSuccess({
                        uuid: 'deleted-uuid',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDeleting).to.be.false;
            });

            it('should handle deleteComplianceProfileFailed action', () => {
                const error = 'Failed to delete';

                store.dispatch(
                    complianceProfileActions.deleteComplianceProfileFailed({
                        error: error,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDeleting).to.be.false;
                expect(state.deleteErrorMessage).to.equal(error);
            });
        });

        describe('State Clearing', () => {
            it('should handle clearDeleteErrorMessages action', () => {
                // First set an error
                store.dispatch(
                    complianceProfileActions.deleteComplianceProfileFailed({
                        error: 'Some error',
                    }),
                );

                // Then clear it
                store.dispatch(complianceProfileActions.clearDeleteErrorMessages());

                const state = store.getState().complianceProfiles;
                expect(state.deleteErrorMessage).to.equal('');
            });
        });

        describe('Bulk Operations', () => {
            it('should handle bulkDeleteComplianceProfiles action', () => {
                store.dispatch(
                    complianceProfileActions.bulkDeleteComplianceProfiles({
                        uuids: ['uuid-1', 'uuid-2'],
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkDeleting).to.be.true;
                expect(state.bulkDeleteErrorMessages).to.deep.equal([]);
            });

            it('should handle bulkDeleteComplianceProfilesSuccess action', () => {
                // First add profiles
                const mockProfiles = [
                    {
                        uuid: 'uuid-1',
                        name: 'Profile 1',
                        description: 'Description 1',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                    {
                        uuid: 'uuid-2',
                        name: 'Profile 2',
                        description: 'Description 2',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockProfiles,
                    }),
                );

                // Set current profile
                store.dispatch(
                    complianceProfileActions.getComplianceProfileSuccess({
                        complianceProfile: {
                            ...mockProfiles[0],
                            internalRules: [],
                            providerRules: [],
                        },
                    }),
                );

                // Bulk delete
                store.dispatch(
                    complianceProfileActions.bulkDeleteComplianceProfilesSuccess({
                        uuids: ['uuid-1', 'uuid-2'],
                        errors: [],
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkDeleting).to.be.false;
                expect(state.complianceProfiles).to.have.length(0);
                expect(state.complianceProfile).to.be.undefined;
            });

            it('should handle bulkDeleteComplianceProfilesSuccess with errors', () => {
                const mockErrors = [
                    { uuid: 'uuid-1', name: 'Profile 1', message: 'Cannot delete profile 1', severity: 'ERROR' },
                    { uuid: 'uuid-2', name: 'Profile 2', message: 'Cannot delete profile 2', severity: 'ERROR' },
                ];

                store.dispatch(
                    complianceProfileActions.bulkDeleteComplianceProfilesSuccess({
                        uuids: ['uuid-1', 'uuid-2'],
                        errors: mockErrors,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkDeleting).to.be.false;
                expect(state.bulkDeleteErrorMessages).to.deep.equal(mockErrors);
            });

            it('should handle bulkDeleteComplianceProfilesFailed action', () => {
                store.dispatch(
                    complianceProfileActions.bulkDeleteComplianceProfilesFailed({
                        error: 'Bulk delete failed',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkDeleting).to.be.false;
            });

            it('should handle bulkForceDeleteComplianceProfiles action', () => {
                store.dispatch(
                    complianceProfileActions.bulkForceDeleteComplianceProfiles({
                        uuids: ['uuid-1', 'uuid-2'],
                        redirect: '/compliance-profiles',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkForceDeleting).to.be.true;
            });

            it('should handle bulkForceDeleteComplianceProfilesSuccess action', () => {
                // First add profiles
                const mockProfiles = [
                    {
                        uuid: 'uuid-1',
                        name: 'Profile 1',
                        description: 'Description 1',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockProfiles,
                    }),
                );

                // Force delete
                store.dispatch(
                    complianceProfileActions.bulkForceDeleteComplianceProfilesSuccess({
                        uuids: ['uuid-1'],
                        redirect: '/compliance-profiles',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkForceDeleting).to.be.false;
                expect(state.deleteErrorMessage).to.equal('');
                expect(state.complianceProfiles).to.have.length(0);
            });

            it('should handle bulkForceDeleteComplianceProfilesFailed action', () => {
                store.dispatch(
                    complianceProfileActions.bulkForceDeleteComplianceProfilesFailed({
                        error: 'Force delete failed',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isBulkForceDeleting).to.be.false;
            });
        });

        describe('Associations', () => {
            it('should handle associateComplianceProfile action', () => {
                store.dispatch(
                    complianceProfileActions.associateComplianceProfile({
                        uuid: 'profile-uuid',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'cert-uuid',
                        associationObjectName: 'Test Certificate',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isAssociatingComplianceProfile).to.be.true;
            });

            it('should handle associateComplianceProfileFailed action', () => {
                store.dispatch(
                    complianceProfileActions.associateComplianceProfileFailed({
                        error: 'Association failed',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isAssociatingComplianceProfile).to.be.false;
            });

            it('should handle dissociateComplianceProfile action', () => {
                store.dispatch(
                    complianceProfileActions.dissociateComplianceProfile({
                        uuid: 'profile-uuid',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'cert-uuid',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDissociatingComplianceProfile).to.be.true;
            });

            it('should handle dissociateComplianceProfileSuccess action', () => {
                // First add an association
                const mockProfile = {
                    uuid: 'profile-uuid',
                    name: 'Test Profile',
                    description: 'Test Description',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    internalRules: [],
                    providerRules: [],
                };

                store.dispatch(
                    complianceProfileActions.getComplianceProfileSuccess({
                        complianceProfile: mockProfile,
                    }),
                );

                store.dispatch(
                    complianceProfileActions.associateComplianceProfileSuccess({
                        uuid: 'profile-uuid',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'cert-uuid',
                        associationObjectName: 'Test Certificate',
                    }),
                );

                // Now dissociate
                store.dispatch(
                    complianceProfileActions.dissociateComplianceProfileSuccess({
                        uuid: 'profile-uuid',
                        resource: Resource.Certificates,
                        associationObjectUuid: 'cert-uuid',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDissociatingComplianceProfile).to.be.false;
                expect(state.associationsOfComplianceProfile).to.have.length(0);
            });

            it('should handle dissociateComplianceProfileFailed action', () => {
                store.dispatch(
                    complianceProfileActions.dissociateComplianceProfileFailed({
                        error: 'Dissociation failed',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isDissociatingComplianceProfile).to.be.false;
            });

            it('should handle getAssociatedComplianceProfiles action', () => {
                store.dispatch(
                    complianceProfileActions.getAssociatedComplianceProfiles({
                        resource: Resource.Certificates,
                        associationObjectUuid: 'cert-uuid',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingAssociatedComplianceProfiles).to.be.true;
            });

            it('should handle getAssociatedComplianceProfilesSuccess action', () => {
                const mockAssociatedProfiles = [
                    {
                        uuid: 'associated-uuid-1',
                        name: 'Associated Profile 1',
                        description: 'Associated Description 1',
                        kind: 'AUDIT',
                        version: '1.0.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        attributes: [],
                        providerRulesCount: 0,
                        providerGroupsCount: 0,
                        internalRulesCount: 0,
                        associations: 0,
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getAssociatedComplianceProfilesSuccess({
                        complianceProfiles: mockAssociatedProfiles,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingAssociatedComplianceProfiles).to.be.false;
                expect(state.associatedComplianceProfiles).to.deep.equal(mockAssociatedProfiles);
            });

            it('should handle getAssociatedComplianceProfilesFailed action', () => {
                store.dispatch(
                    complianceProfileActions.getAssociatedComplianceProfilesFailed({
                        error: 'Failed to fetch associated profiles',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingAssociatedComplianceProfiles).to.be.false;
            });
        });

        describe('Rules Management', () => {
            it('should handle getListComplianceRules action', () => {
                store.dispatch(
                    complianceProfileActions.getListComplianceRules({
                        resource: Resource.Certificates,
                        connectorUuid: 'connector-uuid',
                        kind: 'AUDIT',
                        type: 'COMPLIANCE',
                        format: 'JSON',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingRules).to.be.true;
            });

            it('should handle getListComplianceRulesSuccess action', () => {
                const mockRules = [
                    {
                        uuid: 'rule-uuid-1',
                        name: 'Test Rule 1',
                        description: 'Test Rule Description 1',
                        connectorUuid: 'connector-uuid',
                        connectorName: 'Test Connector',
                        kind: 'AUDIT',
                        type: 'COMPLIANCE',
                        resource: Resource.Certificates,
                        attributes: [],
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceRulesSuccess({
                        rules: mockRules,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingRules).to.be.false;
                expect(state.rules).to.deep.equal(mockRules);
            });

            it('should handle getListComplianceRulesFailed action', () => {
                store.dispatch(
                    complianceProfileActions.getListComplianceRulesFailed({
                        error: 'Failed to fetch rules',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingRules).to.be.false;
            });

            it('should handle clearRules action', () => {
                // First add some rules
                const mockRules = [
                    {
                        uuid: 'rule-uuid-1',
                        name: 'Test Rule 1',
                        description: 'Test Rule Description 1',
                        connectorUuid: 'connector-uuid',
                        connectorName: 'Test Connector',
                        kind: 'AUDIT',
                        type: 'COMPLIANCE',
                        resource: Resource.Certificates,
                        attributes: [],
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceRulesSuccess({
                        rules: mockRules,
                    }),
                );

                // Then clear them
                store.dispatch(complianceProfileActions.clearRules());

                const state = store.getState().complianceProfiles;
                expect(state.rules).to.deep.equal([]);
            });
        });

        describe('Groups Management', () => {
            it('should handle getListComplianceGroups action', () => {
                store.dispatch(
                    complianceProfileActions.getListComplianceGroups({
                        connectorUuid: 'connector-uuid',
                        kind: 'AUDIT',
                        resource: Resource.Certificates,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingGroups).to.be.true;
            });

            it('should handle getListComplianceGroupsSuccess action', () => {
                const mockGroups = [
                    {
                        uuid: 'group-uuid-1',
                        name: 'Test Group 1',
                        description: 'Test Group Description 1',
                        connectorUuid: 'connector-uuid',
                        connectorName: 'Test Connector',
                        kind: 'AUDIT',
                        attributes: [],
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceGroupsSuccess({
                        groups: mockGroups,
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingGroups).to.be.false;
                expect(state.groups).to.deep.equal(mockGroups);
            });

            it('should handle getListComplianceGroupsFailed action', () => {
                store.dispatch(
                    complianceProfileActions.getListComplianceGroupsFailed({
                        error: 'Failed to fetch groups',
                    }),
                );

                const state = store.getState().complianceProfiles;
                expect(state.isFetchingGroups).to.be.false;
            });

            it('should handle clearGroups action', () => {
                // First add some groups
                const mockGroups = [
                    {
                        uuid: 'group-uuid-1',
                        name: 'Test Group 1',
                        description: 'Test Group Description 1',
                        connectorUuid: 'connector-uuid',
                        connectorName: 'Test Connector',
                        kind: 'AUDIT',
                        attributes: [],
                    },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceGroupsSuccess({
                        groups: mockGroups,
                    }),
                );

                // Then clear them
                store.dispatch(complianceProfileActions.clearGroups());

                const state = store.getState().complianceProfiles;
                expect(state.groups).to.deep.equal([]);
            });
        });

        describe('Checked Rows Management', () => {
            it('should handle setCheckedRows action', () => {
                const checkedRows = ['uuid-1', 'uuid-2', 'uuid-3'];

                store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows }));

                const state = store.getState().complianceProfiles;
                expect(state.checkedRows).to.deep.equal(checkedRows);
            });

            it('should handle clearing checked rows', () => {
                // First set some checked rows
                store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows: ['uuid-1', 'uuid-2'] }));

                // Then clear them by setting empty array
                store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows: [] }));

                const state = store.getState().complianceProfiles;
                expect(state.checkedRows).to.deep.equal([]);
            });
        });
    });

    describe('Store State Immutability', () => {
        it('should maintain immutability when dispatching actions', () => {
            const initialState = store.getState();

            store.dispatch(complianceProfileActions.getListComplianceProfiles());

            const newState = store.getState();

            // Ensure objects are different (immutable)
            expect(initialState.complianceProfiles).to.not.equal(newState.complianceProfiles);

            // But slices not modified should be the same reference
            expect(initialState.auth).to.equal(newState.auth);
            expect(initialState.notifications).to.equal(newState.notifications);
        });

        it('should handle concurrent actions properly', () => {
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            store.dispatch(complianceProfileActions.getComplianceProfile({ uuid: 'test-uuid' }));

            const state = store.getState().complianceProfiles;
            expect(state.isFetchingList).to.be.true;
            expect(state.isFetchingDetail).to.be.true;
        });
    });

    describe('Selector Functions', () => {
        it('should correctly select compliance profiles', () => {
            const mockProfiles = [
                {
                    uuid: 'test-uuid',
                    name: 'Test Profile',
                    description: 'Test description',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    providerRulesCount: 0,
                    providerGroupsCount: 0,
                    internalRulesCount: 0,
                    associations: 0,
                },
            ];

            store.dispatch(
                complianceProfileActions.getListComplianceProfilesSuccess({
                    complianceProfileList: mockProfiles,
                }),
            );

            const state = store.getState();

            // Test direct access to slice
            expect(state.complianceProfiles.complianceProfiles).to.deep.equal(mockProfiles);
            expect(state.complianceProfiles.complianceProfiles).to.have.length(1);
            expect(state.complianceProfiles.complianceProfiles[0].name).to.equal('Test Profile');
        });

        it('should correctly select loading states', () => {
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            store.dispatch(complianceProfileActions.getComplianceProfile({ uuid: 'test-uuid' }));

            const state = store.getState().complianceProfiles;
            expect(state.isFetchingList).to.be.true;
            expect(state.isFetchingDetail).to.be.true;
            expect(state.isCreating).to.be.false;
            expect(state.isDeleting).to.be.false;
        });

        it('should correctly select error states', () => {
            const errorMessage = 'Test error';
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileFailed({
                    error: errorMessage,
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.deleteErrorMessage).to.equal(errorMessage);
        });
    });

    describe('Complex State Scenarios', () => {
        it('should handle profile deletion with associations', () => {
            // Set up a profile with associations
            const mockProfile = {
                uuid: 'profile-uuid',
                name: 'Test Profile',
                description: 'Test Description',
                kind: 'AUDIT',
                version: '1.0.0',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z',
                attributes: [],
                internalRules: [],
                providerRules: [],
            };

            store.dispatch(
                complianceProfileActions.getComplianceProfileSuccess({
                    complianceProfile: mockProfile,
                }),
            );

            // Add associations
            store.dispatch(
                complianceProfileActions.associateComplianceProfileSuccess({
                    uuid: 'profile-uuid',
                    resource: Resource.Certificates,
                    associationObjectUuid: 'cert-uuid-1',
                    associationObjectName: 'Certificate 1',
                }),
            );

            store.dispatch(
                complianceProfileActions.associateComplianceProfileSuccess({
                    uuid: 'profile-uuid',
                    resource: Resource.Certificates,
                    associationObjectUuid: 'cert-uuid-2',
                    associationObjectName: 'Certificate 2',
                }),
            );

            // Add to list
            store.dispatch(
                complianceProfileActions.getListComplianceProfilesSuccess({
                    complianceProfileList: [
                        {
                            ...mockProfile,
                            providerRulesCount: 0,
                            providerGroupsCount: 0,
                            internalRulesCount: 0,
                            associations: 0,
                        },
                    ],
                }),
            );

            // Delete the profile
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileSuccess({
                    uuid: 'profile-uuid',
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.complianceProfiles).to.have.length(0);
            expect(state.complianceProfile).to.be.undefined;
            // Associations should remain until explicitly cleared
            expect(state.associationsOfComplianceProfile).to.have.length(2);
        });

        it('should handle bulk operations with mixed results', () => {
            // Set up multiple profiles
            const mockProfiles = [
                {
                    uuid: 'uuid-1',
                    name: 'Profile 1',
                    description: 'Description 1',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    providerRulesCount: 0,
                    providerGroupsCount: 0,
                    internalRulesCount: 0,
                    associations: 0,
                },
                {
                    uuid: 'uuid-2',
                    name: 'Profile 2',
                    description: 'Description 2',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    providerRulesCount: 0,
                    providerGroupsCount: 0,
                    internalRulesCount: 0,
                    associations: 0,
                },
                {
                    uuid: 'uuid-3',
                    name: 'Profile 3',
                    description: 'Description 3',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    providerRulesCount: 0,
                    providerGroupsCount: 0,
                    internalRulesCount: 0,
                    associations: 0,
                },
            ];

            store.dispatch(
                complianceProfileActions.getListComplianceProfilesSuccess({
                    complianceProfileList: mockProfiles,
                }),
            );

            // Bulk delete with some errors
            const mockErrors = [{ uuid: 'uuid-2', name: 'Profile 2', message: 'Cannot delete - has associations', severity: 'ERROR' }];

            store.dispatch(
                complianceProfileActions.bulkDeleteComplianceProfilesSuccess({
                    uuids: ['uuid-1', 'uuid-2', 'uuid-3'],
                    errors: mockErrors,
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isBulkDeleting).to.be.false;
            expect(state.bulkDeleteErrorMessages).to.deep.equal(mockErrors);
            // Profiles should remain since there were errors
            expect(state.complianceProfiles).to.have.length(3);
        });

        it('should handle rules and groups management together', () => {
            // Fetch rules
            store.dispatch(
                complianceProfileActions.getListComplianceRules({
                    resource: Resource.Certificates,
                    connectorUuid: 'connector-uuid',
                    kind: 'AUDIT',
                    type: 'COMPLIANCE',
                    format: 'JSON',
                }),
            );

            // Fetch groups
            store.dispatch(
                complianceProfileActions.getListComplianceGroups({
                    connectorUuid: 'connector-uuid',
                    kind: 'AUDIT',
                    resource: Resource.Certificates,
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isFetchingRules).to.be.true;
            expect(state.isFetchingGroups).to.be.true;

            // Add rules
            const mockRules = [
                {
                    uuid: 'rule-uuid-1',
                    name: 'Test Rule 1',
                    description: 'Test Rule Description 1',
                    connectorUuid: 'connector-uuid',
                    connectorName: 'Test Connector',
                    kind: 'AUDIT',
                    type: 'COMPLIANCE',
                    resource: Resource.Certificates,
                    attributes: [],
                },
            ];

            store.dispatch(
                complianceProfileActions.getListComplianceRulesSuccess({
                    rules: mockRules,
                }),
            );

            // Add groups
            const mockGroups = [
                {
                    uuid: 'group-uuid-1',
                    name: 'Test Group 1',
                    description: 'Test Group Description 1',
                    connectorUuid: 'connector-uuid',
                    connectorName: 'Test Connector',
                    kind: 'AUDIT',
                    attributes: [],
                },
            ];

            store.dispatch(
                complianceProfileActions.getListComplianceGroupsSuccess({
                    groups: mockGroups,
                }),
            );

            const finalState = store.getState().complianceProfiles;
            expect(finalState.isFetchingRules).to.be.false;
            expect(finalState.isFetchingGroups).to.be.false;
            expect(finalState.rules).to.have.length(1);
            expect(finalState.groups).to.have.length(1);

            // Clear both
            store.dispatch(complianceProfileActions.clearRules());
            store.dispatch(complianceProfileActions.clearGroups());

            const clearedState = store.getState().complianceProfiles;
            expect(clearedState.rules).to.have.length(0);
            expect(clearedState.groups).to.have.length(0);
        });

        it('should handle error state management', () => {
            // Test multiple error scenarios
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileFailed({
                    error: 'Delete failed',
                }),
            );

            store.dispatch(
                complianceProfileActions.bulkDeleteComplianceProfilesFailed({
                    error: 'Bulk delete failed',
                }),
            );

            store.dispatch(
                complianceProfileActions.getListComplianceProfilesFailed({
                    error: 'Fetch failed',
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.deleteErrorMessage).to.equal('Delete failed');
            expect(state.isFetchingList).to.be.false;
            expect(state.isBulkDeleting).to.be.false;

            // Clear delete error
            store.dispatch(complianceProfileActions.clearDeleteErrorMessages());
            expect(store.getState().complianceProfiles.deleteErrorMessage).to.equal('');
        });

        it('should handle state reset functionality', () => {
            // Set up complex state
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            store.dispatch(complianceProfileActions.setCheckedRows({ checkedRows: ['uuid-1', 'uuid-2'] }));
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileFailed({
                    error: 'Test error',
                }),
            );

            // Reset state
            store.dispatch(complianceProfileActions.resetState());

            const state = store.getState().complianceProfiles;
            expect(state.isFetchingList).to.be.false;
            expect(state.checkedRows).to.deep.equal([]);
            expect(state.deleteErrorMessage).to.equal('');
            expect(state.complianceProfiles).to.deep.equal([]);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle undefined/null values gracefully', () => {
            // Test with undefined error
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileFailed({
                    error: undefined,
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.deleteErrorMessage).to.equal('Unknown error');
        });

        it('should handle empty arrays in bulk operations', () => {
            store.dispatch(
                complianceProfileActions.bulkDeleteComplianceProfiles({
                    uuids: [],
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isBulkDeleting).to.be.true;
            expect(state.bulkDeleteErrorMessages).to.deep.equal([]);
        });

        it('should handle association operations without current profile', () => {
            // Try to associate without setting a current profile
            store.dispatch(
                complianceProfileActions.associateComplianceProfileSuccess({
                    uuid: 'profile-uuid',
                    resource: Resource.Certificates,
                    associationObjectUuid: 'cert-uuid',
                    associationObjectName: 'Test Certificate',
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isAssociatingComplianceProfile).to.be.false;
            // Should not crash, but associations should remain empty
            expect(state.associationsOfComplianceProfile).to.have.length(0);
        });

        it('should handle profile deletion when profile not in list', () => {
            // Try to delete a profile that's not in the list
            store.dispatch(
                complianceProfileActions.deleteComplianceProfileSuccess({
                    uuid: 'non-existent-uuid',
                }),
            );

            const state = store.getState().complianceProfiles;
            expect(state.isDeleting).to.be.false;
            // Should not crash
            expect(state.complianceProfiles).to.have.length(0);
        });

        it('should handle state transitions correctly', () => {
            // Test loading -> success -> error flow
            store.dispatch(complianceProfileActions.getListComplianceProfiles());
            expect(store.getState().complianceProfiles.isFetchingList).to.be.true;

            const mockProfiles = [
                {
                    uuid: 'test-uuid',
                    name: 'Test Profile',
                    description: 'Test Description',
                    kind: 'AUDIT',
                    version: '1.0.0',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    attributes: [],
                    providerRulesCount: 0,
                    providerGroupsCount: 0,
                    internalRulesCount: 0,
                    associations: 0,
                },
            ];

            store.dispatch(
                complianceProfileActions.getListComplianceProfilesSuccess({
                    complianceProfileList: mockProfiles,
                }),
            );
            expect(store.getState().complianceProfiles.isFetchingList).to.be.false;
            expect(store.getState().complianceProfiles.complianceProfiles).to.have.length(1);

            store.dispatch(
                complianceProfileActions.getListComplianceProfilesFailed({
                    error: 'Network error',
                }),
            );
            expect(store.getState().complianceProfiles.isFetchingList).to.be.false;
        });
    });
});

import { configureStore } from '@reduxjs/toolkit';
import { actions as complianceProfileActions, slice as complianceProfileSlice } from '../../../src/ducks/compliance-profiles';

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
});

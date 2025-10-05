import { configureStore } from '@reduxjs/toolkit';
import { actions as complianceProfileActions, slice as complianceProfileSlice } from '../../../src/ducks/compliance-profiles';

describe('Redux Selector Tests', () => {
    let store: any;

    beforeEach(() => {
        // Create a simpler store for testing without epic middleware
        store = configureStore({
            reducer: {
                complianceProfiles: complianceProfileSlice.reducer,
            },
        });
    });

    describe('Compliance Profile Selectors', () => {
        describe('Basic State Selection', () => {
            it('should select compliance profiles list', () => {
                const state = store.getState();

                expect(state.complianceProfiles.complianceProfiles).to.deep.equal([]);
                expect(state.complianceProfiles.complianceProfiles).to.have.length(0);
            });

            it('should select compliance profile detail', () => {
                const state = store.getState();

                expect(state.complianceProfiles.complianceProfile).to.be.undefined;
            });

            it('should select error states', () => {
                const state = store.getState();

                expect(state.complianceProfiles.deleteErrorMessage).to.equal('');
                expect(state.complianceProfiles.bulkDeleteErrorMessages).to.deep.equal([]);
            });
        });

        describe('Computed State Selection', () => {
            it('should select profiles by name', () => {
                const mockProfiles = [
                    {
                        uuid: 'uuid-1',
                        name: 'Profile Alpha',
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
                        name: 'Profile Beta',
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

                const state = store.getState().complianceProfiles;
                const alphaProfiles = state.complianceProfiles.filter((profile: any) => profile.name.includes('Alpha'));

                expect(alphaProfiles).to.have.length(1);
                expect(alphaProfiles[0].name).to.equal('Profile Alpha');
            });

            it('should select sorted compliance profiles', () => {
                const mockProfiles = [
                    { ...getMockProfileBase(), uuid: 'uuid-1', name: 'Charlie Profile' },
                    { ...getMockProfileBase(), uuid: 'uuid-2', name: 'Alpha Profile' },
                    { ...getMockProfileBase(), uuid: 'uuid-3', name: 'Beta Profile' },
                    { ...getMockProfileBase(), uuid: 'uuid-4', name: 'Delta Profile' },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockProfiles,
                    }),
                );

                const state = store.getState().complianceProfiles;
                const sortedProfiles = [...state.complianceProfiles].sort((a: any, b: any) => a.name.localeCompare(b.name));

                expect(sortedProfiles.map((p: any) => p.name)).to.deep.equal([
                    'Alpha Profile',
                    'Beta Profile',
                    'Charlie Profile',
                    'Delta Profile',
                ]);
            });
        });

        describe('Complex State Computations', () => {
            it('should calculate compliance profile statistics', () => {
                const mockProfiles = [
                    { ...getMockProfileBase(), uuid: 'uuid-1', name: 'Profile 1' },
                    { ...getMockProfileBase(), uuid: 'uuid-2', name: 'Profile 2' },
                    { ...getMockProfileBase(), uuid: 'uuid-3', name: 'Profile 3' },
                    { ...getMockProfileBase(), uuid: 'uuid-4', name: 'Profile 4' },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockProfiles,
                    }),
                );

                const state = store.getState().complianceProfiles;
                const stats = {
                    total: state.complianceProfiles.length,
                    auditProfiles: state.complianceProfiles.filter((p: any) => p.kind === 'AUDIT').length,
                    otherProfiles: state.complianceProfiles.filter((p: any) => p.kind !== 'AUDIT').length,
                };

                expect(stats.total).to.equal(4);
                expect(stats.auditProfiles).to.equal(4);
                expect(stats.otherProfiles).to.equal(0);
            });

            it('should filter compliance profiles by multiple criteria', () => {
                const mockProfiles = [
                    { ...getMockProfileBase(), uuid: 'uuid-1', name: 'Test Profile 1', kind: 'AUDIT' },
                    { ...getMockProfileBase(), uuid: 'uuid-2', name: 'Test Profile 2', kind: 'AUDIT' },
                    { ...getMockProfileBase(), uuid: 'uuid-3', name: 'Other Profile', kind: 'OTHER' },
                    { ...getMockProfileBase(), uuid: 'uuid-4', name: 'Test Profile 3', kind: 'AUDIT' },
                ];

                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesSuccess({
                        complianceProfileList: mockProfiles,
                    }),
                );

                const state = store.getState().complianceProfiles;
                const filteredProfiles = state.complianceProfiles.filter(
                    (profile: any) => profile.name.includes('Test') && profile.kind === 'AUDIT',
                );

                expect(filteredProfiles).to.have.length(3);
                expect(filteredProfiles.map((p: any) => p.name)).to.deep.equal(['Test Profile 1', 'Test Profile 2', 'Test Profile 3']);
            });
        });

        describe('Edge Cases in Selectors', () => {
            it('should handle empty arrays gracefully', () => {
                const state = store.getState();

                expect(state.complianceProfiles.complianceProfiles).to.deep.equal([]);
                expect(state.complianceProfiles.complianceProfiles.length).to.equal(0);

                const filtered = state.complianceProfiles.complianceProfiles.filter((p: any) => p.name);
                expect(filtered).to.deep.equal([]);
            });

            it('should handle undefined values gracefully', () => {
                const state = store.getState();

                expect(state.complianceProfiles.complianceProfile).to.be.undefined;
                expect(state.complianceProfiles.deleteErrorMessage).to.equal('');
                expect(state.complianceProfiles.bulkDeleteErrorMessages).to.deep.equal([]);
            });
        });
    });
});

// Helper function for creating mock profile base
function getMockProfileBase() {
    return {
        uuid: '',
        name: '',
        description: '',
        kind: 'AUDIT',
        version: '1.0.0',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        attributes: [],
        providerRulesCount: 0,
        providerGroupsCount: 0,
        internalRulesCount: 0,
        associations: 0,
    };
}

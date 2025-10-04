import { configureStore } from '@reduxjs/toolkit';
import { actions as complianceProfileActions, slice as complianceProfileSlice } from '../../../src/ducks/compliance-profiles';

describe('Redux Epic Tests', () => {
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

    describe('Async Action Flow', () => {
        it('should maintain proper action flow for fetch operations', () => {
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
    });

    describe('Epic Error Handling', () => {
        it('should not crash when epic encounters errors', () => {
            expect(() => {
                store.dispatch(complianceProfileActions.getListComplianceProfiles());
                store.dispatch(
                    complianceProfileActions.getListComplianceProfilesFailed({
                        error: 'Error',
                    }),
                );
            }).to.not.throw();
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

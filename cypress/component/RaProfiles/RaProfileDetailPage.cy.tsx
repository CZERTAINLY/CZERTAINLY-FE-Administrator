import RaProfileDetail from 'components/_pages/ra-profiles/detail';
import { mockAssociatedComplianceProfiles, mockComplianceProfiles, mockRaProfile } from './mockdata';
import { Route, Routes } from 'react-router';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { actions as raProfilesActions } from 'ducks/ra-profiles';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { actions as complianceProfileActions } from 'ducks/compliance-profiles';
import { ComplianceProfileListDto } from 'types/complianceProfiles';
import { actions as enumActions } from 'ducks/enums';
import { actions as settingsActions } from 'ducks/settings';
import { mockPlatformEnums } from '../ComplianceProfile/mock-data';
import '../../../src/resources/styles/theme.scss';

const RaProfileDetailPageTest = () => {
    return (
        <Routes>
            <Route path="/raprofiles/detail/:authorityId/:id" element={<RaProfileDetail />} />
        </Routes>
    );
};

describe('RaProfileDetailPage', () => {
    beforeEach(() => {
        cy.mount(<RaProfileDetailPageTest />, {}, `/raprofiles/detail/unknown/${mockRaProfile.uuid}`).wait(componentLoadWait);
        cy.dispatchActions(
            raProfilesActions.getRaProfileDetailSuccess({
                raProfile: mockRaProfile as unknown as RaProfileResponseModel,
            }),
            complianceProfileActions.getAssociatedComplianceProfilesSuccess({
                complianceProfiles: mockAssociatedComplianceProfiles as unknown as ComplianceProfileListDto[],
            }),
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            settingsActions.getPlatformSettingsSuccess({
                certificates: {
                    validation: {
                        enabled: true,
                        expiringThreshold: 30,
                        frequency: 7,
                    },
                },
            }),
            complianceProfileActions.getListComplianceProfilesSuccess({
                complianceProfileList: mockComplianceProfiles as unknown as ComplianceProfileListDto[],
            }),
        );
        cy.window().then((win) => {
            win.registerReduxActionListener(
                (action) => action.type === complianceProfileActions.getListComplianceProfiles.type,
                () => {
                    win.store.dispatch(
                        complianceProfileActions.getListComplianceProfilesSuccess({
                            complianceProfileList: mockComplianceProfiles as unknown as ComplianceProfileListDto[],
                        }),
                    );
                },
            );
            win.registerReduxActionListener(
                (action) => action.type === raProfilesActions.getRaProfileDetailSuccess.type,
                () => {
                    // Automatically dispatch success action when ra profile detail request is made
                    win.store.dispatch(
                        raProfilesActions.getRaProfileDetailSuccess({
                            raProfile: mockRaProfile as unknown as RaProfileResponseModel,
                        }),
                    );
                },
            );
            win.registerReduxActionListener(
                (action) => action.type === enumActions.getPlatformEnumsSuccess.type,
                () => {
                    // Automatically dispatch success action when platform enums request is made
                    win.store.dispatch(enumActions.getPlatformEnumsSuccess({ ...mockPlatformEnums }));
                },
            );
            win.registerReduxActionListener(
                (action) => action.type === raProfilesActions.getRaProfileDetail.type,
                () => {
                    // Automatically dispatch success action when ra profile detail request is made
                    win.store.dispatch(
                        raProfilesActions.getRaProfileDetailSuccess({
                            raProfile: mockRaProfile as unknown as RaProfileResponseModel,
                        }),
                    );
                },
            );
            win.registerReduxActionListener(
                (action) => action.type === complianceProfileActions.getAssociatedComplianceProfiles.type,
                () => {
                    // Automatically dispatch success action when associated compliance profiles request is made
                    win.store.dispatch(
                        complianceProfileActions.getAssociatedComplianceProfilesSuccess({
                            complianceProfiles: mockAssociatedComplianceProfiles as unknown as ComplianceProfileListDto[],
                        }),
                    );
                },
            );
        });
    });

    it('should render compliance profile widget', () => {
        cy.get('[data-testid="compliance-profile-widget"]').should('exist');
    });

    it('widget should have associate compliance profile button', () => {
        cy.get('[data-testid="compliance-profile-widget"]').should('exist');
        cy.get('[data-testid="associate-compliance-profile-button"]').should('exist');
    });

    describe('Associate Compliance Profile Dialog', () => {
        beforeEach(() => {
            cy.window().then((win) => {
                win.registerReduxActionListener(
                    (action) => action.type === complianceProfileActions.getListComplianceProfiles.type,
                    () => {
                        win.store.dispatch(
                            complianceProfileActions.getListComplianceProfilesSuccess({
                                complianceProfileList: mockComplianceProfiles as unknown as ComplianceProfileListDto[],
                            }),
                        );
                    },
                );
            });
        });

        it('when press associate-compliance-profile-button, should open associate compliance profile dialog', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('exist');
        });

        it('user sshould be able to select a compliance profile and associate it', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);

            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('exist');
            cy.get('[data-testid="associate-compliance-profile-select-control"]').should('exist');
            cy.get('[data-testid="associate-compliance-profile-select-control"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-select-menu"]').contains('test').click().wait(clickWait);
            cy.get('button').contains('Associate').should('be.enabled');
            cy.get('button').contains('Associate').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('not.exist');
        });

        it('user should be able to cancel the dialog', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('exist');
            cy.get('button').contains('Cancel').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('not.exist');
        });

        it('associate button should be disabled if compliance profile is not selected', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-dialog"]').should('exist');
            cy.get('button').contains('Associate').should('be.disabled');
        });

        it('Compliance profile Select control should have data test id', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-select-control"]').should('exist');
        });
        it('Compliance profile Select menu should have data test id', () => {
            cy.get('[data-testid="associate-compliance-profile-button"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-select-control"]').click().wait(clickWait);
            cy.get('[data-testid="associate-compliance-profile-select-menu"]').should('exist');
        });
    });
});

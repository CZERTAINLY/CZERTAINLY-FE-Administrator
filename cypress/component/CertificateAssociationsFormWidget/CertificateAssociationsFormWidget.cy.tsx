import CertificateAssociationsFormWidget from 'components/CertificateAssociationsFormWidget/CertificateAssociationsFormWidget';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import '../../../src/resources/styles/theme.scss';
import { mockData } from './mock-data';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { cySelectors } from '../../utils/selectors';

// Mock Redux store
const mockStore = createStore(() => ({
    users: {
        users: mockData.users,
    },
    certificateGroups: {
        certificateGroups: mockData.groups,
    },
    userInterface: {
        widgetLocks: [],
        globalModal: {
            title: undefined,
            size: 'sm',
            content: undefined,
            isOpen: false,
            showCancelButton: false,
            showOkButton: false,
            showCloseButton: false,
            showSubmitButton: false,
            okButtonCallback: undefined,
            cancelButtonCallback: undefined,
        },
    },
}));

interface Props {
    onSubmit: (...args: any) => void;
    initialValues?: {
        owner?: { value: string; label: string };
        groups?: { value: string; label: string }[];
    };
}

const TestCertificateAssociationsFormWidget = ({ onSubmit, initialValues }: Props) => {
    const userOptions: { value: string; label: string }[] = [];
    const groupOptions: { value: string; label: string }[] = [];

    const setUserOptions = (options: { value: string; label: string }[]) => {
        userOptions.length = 0;
        userOptions.push(...options);
    };

    const setGroupOptions = (options: { value: string; label: string }[]) => {
        groupOptions.length = 0;
        groupOptions.push(...options);
    };

    return (
        <Provider store={mockStore}>
            <Form onSubmit={onSubmit} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <CertificateAssociationsFormWidget
                            userOptions={userOptions}
                            groupOptions={groupOptions}
                            setUserOptions={setUserOptions}
                            setGroupOptions={setGroupOptions}
                            renderCustomAttributes={<div data-testid="custom-attributes">Custom Attributes Content</div>}
                        />
                        <button id="submit-button" type="submit">
                            Submit
                        </button>
                    </form>
                )}
            </Form>
        </Provider>
    );
};

describe('CertificateAssociationsFormWidget', () => {
    const { invocationInterceptor, invocationListener } = createInvocationInterceptor('formSubmission', (formData) => formData);

    function testSubmission(testFunction: (formData: any) => void) {
        cy.get('#submit-button').click().wait(clickWait);
        invocationListener((args) => testFunction(args));
    }

    beforeEach(() => {
        cy.mount(<TestCertificateAssociationsFormWidget onSubmit={invocationInterceptor} />).wait(componentLoadWait);
    });

    describe('Component Rendering', () => {
        it('should render the widget with correct title', () => {
            cy.get('h5').should('contain', 'Default Certificate associations');
        });

        it('should render owner field with correct label', () => {
            cy.get('label[for="owner"]').should('contain', 'Owner');
        });

        it('should render groups field with correct label', () => {
            cy.get('label[for="groups"]').should('contain', 'Groups');
        });

        it('should render custom attributes section', () => {
            cy.get('[data-testid="custom-attributes"]').should('contain', 'Custom Attributes Content');
        });

        it('should render owner select with placeholder', () => {
            cySelectors.selectInput('react-select-owner-input').placeholder().should('contain', 'Select Owner');
        });

        it('should render groups select with placeholder', () => {
            cySelectors.selectInput('react-select-groups-input').placeholder().should('contain', 'Select Groups');
        });
    });

    describe('Owner Field Functionality', () => {
        it('should allow selecting a single owner', () => {
            cy.get('[data-testid="certificate-associations-owner-control"]').click();
            cy.get('[data-testid="certificate-associations-owner-menu"]').contains('John Doe').click().wait(clickWait);
        });

        it('should allow clearing owner selection', () => {
            cy.get('[data-testid="certificate-associations-owner-control"]').click();
            cy.get('[data-testid="certificate-associations-owner-menu"]').contains('John Doe').click().wait(clickWait);

            // Clear selection
            cy.get('[data-testid="certificate-associations-owner-clear-button"]').first().click().wait(clickWait);
            cy.get('[data-testid="certificate-associations-owner-control"]').should('not.contain', 'John Doe');
        });

        it('should display all available user options', () => {
            cySelectors.selectInput('react-select-owner-input').control().click().wait(clickWait);
            cy.get('[class*="option"]').should('have.length', 3);
            cy.get('[class*="option"]').first().should('contain', 'John Doe');
            cy.get('[class*="option"]').eq(1).should('contain', 'Jane Smith');
            cy.get('[class*="option"]').eq(2).should('contain', 'Bob Johnson');
        });

        it('should submit form with selected owner', () => {
            cy.get('[data-testid="certificate-associations-owner-control"]').click();
            cy.get('[data-testid="certificate-associations-owner-menu"]').contains('John Doe').click().wait(clickWait);
            testSubmission((formData) => {
                expect(formData.owner).to.deep.equal({ value: 'user-1', label: 'John Doe  (john.doe)' });
            });
        });
    });

    describe('Groups Field Functionality', () => {
        it('should allow selecting multiple groups', () => {
            cySelectors.selectInput('react-select-groups-input', 'multi').all(({ selectOption }) => {
                selectOption('3key-info').click().wait(clickWait);
                selectOption('ABCDEF').click().wait(clickWait);
            });

            cySelectors.selectInput('react-select-groups-input', 'multi').values('3key-info').value().should('contain', '3key-info');
            cySelectors.selectInput('react-select-groups-input', 'multi').values('ABCDEF').value().should('contain', 'ABCDEF');
        });

        it('should allow removing selected groups', () => {
            cySelectors.selectInput('react-select-groups-input', 'multi').all(({ selectOption }) => {
                selectOption('3key-info').click().wait(clickWait);
                selectOption('ABCDEF').click().wait(clickWait);
            });

            // Remove 3key-info
            cySelectors.selectInput('react-select-groups-input', 'multi').values('3key-info').delete().click().wait(clickWait);
            cy.get('[data-testid="certificate-associations-group-control"]').should('not.contain', '3key-info');
        });

        it('should display all available group options', () => {
            cySelectors.selectInput('react-select-groups-input', 'multi').control().click().wait(clickWait);
            cy.get('[class*="option"]').should('have.length', 2);
            cy.get('[class*="option"]').first().should('contain', '3key-info');
            cy.get('[class*="option"]').eq(1).should('contain', 'ABCDEF');
        });

        it('should submit form with selected groups', () => {
            cySelectors.selectInput('react-select-groups-input', 'multi').all(({ selectOption }) => {
                selectOption('3key-info').click().wait(clickWait);
                selectOption('ABCDEF').click().wait(clickWait);
            });

            testSubmission((formData) => {
                expect(formData.groups).to.deep.include.members([
                    { value: '03af02ef-cdac-4943-b8d6-8e55d3466fe8', label: '3key-info' },
                    { value: '1fa64e9a-1a34-4e87-a7dc-4ed55e3021a5', label: 'ABCDEF' },
                ]);
                expect(formData.groups).to.have.length(2);
            });
        });

        it('should allow selecting all groups', () => {
            cySelectors.selectInput('react-select-groups-input', 'multi').all(({ selectOption }) => {
                selectOption('3key-info').click().wait(clickWait);
                selectOption('ABCDEF').click().wait(clickWait);
            });

            testSubmission((formData) => {
                expect(formData.groups).to.have.length(2);
                expect(formData.groups).to.deep.include.members([
                    { value: '03af02ef-cdac-4943-b8d6-8e55d3466fe8', label: '3key-info' },
                    { value: '1fa64e9a-1a34-4e87-a7dc-4ed55e3021a5', label: 'ABCDEF' },
                ]);
            });
        });
    });
    describe('Form Integration', () => {
        it('should submit form with both owner and groups selected', () => {
            cy.get('[data-testid="certificate-associations-owner-control"]').click();
            cy.get('[data-testid="certificate-associations-owner-menu"]').contains('John Doe').click().wait(clickWait);
            cySelectors.selectInput('react-select-groups-input', 'multi').all(({ selectOption }) => {
                selectOption('3key-info').click().wait(clickWait);
                selectOption('ABCDEF').click().wait(clickWait);
            });

            testSubmission((formData) => {
                expect(formData.owner).to.deep.equal({ value: 'user-1', label: 'John Doe  (john.doe)' });
                expect(formData.groups).to.have.length(2);
                expect(formData.groups).to.deep.include.members([
                    { value: '03af02ef-cdac-4943-b8d6-8e55d3466fe8', label: '3key-info' },
                    { value: '1fa64e9a-1a34-4e87-a7dc-4ed55e3021a5', label: 'ABCDEF' },
                ]);
            });
        });

        it('should submit form with empty selections', () => {
            testSubmission((formData) => {
                expect(formData.owner).to.be.undefined;
                expect(formData.groups).to.be.undefined;
            });
        });

        it('should handle initial values correctly', () => {
            const initialValues = {
                owner: { value: 'user-1', label: 'John Doe' },
                groups: [
                    { value: '03af02ef-cdac-4943-b8d6-8e55d3466fe8', label: '3key-info' },
                    { value: '1fa64e9a-1a34-4e87-a7dc-4ed55e3021a5', label: 'ABCDEF' },
                ],
            };

            cy.mount(<TestCertificateAssociationsFormWidget onSubmit={invocationInterceptor} initialValues={initialValues} />).wait(
                componentLoadWait,
            );

            cySelectors.selectInput('react-select-owner-input').value().should('contain', 'John Doe');
            cySelectors.selectInput('react-select-groups-input', 'multi').values('3key-info').value().should('contain', '3key-info');
            cySelectors.selectInput('react-select-groups-input', 'multi').values('ABCDEF').value().should('contain', 'ABCDEF');
        });
    });
});

// Helper function to create invocation interceptor
function createInvocationInterceptor(eventName: string, callback: (data: any) => any) {
    let listener: ((data: any) => void) | null = null;

    const interceptor = (data: any) => {
        const result = callback(data);
        if (listener) {
            listener(result);
        }
    };

    const invocationListener = (fn: (data: any) => void) => {
        listener = fn;
    };

    return { invocationInterceptor: interceptor, invocationListener };
}

import { clickWait } from './constants';

type ElementSelector = () => Cypress.Chainable<JQuery<any>>;

type SelectorMap = Record<string, ElementSelector | ((...args: any) => any)>;

type WithAll<T extends SelectorMap> = T & {
    all: (fn: (selectors: Omit<T, 'all'>) => void) => Cypress.cy;
};
type SelectInputType = 'single' | 'multi';

type AttributeSelectInputSelectors<T extends SelectInputType> = {
    description: ElementSelector;
    input: ElementSelector;
    label: ElementSelector;
    control: ElementSelector;
    options: ElementSelector;
    placeholder: ElementSelector;
    addNew: ElementSelector;
    invalidFeedback: ElementSelector;
    selectOption: (option: number | string) => Cypress.Chainable<JQuery<HTMLElement>>;
} & (T extends 'single'
    ? { value: ElementSelector }
    : {
          values: (option: number | string) => {
              delete: ElementSelector;
              value: ElementSelector;
          };
      });

type SelectInputSelectors<T extends SelectInputType> = {
    input: ElementSelector;
    control: ElementSelector;
    options: ElementSelector;
    placeholder: ElementSelector;
    groupButton: (action: string) => Cypress.Chainable<JQuery<HTMLElement>>;
    selectOption: (option: number | string) => Cypress.Chainable<JQuery<HTMLElement>>;
} & (T extends 'single'
    ? { value: ElementSelector }
    : {
          values: (option: number | string) => {
              delete: ElementSelector;
              value: ElementSelector;
          };
      });
interface ElementSelectors {
    attributeInput(
        inputId: string,
        visibility?: 'visible' | 'hidden',
    ): WithAll<{
        description: ElementSelector;
        input: ElementSelector;
        label: ElementSelector;
        textarea: ElementSelector;
        groupLabel: ElementSelector;
        invalidFeedback: ElementSelector;
    }>;
    attributeFileInput(inputId: string): WithAll<{
        input: ElementSelector;
        mimeInput: ElementSelector;
        fileNameInput: ElementSelector;
        label: ElementSelector;
        selectFile: (fixturePath: string) => Cypress.Chainable<JQuery<HTMLElement>>;
        dragAndDropFile: (fixturePath: string) => Cypress.Chainable<JQuery<HTMLElement>>;
    }>;
    attributeInfoCard(attrId: string): WithAll<{
        groupLabel: ElementSelector;
        header: ElementSelector;
        body: ElementSelector;
    }>;
    attributeSelectInput<T extends SelectInputType = 'single'>(inputId: string, type?: T): WithAll<AttributeSelectInputSelectors<T>>;
    input(inputId: string): WithAll<{
        input: ElementSelector;
        textarea: ElementSelector;
        groupButton: (action: string) => Cypress.Chainable<JQuery<HTMLElement>>;
    }>;
    selectInput<T extends SelectInputType = 'single'>(inputId: string, type?: T): WithAll<SelectInputSelectors<T>>;
    customAttributeWidget(resourceUuid: string): WithAll<{
        headers: (index?: number) => Cypress.Chainable<JQuery<HTMLElement>>;
        rows: <T extends number | string | undefined = undefined>(
            indexOrName?: T,
        ) => T extends undefined
            ? Cypress.Chainable<JQuery<HTMLElement>>
            : {
                  name: ElementSelector;
                  contentType: ElementSelector;
                  content: ElementSelector;
                  input: () => {
                      input: ElementSelector;
                  };
                  actions: (type?: 'copy' | 'edit' | 'delete' | 'cancel' | 'save' | 'source') => Cypress.Chainable<JQuery<HTMLElement>>;
              };
    }>;
}

function createAllWrapper<T extends SelectorMap>(selectors: T): WithAll<T> {
    return {
        ...selectors,
        all: (fn: (selectors: Omit<T, 'all'>) => void) => {
            const { all: _, ...rest } = selectors;
            fn(rest);
            return cy;
        },
    };
}

const commonSelectors = {
    amendCommonSelectInputSelectors: (selectors: SelectorMap, root: ElementSelector, type?: 'multi' | 'single') => {
        const a = {
            selectOption: (option: number | string) => {
                selectors.control().click().wait(clickWait);
                if (typeof option === 'string') {
                    return selectors.options().findExactText(option);
                }
                return selectors.options().eq(option);
            },
        };
        if (type === 'single' || type === undefined) {
            Object.assign(selectors, {
                value: () => root().find('[class*="singleValue"]'),
            });
        } else {
            Object.assign(selectors, {
                values: (option: number | string) => {
                    const multiValues = root().find('[class*="multiValue"]');
                    const target = typeof option === 'string' ? multiValues.findExactText(option) : multiValues.eq(option);
                    return {
                        value: () => target.find('[class*="MultiValueGeneric"]'),
                        delete: () => target.find('[class*="MultiValueRemove"]'),
                    };
                },
            });
        }
    },
};

export const cySelectors: ElementSelectors = {
    attributeInput: (inputId, visibility) => {
        const root = () => {
            if (visibility == 'hidden') {
                return cy.get(`input[id="${inputId}"]`).parents('div').first();
            } else {
                return cy.get(`label[for="${inputId}"]`).parents('div').first();
            }
        };

        const selectors: ReturnType<ElementSelectors['attributeInput']> = createAllWrapper({
            groupLabel: () => root().parents('section').first().find('h5'),
            label: () => cy.get(`label[for="${inputId}"]`),
            input: () => cy.get(`input[id="${inputId}"]`),
            textarea: () => cy.get(`textarea[id="${inputId}"]`),
            description: () => root().find('small'),
            invalidFeedback: () => root().find('.invalid-feedback'),
        });

        return selectors;
    },
    attributeFileInput: (inputId) => {
        const selectors: ReturnType<ElementSelectors['attributeFileInput']> = createAllWrapper({
            label: () => cy.get(`label[for="${inputId}-content"]`),
            input: () => cy.get(`input[id="${inputId}-content"]`),
            mimeInput: () => cy.get(`input[id="${inputId}-mimeType"]`),
            fileNameInput: () => cy.get(`input[id="${inputId}-fileName"]`),
            selectFile: (fixturePath: string) =>
                cy.get(`input[id="${inputId}"]`).selectFile(`cypress/fixtures/${fixturePath}`, { force: true }),
            dragAndDropFile: (fixturePath: string) =>
                cy.fixture(fixturePath).then((content) => {
                    const blob = Cypress.Blob.arrayBufferToBlob(content);
                    const testFile = new File([blob], fixturePath);
                    const dataTransfer = new DataTransfer();

                    dataTransfer.items.add(testFile);

                    cy.get(`div[id="${inputId}-dragAndDrop"]`)
                        .trigger('dragover', {
                            dataTransfer,
                        })
                        .trigger('drop', {
                            dataTransfer,
                        });
                }),
        });

        return selectors;
    },
    attributeInfoCard: (attrId) => {
        const root = () => cy.get(`[id="${attrId}Info"]`);

        const selectors: ReturnType<ElementSelectors['attributeInfoCard']> = createAllWrapper({
            groupLabel: () => root().parents('section').first().find('h5'),
            header: () => root().find('.card-header'),
            body: () => root().find('.card-body'),
        });

        return selectors;
    },
    attributeSelectInput: <T extends SelectInputType>(inputId: string, type = 'single') => {
        const label = () => cy.get(`label[for="${inputId}Select"]`);
        const root = () => label().parents('div').first();

        const selectors = {
            label,
            input: () => root().find(`input[id="${inputId}Select"]`),
            description: () => root().find('small'),
            control: () => root().find('[class*="control"]'),
            options: () => root().find('[class*="option"]'),
            placeholder: () => root().find('[class*="placeholder"]'),
            addNew: () => root().find('.fa-add'),
            invalidFeedback: () => root().find('.invalid-feedback'),
        };

        commonSelectors.amendCommonSelectInputSelectors(selectors, root, type as T);

        return createAllWrapper(selectors as unknown as AttributeSelectInputSelectors<T>);
    },
    input: (inputId) => {
        const root = () => cy.get(`input[id="${inputId}"]`).parents('div').first();

        const selectors: ReturnType<ElementSelectors['input']> = createAllWrapper({
            input: () => cy.get(`input[id="${inputId}"]`),
            textarea: () => cy.get(`textarea[id="${inputId}"]`),
            groupButton: (action: string) => root().find(`[data-cy="${action}-button"]`),
        });

        return selectors;
    },
    selectInput: <T extends SelectInputType>(inputId: string, type = 'single') => {
        const input = () => cy.get(`input[id="${inputId}"]`);
        const root = () => input().parents('div[class*="container"]').first();

        const selectors = {
            input,
            value: () => root().find('[class*="singleValue"]'),
            control: () => root().find('[class*="control"]'),
            options: () => cy.get('[class*="option"]'),
            placeholder: () => root().find('[class*="placeholder"]'),
            groupButton: (action: string) => root().parents('div[class*="input-group"]').first().find(`[data-cy="${action}-button"]`),
        };

        commonSelectors.amendCommonSelectInputSelectors(selectors, root, type as T);

        return createAllWrapper(selectors as unknown as SelectInputSelectors<T>);
    },
    customAttributeWidget: (resourceUuid) => {
        const root = () => cy.get(`section[id*="${resourceUuid}-customAttributeWidget"]`);

        const selectors: ReturnType<ElementSelectors['customAttributeWidget']> = createAllWrapper({
            headers: (index) => {
                if (index === undefined) {
                    return root().find('th') as any;
                }
                return root().find('th').eq(index);
            },
            rows: (indexOrName) => {
                if (indexOrName === undefined) {
                    return root().find('tbody').find('tr') as any;
                }

                const row = () => {
                    if (typeof indexOrName === 'number') return root().find('tbody').find('tr').eq(indexOrName);
                    return root().find('td').findExactText(indexOrName).parent('tr').first();
                };
                return {
                    name: () => row().find('td').eq(0),
                    contentType: () => row().find('td').eq(1),
                    content: () => row().find('td').eq(2),
                    input: () => ({
                        input: () => row().find(`input`),
                    }),
                    actions: (type) => {
                        if (type === undefined) {
                            return row().find('td').eq(3);
                        }
                        return row().find(`[data-cy*=${type}-button]`);
                    },
                };
            },
        });

        return selectors;
    },
};

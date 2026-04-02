import { expect, vi } from 'vitest';
import { clickByTestId, clickByText, clickByTitle } from './domActions';

interface UpdateActionSelectors {
    ownerTitle: string;
    ownerSelectTestId: string;
    groupsTitle: string;
    groupsSelectTestId: string;
    sourceVaultTitle: string;
    sourceVaultSelectTestId: string;
}

interface UpdateDispatchExpectation {
    uuid: string;
    sourceVaultProfileUuid: string;
}

export async function runSecretOwnerGroupVaultUpdateActions(container: HTMLElement, selectors: UpdateActionSelectors) {
    await clickByTitle(container, selectors.ownerTitle);
    await clickByTestId(container, selectors.ownerSelectTestId);
    await clickByText(container, 'Update');

    await clickByTitle(container, selectors.ownerTitle);
    await clickByText(container, 'Remove');

    await clickByTitle(container, selectors.groupsTitle);
    await clickByTestId(container, selectors.groupsSelectTestId);
    await clickByText(container, 'Update');

    await clickByTitle(container, selectors.groupsTitle);
    await clickByText(container, 'Clear');

    await clickByTitle(container, selectors.sourceVaultTitle);
    await clickByTestId(container, selectors.sourceVaultSelectTestId);
    await clickByText(container, 'Update');
}

export function expectSecretOwnerGroupVaultDispatchCalls(dispatch: ReturnType<typeof vi.fn>, expectation: UpdateDispatchExpectation) {
    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'secrets/updateSecretObjects',
            payload: { uuid: expectation.uuid, update: { ownerUuid: 'user-1' } },
        }),
    );
    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'secrets/updateSecretObjects',
            payload: { uuid: expectation.uuid, update: { ownerUuid: '' } },
        }),
    );
    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'secrets/updateSecretObjects',
            payload: { uuid: expectation.uuid, update: { groupUuids: ['group-1'] } },
        }),
    );
    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'secrets/updateSecretObjects',
            payload: { uuid: expectation.uuid, update: { groupUuids: [] } },
        }),
    );
    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'secrets/updateSecretObjects',
            payload: { uuid: expectation.uuid, update: { sourceVaultProfileUuid: expectation.sourceVaultProfileUuid } },
        }),
    );
}

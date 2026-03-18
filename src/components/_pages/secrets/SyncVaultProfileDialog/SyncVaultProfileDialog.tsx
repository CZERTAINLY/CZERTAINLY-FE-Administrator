import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import AttributeEditor from 'components/Attributes/AttributeEditor';
import Button from 'components/Button';
import Container from 'components/Container';
import Select from 'components/Select';

import { actions as secretsActions, selectors as secretsSelectors } from 'ducks/secrets';
import { selectors as vaultProfileSelectors } from 'ducks/vault-profiles';
import { SecretDetailDto } from 'types/openapi';
import { collectFormAttributes } from 'utils/attributes/attributes';

interface SyncVaultProfileDialogProps {
    secret: SecretDetailDto;
    onClose: () => void;
}

export const SyncVaultProfileDialog = ({ secret, onClose }: SyncVaultProfileDialogProps) => {
    const dispatch = useDispatch();
    const vaultProfiles = useSelector(vaultProfileSelectors.vaultProfiles);
    const syncVaultProfileAttributeDescriptors = useSelector(secretsSelectors.syncVaultProfileAttributeDescriptors);
    const isFetchingSyncVaultProfileAttributes = useSelector(secretsSelectors.isFetchingSyncVaultProfileAttributes);

    const [selectedVaultProfileUuid, setSelectedVaultProfileUuid] = useState('');

    const methods = useForm({ mode: 'onChange', defaultValues: {} });
    const { getValues } = methods;

    const syncVaultProfileOptions = useMemo(() => {
        const existing = new Set<string>(secret.syncVaultProfiles?.map((p) => p.uuid) ?? []);
        if (secret.sourceVaultProfile?.uuid) {
            existing.add(secret.sourceVaultProfile.uuid);
        }
        return vaultProfiles.filter((p) => p.enabled && !existing.has(p.uuid)).map((p) => ({ value: p.uuid, label: p.name }));
    }, [vaultProfiles, secret.syncVaultProfiles, secret.sourceVaultProfile]);

    useEffect(() => {
        if (!selectedVaultProfileUuid || !secret.type) return;
        const profile = vaultProfiles.find((p) => p.uuid === selectedVaultProfileUuid);
        const vaultUuid = profile?.vaultInstance?.uuid;
        if (!vaultUuid) return;
        dispatch(
            secretsActions.getSyncVaultProfileAttributes({
                vaultUuid,
                vaultProfileUuid: selectedVaultProfileUuid,
                secretType: secret.type,
            }),
        );
    }, [dispatch, selectedVaultProfileUuid, secret.type, vaultProfiles]);

    const handleAdd = useCallback(() => {
        if (!selectedVaultProfileUuid) return;
        const values = getValues();
        const attributes = collectFormAttributes('syncVaultProfile', syncVaultProfileAttributeDescriptors, values);
        dispatch(
            secretsActions.addSyncVaultProfile({
                uuid: secret.uuid,
                vaultProfileUuid: selectedVaultProfileUuid,
                attributes,
            }),
        );
        onClose();
    }, [dispatch, getValues, onClose, secret.uuid, syncVaultProfileAttributeDescriptors, selectedVaultProfileUuid]);

    return (
        <FormProvider {...methods}>
            <Select
                id="secret-sync-vault-profile-detail"
                label="Vault Profile"
                placeholder="Select vault profile"
                options={syncVaultProfileOptions}
                value={selectedVaultProfileUuid || ''}
                onChange={(value) => setSelectedVaultProfileUuid(value as string)}
            />
            {selectedVaultProfileUuid && (isFetchingSyncVaultProfileAttributes || syncVaultProfileAttributeDescriptors.length > 0) && (
                <div className="mt-4">
                    <AttributeEditor id="syncVaultProfile" attributeDescriptors={syncVaultProfileAttributeDescriptors} />
                </div>
            )}
            <Container className="flex-row justify-end modal-footer mt-4" gap={4}>
                <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleAdd}
                    type="button"
                    disabled={!selectedVaultProfileUuid || isFetchingSyncVaultProfileAttributes}
                >
                    Add
                </Button>
            </Container>
        </FormProvider>
    );
};

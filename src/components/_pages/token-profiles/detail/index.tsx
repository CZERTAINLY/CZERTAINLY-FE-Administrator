import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import TokenStatusBadge from 'components/_pages/tokens/TokenStatusBadge';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions as tokenProfilesActions, selectors as tokenProfilesSelectors } from 'ducks/token-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { Badge, Col, Container, Label, Row } from 'reactstrap';
import { KeyUsage, PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';

export default function TokenProfileDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id, tokenId } = useParams();

    const tokenProfile = useSelector(tokenProfilesSelectors.tokenProfile);

    const isFetchingProfile = useSelector(tokenProfilesSelectors.isFetchingDetail);
    const isUpdatingKeyUsage = useSelector(tokenProfilesSelectors.isUpdatingKeyUsage);

    const isDeleting = useSelector(tokenProfilesSelectors.isDeleting);
    const isEnabling = useSelector(tokenProfilesSelectors.isEnabling);
    const isDisabling = useSelector(tokenProfilesSelectors.isDisabling);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

    const keyUsageEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyUsage));
    const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

    const isBusy = useMemo(
        () => isFetchingProfile || isDeleting || isEnabling || isDisabling || isUpdatingKeyUsage,
        [isFetchingProfile, isDeleting, isEnabling, isDisabling, isUpdatingKeyUsage],
    );

    const getFreshTokenProfileDetails = useCallback(() => {
        if (!id || !tokenId) return;
        dispatch(tokenProfilesActions.getTokenProfileDetail({ tokenInstanceUuid: tokenId, uuid: id }));
    }, [id, dispatch, tokenId]);

    useEffect(() => {
        getFreshTokenProfileDetails();
    }, [getFreshTokenProfileDetails, id, tokenId]);

    const onEditClick = useCallback(() => {
        if (!tokenProfile) return;
        navigate(`../../../edit/${tokenProfile.tokenInstanceUuid}/${tokenProfile?.uuid}`, { relative: 'path' });
    }, [navigate, tokenProfile]);

    const onEnableClick = useCallback(() => {
        if (!tokenProfile) return;
        dispatch(tokenProfilesActions.enableTokenProfile({ tokenInstanceUuid: tokenProfile.tokenInstanceUuid, uuid: tokenProfile.uuid }));
    }, [dispatch, tokenProfile]);

    const onDisableClick = useCallback(() => {
        if (!tokenProfile) return;
        dispatch(tokenProfilesActions.disableTokenProfile({ tokenInstanceUuid: tokenProfile.tokenInstanceUuid, uuid: tokenProfile.uuid }));
    }, [dispatch, tokenProfile]);

    const onDeleteConfirmed = useCallback(() => {
        if (!tokenProfile) return;
        dispatch(
            tokenProfilesActions.deleteTokenProfile({
                tokenInstanceUuid: tokenProfile.tokenInstanceUuid || 'unknown',
                uuid: tokenProfile.uuid,
                redirect: '../../../tokenprofiles',
            }),
        );
        setConfirmDelete(false);
    }, [dispatch, tokenProfile]);

    const keyUsageOptions = () => {
        let options: { value: KeyUsage; label: string }[] = [];
        for (let key in KeyUsage) {
            options.push({
                value: KeyUsage[key as keyof typeof KeyUsage],
                label: getEnumLabel(keyUsageEnum, KeyUsage[key as keyof typeof KeyUsage]),
            });
        }
        return options;
    };

    const existingUsages = () => {
        if (!tokenProfile) return [];
        return tokenProfile?.usages.map((usage) => {
            return { value: usage, label: usage.charAt(0).toUpperCase() + usage.slice(1).toLowerCase() };
        });
    };

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: !tokenProfile?.tokenInstanceUuid || tokenProfile?.enabled || false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: !tokenProfile?.tokenInstanceUuid || !(tokenProfile?.enabled || false),
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
            {
                icon: 'key',
                disabled: !tokenProfile?.tokenInstanceUuid || false,
                tooltip: 'Update Key Usages',
                onClick: () => {
                    setKeyUsageUpdate(true);
                },
            },
        ],
        [tokenProfile, onEditClick, onDisableClick, onEnableClick],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !tokenProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', tokenProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', tokenProfile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', tokenProfile.description || ''],
                      },
                      {
                          id: 'enabled',
                          columns: ['Enabled', <StatusBadge enabled={tokenProfile!.enabled} />],
                      },
                      {
                          id: 'tokenUuid',
                          columns: ['Token Instance UUID', tokenProfile.tokenInstanceUuid],
                      },
                      {
                          id: 'tokenName',
                          columns: [
                              'Token Instance Name',
                              tokenProfile.tokenInstanceUuid ? (
                                  <Link to={`../../tokens/detail/${tokenProfile.tokenInstanceUuid}`}>{tokenProfile.tokenInstanceName}</Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'tokenStatus',
                          columns: ['Token Instance Status', <TokenStatusBadge status={tokenProfile.tokenInstanceStatus} />],
                      },
                      {
                          id: 'Key Usages',
                          columns: [
                              'Key Usages',
                              tokenProfile.usages.map((usage) => (
                                  <Badge key={usage} color="secondary" className="mr-xs">
                                      {usage}
                                  </Badge>
                              )),
                          ],
                      },
                  ],
        [tokenProfile],
    );

    const keyUsageBody = (
        <div>
            <div className="form-group">
                <label className="form-label">Key Usage</label>
                <Select
                    isMulti={true}
                    id="field"
                    options={keyUsageOptions()}
                    onChange={(e) => {
                        setKeyUsages(e.map((item) => item.value));
                    }}
                    defaultValue={existingUsages()}
                    isClearable={true}
                />
            </div>
        </div>
    );

    const onUpdateKeyUsageConfirmed = useCallback(() => {
        dispatch(
            tokenProfilesActions.updateKeyUsage({
                tokenInstanceUuid: tokenProfile?.tokenInstanceUuid || 'unknown',

                uuid: tokenProfile?.uuid || 'unknown',

                usage: { usage: keyUsages },
            }),
        );

        setKeyUsageUpdate(false);
    }, [dispatch, tokenProfile, keyUsages]);

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="Token Profile Details"
                        busy={isBusy}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshTokenProfileDetails}
                        widgetLockName={LockWidgetNameEnum.TokenProfileDetails}
                        lockSize="large"
                    >
                        <br />

                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>

                <Col>
                    <Widget title="Attributes" busy={isBusy} titleSize="large">
                        <br />
                        <Label>Token Profile Attributes</Label>
                        <AttributeViewer attributes={tokenProfile?.attributes} />
                    </Widget>

                    {tokenProfile && (
                        <CustomAttributeWidget
                            resource={Resource.TokenProfiles}
                            resourceUuid={tokenProfile.uuid}
                            attributes={tokenProfile.customAttributes}
                        />
                    )}
                </Col>
            </Row>

            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col></Col>
            </Row>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Token Profile"
                body="You are about to delete Token Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={keyUsageUpdate}
                caption={`Update Key Usage`}
                body={keyUsageBody}
                toggle={() => setKeyUsageUpdate(false)}
                buttons={[
                    { color: 'primary', onClick: onUpdateKeyUsageConfirmed, body: 'Update' },
                    { color: 'secondary', onClick: () => setKeyUsageUpdate(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}

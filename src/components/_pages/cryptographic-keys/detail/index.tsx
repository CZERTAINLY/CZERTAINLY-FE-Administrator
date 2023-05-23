import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import TabLayout from "components/Layout/TabLayout";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/cryptographic-keys";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";

import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { Col, Container, Label, Row } from "reactstrap";
import { KeyCompromiseReason, KeyState, PlatformEnum, Resource } from "types/openapi";
import { dateFormatter } from "utils/dateUtil";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";
import CryptographicKeyItem from "./CryptographicKeyItem";

export default function CryptographicKeyDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id, tokenId } = useParams();

    const cryptographicKey = useSelector(selectors.cryptographicKey);

    const isFetchingProfile = useSelector(selectors.isFetchingDetail);
    const isUpdatingKeyUsage = useSelector(selectors.isUpdatingKeyUsage);

    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const isCompromising = useSelector(selectors.isBulkCompromising);
    const isDestroying = useSelector(selectors.isBulkDestroying);
    const isFetchingHistory = useSelector(selectors.isFetchingHistory);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

    const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

    const [compromiseReason, setCompromiseReason] = useState<KeyCompromiseReason>();
    const keyCompromiseReasonEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyCompromiseReason));
    const keyTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyType));

    const isBusy = useMemo(
        () => isFetchingProfile || isDeleting || isEnabling || isDisabling || isUpdatingKeyUsage || isCompromising || isDestroying,
        [isFetchingProfile, isDeleting, isEnabling, isDisabling, isUpdatingKeyUsage, isCompromising, isDestroying],
    );

    useEffect(() => {
        if (!id || !tokenId) return;

        dispatch(actions.getCryptographicKeyDetail({ tokenInstanceUuid: tokenId, uuid: id }));
    }, [id, dispatch, tokenId]);

    const onEditClick = useCallback(() => {
        if (!cryptographicKey) return;
        navigate(`../../../edit/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey?.uuid}`, { relative: "path" });
    }, [navigate, cryptographicKey]);

    const onEnableClick = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.enableCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
    }, [dispatch, cryptographicKey]);

    const onDisableClick = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.disableCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
    }, [dispatch, cryptographicKey]);

    const onDeleteConfirmed = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.deleteCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid || "unknown",
                uuid: cryptographicKey.uuid,
                redirect: cryptographicKey.items.length > 1 ? "../../../" : undefined,
            }),
        );
        setConfirmDelete(false);
    }, [dispatch, cryptographicKey]);

    const onCompromise = useCallback(() => {
        if (!cryptographicKey) return;
        if (!compromiseReason) return;
        dispatch(
            actions.compromiseCryptographicKey({
                request: { reason: compromiseReason },
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
        setConfirmCompromise(false);
    }, [dispatch, cryptographicKey, compromiseReason]);

    const onDestroy = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.destroyCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
        setConfirmDestroy(false);
    }, [dispatch, cryptographicKey]);

    const optionForCompromise = useMemo(() => {
        var options = [];
        if (keyCompromiseReasonEnum) {
            for (const reason in KeyCompromiseReason) {
                const myReason: KeyCompromiseReason = KeyCompromiseReason[reason as keyof typeof KeyCompromiseReason];
                options.push({ value: myReason, label: getEnumLabel(keyCompromiseReasonEnum, myReason) });
            }
        }
        return options;
    }, [keyCompromiseReasonEnum]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "pencil",
                disabled: false,
                tooltip: "Edit",
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: "trash",
                disabled: false,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: "check",
                disabled: cryptographicKey?.items.every((item) => item.enabled) ?? false,
                tooltip: "Enable",
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: "times",
                disabled: cryptographicKey?.items.every((item) => !item.enabled) ?? false,
                tooltip: "Disable",
                onClick: () => {
                    onDisableClick();
                },
            },
            {
                icon: "compromise",
                disabled:
                    cryptographicKey?.items.every(
                        (item) => ![KeyState.PreActive, KeyState.Active, KeyState.Deactivated].includes(item.state),
                    ) ?? false,
                tooltip: "Compromise",
                onClick: () => {
                    setConfirmCompromise(true);
                },
            },
            {
                icon: "destroy",
                disabled:
                    cryptographicKey?.items.every(
                        (item) => ![KeyState.PreActive, KeyState.Compromised, KeyState.Deactivated].includes(item.state),
                    ) ?? false,
                tooltip: "Destroy",
                onClick: () => {
                    setConfirmDestroy(true);
                },
            },
        ],
        [cryptographicKey, onEditClick, onDisableClick, onEnableClick, setConfirmCompromise, setConfirmDestroy],
    );

    const cryptographicKeyTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5>
                    Key <span className="fw-semi-bold">Details</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const associationTitle = useMemo(
        () => (
            <div>
                <h5>
                    Key <span className="fw-semi-bold">Associations</span>
                </h5>
            </div>
        ),
        [],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "property",
                content: "Property",
            },
            {
                id: "value",
                content: "Value",
            },
        ],
        [],
    );

    const associationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Name",
            },
            {
                id: "uuid",
                content: "UUID",
            },
            {
                id: "resource",
                content: "Resource",
            },
        ],
        [],
    );

    const associationBody = useMemo(
        () =>
            !cryptographicKey || !cryptographicKey.associations
                ? []
                : cryptographicKey.associations.map((item) => ({
                      id: item.uuid,
                      columns: [
                          item.resource !== Resource.Certificates ? (
                              item.name
                          ) : (
                              <Link to={`../../../certificates/detail/${item.uuid}`}>{item.name}</Link>
                          ),

                          item.uuid,

                          item.resource,
                      ],
                  })),
        [cryptographicKey],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !cryptographicKey
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", cryptographicKey.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", cryptographicKey.name],
                      },
                      {
                          id: "description",
                          columns: ["Description", cryptographicKey.description || ""],
                      },
                      {
                          id: "creationTime",
                          columns: ["Creation Time", dateFormatter(cryptographicKey.creationTime) || ""],
                      },
                      {
                          id: "tokenName",
                          columns: [
                              "Token Instance Name",
                              cryptographicKey.tokenInstanceUuid ? (
                                  <Link to={`../../../tokens/detail/${cryptographicKey.tokenInstanceUuid}`}>
                                      {cryptographicKey.tokenInstanceName}
                                  </Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                      {
                          id: "tokenUuid",
                          columns: ["Token Instance UUID", cryptographicKey.tokenInstanceUuid],
                      },
                      {
                          id: "tokenProfileName",
                          columns: [
                              "Token Profile Name",
                              cryptographicKey.tokenInstanceUuid && cryptographicKey.tokenProfileUuid ? (
                                  <Link
                                      to={`../../../tokenprofiles/detail/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey.tokenProfileUuid}`}
                                  >
                                      {cryptographicKey.tokenProfileName}
                                  </Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                      {
                          id: "tokenProfileUuid",
                          columns: ["Token Profile UUID", cryptographicKey.tokenProfileUuid || ""],
                      },
                      {
                          id: "owner",
                          columns: ["Owner", cryptographicKey.owner || ""],
                      },
                      {
                          id: "groupName",
                          columns: [
                              "Group Name",
                              cryptographicKey.group ? (
                                  <Link to={`../../groups/detail/${cryptographicKey.group.uuid}`}>{cryptographicKey.group.name}</Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                  ],
        [cryptographicKey],
    );

    const itemTabs = () => {
        return !cryptographicKey
            ? []
            : cryptographicKey?.items.map((item, index) => {
                  return {
                      title: getEnumLabel(keyTypeEnum, item.type),
                      content: (
                          <Widget busy={isBusy || isFetchingHistory}>
                              <CryptographicKeyItem
                                  key={item.uuid}
                                  keyItem={item}
                                  keyUuid={cryptographicKey.uuid}
                                  tokenInstanceUuid={cryptographicKey.tokenInstanceUuid}
                                  tokenProfileUuid={cryptographicKey.tokenProfileUuid}
                                  totalKeyItems={cryptographicKey.items.length}
                              />
                          </Widget>
                      ),
                  };
              });
    };

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget title={cryptographicKeyTitle} busy={isBusy}>
                        <br />

                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>

                <Col>
                    <Widget title="Attributes" busy={isBusy}>
                        <br />
                        <Label>Key Attributes</Label>
                        <AttributeViewer attributes={cryptographicKey?.attributes} />
                    </Widget>

                    {cryptographicKey && (
                        <CustomAttributeWidget
                            resource={Resource.Keys}
                            resourceUuid={cryptographicKey.uuid}
                            attributes={cryptographicKey.customAttributes}
                        />
                    )}
                </Col>
            </Row>
            <TabLayout tabs={itemTabs()} />

            <Widget title={associationTitle} busy={isBusy}>
                <br />

                <CustomTable headers={associationHeaders} data={associationBody} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Token Profile"
                body="You are about to delete Token Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={confirmCompromise}
                caption={`Compromise Key`}
                body={
                    <div>
                        <p>You are about to mark the Key as compromised. Is this what you want to do?</p>
                        <p>
                            <b>Warning:</b> This action cannot be undone.
                        </p>
                        <Select
                            name="compromiseReason"
                            id="compromiseReason"
                            options={optionForCompromise}
                            onChange={(e) => setCompromiseReason(e?.value)}
                        />
                    </div>
                }
                toggle={() => setConfirmCompromise(false)}
                buttons={[
                    { color: "danger", onClick: onCompromise, body: "Yes" },
                    { color: "secondary", onClick: () => setConfirmCompromise(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={confirmDestroy}
                caption={`Destroy Key`}
                body={`You are about to destroy the Key. Is this what you want to do?`}
                toggle={() => setConfirmDestroy(false)}
                buttons={[
                    { color: "danger", onClick: onDestroy, body: "Yes, Destroy" },
                    { color: "secondary", onClick: () => setConfirmDestroy(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}

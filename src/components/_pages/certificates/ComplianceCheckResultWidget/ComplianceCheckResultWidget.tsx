import CertificateStatus from 'components/_pages/certificates/CertificateStatus';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'ducks';
import { dateFormatter } from 'utils/dateUtil';
import { selectors as complianceProfilesSelectors, actions as complianceProfilesActions } from 'ducks/compliance-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import { ComplianceRuleStatus, ComplianceStatus, Resource } from 'types/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import Button from 'components/Button';
import { Info } from 'lucide-react';
import { AttributeResponseModel } from 'types/attributes';

type Props = {
    objectUuid: string;
    resource: Resource;
    widgetLockName: LockWidgetNameEnum;
    setSelectedAttributesInfo: (attributes: AttributeResponseModel[]) => void;
};

export default function ComplianceCheckResultWidget({ widgetLockName, objectUuid, setSelectedAttributesInfo, resource }: Props) {
    const dispatch = useDispatch();
    const complianceCheckResult = useSelector((s: AppState) =>
        complianceProfilesSelectors.complianceCheckResultBy(s, resource, objectUuid),
    );

    const isFetchingComplianceCheckResult = useSelector((s: AppState) =>
        complianceProfilesSelectors.isFetchingComplianceCheckResultBy(s, resource, objectUuid),
    );
    const getFreshComplianceCheckResult = useCallback(() => {
        dispatch(complianceProfilesActions.getComplianceCheckResult({ resource: resource, objectUuid: objectUuid }));
    }, [dispatch, objectUuid, resource]);

    useEffect(() => {
        getFreshComplianceCheckResult();
    }, [getFreshComplianceCheckResult]);

    const complianceHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'name', content: 'Name' },
            { id: 'description', content: 'Description' },
            {
                id: 'status',
                content: 'Status',
            },
            { id: 'provider', content: 'Provider' },
            { id: 'kind', content: 'Kind' },
            { id: 'attributes', content: 'Attributes' },
        ],
        [],
    );

    const complianceData: TableDataRow[] = useMemo(() => {
        if (!complianceCheckResult) return [];
        return complianceCheckResult.failedRules.map((rule) => ({
            id: rule.uuid,
            columns: [
                rule.name || '',
                rule.description || '',
                <CertificateStatus key={rule.uuid} status={(rule.status as ComplianceRuleStatus) || ''} />,
                rule.connectorName || '',
                rule.kind || '',
                rule.attributes?.length ? (
                    <Button
                        variant="transparent"
                        title="Attributes"
                        onClick={() => {
                            setSelectedAttributesInfo((rule.attributes || []) as AttributeResponseModel[]);
                        }}
                    >
                        <Info size={16} style={{ color: 'auto' }} />
                    </Button>
                ) : (
                    ''
                ),
            ],
        }));
    }, [complianceCheckResult, setSelectedAttributesInfo]);

    return (
        <Widget
            title="Compliance Status"
            busy={isFetchingComplianceCheckResult}
            titleSize="large"
            lockSize="normal"
            widgetLockName={widgetLockName}
            refreshAction={getFreshComplianceCheckResult}
            dataTestId="compliance-status-widget"
        >
            <br />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Status:</span>
                    <span>
                        <CertificateStatus status={(complianceCheckResult?.status as ComplianceStatus) || ''} />
                    </span>
                </div>
                {complianceCheckResult?.timestamp && (
                    <>
                        <div style={{ width: '1px', height: '10px', backgroundColor: '#6c757d' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>Checked:</span>
                            <span>{dateFormatter(complianceCheckResult?.timestamp || '')}</span>
                        </div>
                    </>
                )}
            </div>
            {complianceCheckResult?.message && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Message:</span>
                    <span>{complianceCheckResult?.message}</span>
                </div>
            )}
            <br />
            <CustomTable headers={complianceHeaders} data={complianceData} hasPagination={true} />
        </Widget>
    );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { actions as profileApprovalActions, selectors as profileApprovalSelector } from 'ducks/approval-profiles';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function ApprovalProfilesList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const profileApprovalList = useSelector(profileApprovalSelector.profileApprovalList);
    const profileApprovalListTotalItems = useSelector(profileApprovalSelector.totalItems);
    const isFetchingList = useSelector(profileApprovalSelector.isFetchingList);

    const isBusy = useMemo(() => isFetchingList, [isFetchingList]);

    const getFreshData = useCallback(() => {
        dispatch(profileApprovalActions.listApprovalProfiles({ itemsPerPage: pageSize, pageNumber }));
    }, [dispatch, pageNumber, pageSize]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => {
                    onAddClick();
                },
            },
        ],
        [onAddClick],
    );

    const approvalProfilesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
            },
            {
                id: 'description',
                content: 'Description',
            },
            {
                id: 'isEnabled',
                content: 'Enabled',
            },
            {
                id: 'version',
                content: 'Version',
            },

            {
                id: 'approvalSteps',
                content: 'Approval Steps',
            },
            {
                id: 'associations',
                content: 'Associations',
            },
        ],
        [],
    );

    const approvalProfilesTableData: TableDataRow[] = useMemo(
        () =>
            profileApprovalList.map((approvalProfile) => ({
                id: approvalProfile.uuid,

                columns: [
                    <Link to={`./detail/${approvalProfile.uuid}`}>{approvalProfile.name}</Link>,

                    approvalProfile.description || '',

                    <StatusBadge enabled={approvalProfile.enabled} />,

                    <>{approvalProfile.version}</>,

                    <>{approvalProfile.numberOfSteps}</>,

                    <>{approvalProfile.associations.toString()}</>,
                ],
            })),
        [profileApprovalList],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Approval Profiles"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfApprovalProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <br />
                <CustomTable
                    headers={approvalProfilesTableHeader}
                    data={approvalProfilesTableData}
                    hasPagination={true}
                    onPageChanged={setPageNumber}
                    onPageSizeChanged={setPageSize}
                    paginationData={{
                        pageSize: pageSize,
                        totalItems: profileApprovalListTotalItems || 0,
                        itemsPerPageOptions: [10, 20, 50, 100],
                        loadedPageSize: pageSize,
                        totalPages: profileApprovalListTotalItems ? Math.ceil(profileApprovalListTotalItems / pageSize) : 0,
                        page: pageNumber,
                    }}
                />
            </Widget>
        </Container>
    );
}

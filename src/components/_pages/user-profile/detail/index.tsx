import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container } from 'reactstrap';

import { actions, selectors } from 'ducks/auth';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

export default function UserProfileDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector(selectors.profile);
    const isFetchingDetail = useSelector(selectors.isFetchingProfile);

    useEffect(() => {
        dispatch(actions.getProfile());
    }, [dispatch]);

    const onEditClick = useCallback(() => {
        navigate(`./edit`);
    }, [navigate]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: profile?.systemUser || false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
        ],
        [profile, onEditClick],
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
            !profile
                ? []
                : [
                      {
                          id: 'username',
                          columns: ['Username', profile.username],
                      },
                      {
                          id: 'description',
                          columns: ['Description', profile.description || ''],
                      },
                      {
                          id: 'firstName',
                          columns: ['First name', profile.firstName || ''],
                      },
                      {
                          id: 'lastName',
                          columns: ['Last name', profile.lastName || ''],
                      },
                      {
                          id: 'email',
                          columns: ['Email', profile.email || ''],
                      },
                  ],
        [profile],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title="User Details" busy={isFetchingDetail} widgetButtons={buttons} titleSize="large">
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>
        </Container>
    );
}

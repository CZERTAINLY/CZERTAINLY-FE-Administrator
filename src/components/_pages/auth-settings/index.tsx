import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions as authSettingsActions, selectors as authSettingsSelectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form as BootstrapForm, ButtonGroup, Container, Row } from 'reactstrap';
import { isObjectSame, removeNullValues } from 'utils/common-utils';

type FormValues = {
    notificationsMapping: {
        [key: string]: {
            value: string;
        };
    };
};

const AuthenticationSettings = () => {
    const dispatch = useDispatch();

    const authenticationSettings = useSelector(authSettingsSelectors.authenticationSettings);
    const isFetchingSettings = useSelector(authSettingsSelectors.isFetchingSettings);

    const getAuthenticationSettings = useCallback(() => {
        dispatch(authSettingsActions.getAuthenticationSettings());
    }, [dispatch]);

    useEffect(() => {
        getAuthenticationSettings();
    }, [getAuthenticationSettings]);

    const isBusy = useMemo(() => isFetchingSettings, [isFetchingSettings]);

    const initialValues = useMemo(() => {
        return {};
    }, []);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values) return;
        },
        [dispatch],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget refreshAction={getAuthenticationSettings} title="Authentication Settings" titleSize="larger" busy={isBusy}>
                {JSON.stringify(authenticationSettings)}
            </Widget>
        </Container>
    );
};

export default AuthenticationSettings;

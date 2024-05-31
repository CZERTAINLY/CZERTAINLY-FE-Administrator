import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import { actions, selectors } from 'ducks/alerts';

import style from './Alerts.module.scss';

function Alerts() {
    const alerts = useSelector(selectors.selectMessages);
    const dispatch = useDispatch();

    return (
        <div className={style.alerts}>
            {alerts.map((alert) => (
                <Alert
                    className={style.alert}
                    key={alert.id}
                    style={{ background: alert.color === 'info' ? '#d0e3f0' : '' }}
                    color={alert.color === 'info' ? 'secondary' : alert.color}
                    toggle={() => dispatch(actions.dismiss(alert.id))}
                    isOpen
                    data-hiding={alert.isHiding}
                >
                    <span dangerouslySetInnerHTML={{ __html: alert.message }} />
                </Alert>
            ))}
        </div>
    );
}

export default Alerts;

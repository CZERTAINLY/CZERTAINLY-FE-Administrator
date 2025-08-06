import ReactSwitch from 'react-switch';
import { selectors } from 'ducks/certificates';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from 'ducks/certificates';
import styles from './CertificatesSwitch.module.scss';
import cx from 'classnames';

interface CertificatesSwitchProps {
    className?: string;
    disabled?: boolean;
    label?: string;
}

export default function CertificatesSwitch({ className = '', disabled = false, label = 'Include archived' }: CertificatesSwitchProps) {
    const isIncludeArchived = useSelector(selectors.isIncludeArchived);
    const dispatch = useDispatch();
    return (
        <div className={cx(styles.container, className)}>
            <span className={styles.label}>{label}</span>
            <label htmlFor="archived-switch" className={styles.switchLabel}>
                <ReactSwitch
                    disabled={disabled}
                    onChange={() => dispatch(actions.setIncludeArchived(!isIncludeArchived))}
                    checked={isIncludeArchived}
                    className="react-switch"
                    id="archived-switch"
                    onColor="#3754a5"
                />
            </label>
        </div>
    );
}

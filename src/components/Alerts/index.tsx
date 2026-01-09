import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from 'ducks/alerts';

import { CircleCheck, CircleX, X } from 'lucide-react';
import Container from 'components/Container';

function Alerts() {
    const alerts = useSelector(selectors.selectMessages);
    console.log('alerts', alerts);
    const dispatch = useDispatch();

    return (
        <Container className="sticky bottom-12 !gap-2 z-9999 w-[calc(100%+2rem)] ml-[-1rem]" data-testid="alerts-container">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    data-testid={`alert-${alert.id}`}
                    className={cn('mt-2 text-sm border rounded-lg px-10 py-4 relative transition-opacity duration-[3000ms]', {
                        'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500':
                            alert.color === 'success',
                        'bg-red-100 text-red-800 border-red-200 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500':
                            alert.color !== 'success',
                        'opacity-0': alert.isHiding,
                        'opacity-100': !alert.isHiding,
                    })}
                    role="alert"
                    tabIndex={-1}
                    aria-labelledby="hs-soft-color-warning-label"
                >
                    <div className="absolute top-5 left-4 translate-y-[2px]">
                        {alert.color === 'success' ? <CircleCheck size={14} /> : <CircleX size={14} />}
                    </div>
                    <span
                        id="hs-soft-color-warning-label"
                        className="text-lg font-semibold"
                        dangerouslySetInnerHTML={{ __html: alert.message }}
                    />
                    <button
                        className="absolute top-2 right-2 translate-y-[3px] text-[var(--status-success-color)]"
                        onClick={() => dispatch(actions.dismiss(alert.id))}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </Container>
    );
}

export default Alerts;

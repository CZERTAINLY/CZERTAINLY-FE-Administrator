import cx from 'classnames';
import { Spinner as StrapSpinner } from 'reactstrap';

import style from './Spinner.module.scss';

interface Props {
    active?: boolean;
}

function Spinner({ active = false }: Props) {
    return (
        <div className={cx(style.container, { [style.active]: active })}>
            <StrapSpinner className={style.spinner} color="dark" />
        </div>
    );
}

export default Spinner;

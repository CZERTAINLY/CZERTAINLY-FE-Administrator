import cx from 'classnames';
import { MenuProps, components } from 'react-select';
import { Button } from 'reactstrap';
import style from './CustomSelectComponent.module.scss';

interface CustomSelectComponentProps extends MenuProps {
    onAddNew: () => void;
}

const CustomSelectComponent: React.FC<CustomSelectComponentProps> = ({ onAddNew, ...props }) => {
    return (
        <components.Menu {...props}>
            {props.children}
            <div className="d-flex justify-content-start ps-2 py-2">
                <Button color="white" className={style.customSelectAddButton} onClick={onAddNew}>
                    <i className={cx('fa fa-add', style.customSelectAddIcon)} />
                </Button>
            </div>
        </components.Menu>
    );
};

export default CustomSelectComponent;

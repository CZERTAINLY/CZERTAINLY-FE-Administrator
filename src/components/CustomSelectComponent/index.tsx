import cx from "classnames";
import { MenuProps, components } from "react-select";
import { Button } from "reactstrap";
import style from "./CustomSelectComponent.module.scss";

interface CustomSelectComponentProps extends MenuProps {
    onAddNew: () => void;
    title?: string;
    disabled?: boolean;
}

const CustomSelectComponent: React.FC<CustomSelectComponentProps> = ({ onAddNew, disabled, title, ...props }) => {
    return (
        <components.Menu {...props}>
            {props.children}
            <div className="d-flex justify-content-start ps-2 py-2">
                <Button disabled={disabled} className="btn btn-link" color="white" title={title} onClick={onAddNew}>
                    <i className={cx("fa fa-plus", style.customSelectAddIcon)} />
                </Button>
            </div>
        </components.Menu>
    );
};

export default CustomSelectComponent;

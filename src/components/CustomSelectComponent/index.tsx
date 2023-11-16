import { MenuProps, components } from "react-select";
import { Button } from "reactstrap";

interface CustomSelectComponentProps extends MenuProps {
    onAddNew: () => void;
}

const CustomSelectComponent: React.FC<CustomSelectComponentProps> = ({ onAddNew, ...props }) => {
    return (
        <components.Menu {...props}>
            {props.children}
            <div className="d-flex justify-content-start ps-2 py-2">
                <Button className="p-2" color="primary" outline size="sm" onClick={onAddNew}>
                    <span className="p-1 fs-6">Add new</span>
                    <i className="fa fa-add mx-2" />
                </Button>
            </div>
        </components.Menu>
    );
};

export default CustomSelectComponent;

import { MenuProps, components } from 'react-select';
import Button from 'components/Button';
import { Plus } from 'lucide-react';

interface CustomSelectComponentProps extends MenuProps {
    onAddNew: () => void;
}

const CustomSelectComponent: React.FC<CustomSelectComponentProps> = ({ onAddNew, ...props }) => {
    return (
        <components.Menu {...props}>
            {props.children}
            <div className="flex justify-start pl-2 py-2">
                <Button variant="transparent" onClick={onAddNew}>
                    <Plus size={16} />
                </Button>
            </div>
        </components.Menu>
    );
};

export default CustomSelectComponent;

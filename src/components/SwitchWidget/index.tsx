import { FormGroup, Input, Label } from 'reactstrap';

interface Props {
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
    checked?: boolean;
}

const SwitchWidget = ({ label, disabled, onClick, checked = false }: Props) => {
    return (
        <FormGroup switch>
            {label && <Label className="my-1">{label}</Label>}
            <Input className="my-2" type="switch" checked={checked} disabled={disabled} onChange={onClick} />
        </FormGroup>
    );
};

export default SwitchWidget;

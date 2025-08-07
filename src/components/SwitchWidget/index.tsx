import { FormGroup, Input, Label } from 'reactstrap';

interface Props {
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
    checked?: boolean;
    id?: string;
}

const SwitchWidget = ({ label, disabled, onClick, checked = false, id }: Props) => {
    return (
        <FormGroup switch>
            {label && <Label className="my-1">{label}</Label>}
            <Input className="my-2" type="switch" checked={checked} disabled={disabled} onChange={onClick} id={id} />
        </FormGroup>
    );
};

export default SwitchWidget;

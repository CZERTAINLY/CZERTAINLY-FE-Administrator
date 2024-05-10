import { useState } from 'react';
import Select from 'react-select';
import { Button, ButtonGroup } from 'reactstrap';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface NewRowWidgetProps {
    newItemsList: SelectChangeValue[];
    isBusy: boolean;
    onAddClick: (newValues: SelectChangeValue[]) => void;
}

const NewRowWidget = ({ newItemsList, isBusy, onAddClick }: NewRowWidgetProps) => {
    const [selectedItems, setSelectedItems] = useState<SelectChangeValue[]>([]);

    return (
        <div className="d-flex">
            <div className="w-100">
                <Select
                    onChange={(event) => {
                        setSelectedItems(event.map((e) => e));
                    }}
                    isMulti
                    value={selectedItems}
                    options={newItemsList}
                />
            </div>
            <div>
                {selectedItems?.length ? (
                    <ButtonGroup>
                        <Button
                            disabled={isBusy}
                            className="btn btn-link ms-2 mt-2 p-1"
                            size="sm"
                            color="secondary"
                            title="Update Description"
                            onClick={() => {
                                onAddClick(selectedItems);
                                setSelectedItems([]);
                            }}
                        >
                            <i className="fa fa-check" />
                        </Button>
                    </ButtonGroup>
                ) : null}
            </div>
        </div>
    );
};

export default NewRowWidget;

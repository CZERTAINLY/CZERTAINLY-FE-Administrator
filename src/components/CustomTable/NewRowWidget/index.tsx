import cx from 'classnames';
import { useEffect, useState } from 'react';
import Select from 'components/Select';
import { Button, ButtonGroup } from 'reactstrap';
import styles from './NewRowWidget.module.scss';
import { Plus } from 'lucide-react';
interface SelectChangeValue {
    value: string;
    label: string;
}

export interface NewRowWidgetProps {
    newItemsList: SelectChangeValue[];
    isBusy: boolean;
    onAddClick: (newValues: SelectChangeValue[]) => void;
    immediateAdd?: boolean;
    selectHint?: string;
}

const NewRowWidget = ({ newItemsList, isBusy, onAddClick, immediateAdd, selectHint }: NewRowWidgetProps) => {
    const [selectedItems, setSelectedItems] = useState<SelectChangeValue[]>([]);

    useEffect(() => {
        if (immediateAdd && selectedItems.length) {
            onAddClick(selectedItems);
            setSelectedItems([]);
        }
    }, [immediateAdd, selectedItems, onAddClick]);

    return (
        <div className="d-flex">
            <Select
                onChange={(values) => {
                    setSelectedItems(values || []);
                }}
                isMulti
                value={selectedItems}
                options={newItemsList}
                placeholder={selectHint || 'Select items to add'}
                id="newRowWidgetSelect"
            />
            <div>
                {selectedItems?.length && !immediateAdd ? (
                    <ButtonGroup>
                        <Button
                            disabled={isBusy}
                            className={cx('btn btn-link ms-1', styles.addButton)}
                            size="sm"
                            color="secondary"
                            onClick={() => {
                                onAddClick(selectedItems);
                                setSelectedItems([]);
                            }}
                        >
                            <Plus />
                        </Button>
                    </ButtonGroup>
                ) : null}
            </div>
        </div>
    );
};

export default NewRowWidget;

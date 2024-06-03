import cx from 'classnames';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button, ButtonGroup } from 'reactstrap';
import styles from './NewRowWidget.module.scss';
interface SelectChangeValue {
    value: string;
    label: string;
}

export interface NewRowWidgetProps {
    newItemsList: SelectChangeValue[];
    isBusy: boolean;
    onAddClick: (newValues: SelectChangeValue[]) => void;
    immidiateAdd?: boolean;
    selectHint?: string;
}

const NewRowWidget = ({ newItemsList, isBusy, onAddClick, immidiateAdd, selectHint }: NewRowWidgetProps) => {
    const [selectedItems, setSelectedItems] = useState<SelectChangeValue[]>([]);

    useEffect(() => {
        if (immidiateAdd && selectedItems.length) {
            onAddClick(selectedItems);
            setSelectedItems([]);
        }
    }, [immidiateAdd, selectedItems, onAddClick]);

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
                    placeholder={selectHint || 'Select items to add'}
                />
            </div>
            <div>
                {selectedItems?.length && !immidiateAdd ? (
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
                            <i className="fa fa-plus" />
                        </Button>
                    </ButtonGroup>
                ) : null}
            </div>
        </div>
    );
};

export default NewRowWidget;

import { Input } from 'reactstrap';
import styles from './ItemSelector.module.scss';
import { useCallback, useMemo, useState } from 'react';

type Props = {
    value: string[];
    items: {
        value: string;
        label: string;
    }[];
    onChange: (newValue: string[]) => void;
    selectedItemStyleVariant?: 'red' | 'green' | 'normal';
    content?: {
        label?: string;
        selectedLabel?: string;
        filterPlaceholder?: string;
    };
    showFilter?: boolean;
};

function ItemSelector({ content, value, items, onChange, showFilter, selectedItemStyleVariant = 'normal' }: Props) {
    const [filter, setFilter] = useState('');

    const handleToggle = useCallback(
        (itemValue: string) => {
            const newValue = value.includes(itemValue) ? value.filter((v) => v !== itemValue) : [...value, itemValue];
            onChange(newValue);
        },
        [value, onChange],
    );

    const selectedItemStyles: Record<typeof selectedItemStyleVariant, {}> = {
        green: styles.itemButtonSelectedGreen,
        normal: styles.itemButtonSelectedNormal,
        red: styles.itemButtonSelectedRed,
    };

    const selectedItems = useMemo(() => items.filter((item) => value.includes(item.value)), [items, value]);
    const filteredItems = useMemo(
        () =>
            items.filter(
                (item) =>
                    item.value.toLowerCase().includes(filter.toLowerCase()) || item.label.toLowerCase().includes(filter.toLowerCase()),
            ),
        [items, filter],
    );
    return (
        <div className={styles.wrapper}>
            <div>
                {content?.label && <p className={styles.label}>{content?.label}</p>}
                <div className={styles.container}>
                    {showFilter && (
                        <div className={styles.inputContainer}>
                            <Input
                                id="filter"
                                placeholder={content?.filterPlaceholder || 'Search items'}
                                onChange={(event) => setFilter(event.target.value)}
                            />
                        </div>
                    )}
                    <div className={styles.itemsContainer}>
                        {filteredItems.map((item) => (
                            <button
                                key={item.value}
                                className={`${styles.itemButton} ${selectedItemStyles[selectedItemStyleVariant]}`}
                                data-selected={value.includes(item.value)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleToggle(item.value);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                        {filteredItems.length === 0 && items.length !== 0 && <p className={styles.label}>No items found</p>}
                    </div>
                </div>
            </div>
            {selectedItems.length > 0 && (
                <div>
                    {content?.selectedLabel && <p className={styles.label}>{content?.selectedLabel}</p>}
                    <div className={styles.container}>
                        <div className={styles.itemsContainer}>
                            {selectedItems.map((item) => (
                                <button
                                    key={item.value}
                                    className={`${styles.itemButton} ${selectedItemStyles[selectedItemStyleVariant]}`}
                                    data-selected={value.includes(item.value)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleToggle(item.value);
                                    }}
                                >
                                    {item.label}
                                    <i className="fa fa-close"></i>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ItemSelector;

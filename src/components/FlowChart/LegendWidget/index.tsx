import React from 'react';
import { LegendItem } from '..';
import style from './legendWidget.module.scss';

interface LegendComponentProps {
    legends: LegendItem[];
}

const LegendComponent: React.FC<LegendComponentProps> = ({ legends }) => {
    if (!legends.length) return null;

    return (
        <div className={style.legendContainer}>
            <div className={style.legendItems}>
                {legends.map((legend, index) => (
                    <div key={index} className={style.legendItem}>
                        <div className={style.legendIcon} style={{ color: legend.color }}>
                            <i onClick={legend.onClick} className={legend.icon} style={{ padding: '5px' }} />
                        </div>
                        <span>{legend.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LegendComponent;

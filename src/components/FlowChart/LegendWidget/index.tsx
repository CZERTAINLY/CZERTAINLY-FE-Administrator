import React from 'react';
import { LegendItem } from '..';
import { Rocket, Book, Filter, Zap, Settings, FileText, Award, User, KeyRound, Users, CreditCard, Stamp, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    'fa fa-rocket': Rocket,
    'fa fa-book': Book,
    'fa fa-filter': Filter,
    'fa fa-bolt': Zap,
    'fa fa-cogs': Settings,
    'fa fa-certificate': FileText,
    'fa fa-medal': Award,
    'fa fa-user': User,
    'fa fa fa-user': User,
    'fa fa-key': KeyRound,
    'fa fa fa-key': KeyRound,
    'fa fa-users': Users,
    'fa fa fa-users': Users,
    'fa fa-address-card': CreditCard,
    'fa fa fa-address-card': CreditCard,
    'fa fa-stamp': Stamp,
    'fa fa fa-stamp': Stamp,
    'fa fa-map-marker': MapPin,
    'fa fa fa-map-marker': MapPin,
};

interface LegendComponentProps {
    legends: LegendItem[];
}

const LegendComponent: React.FC<LegendComponentProps> = ({ legends }) => {
    if (!legends.length) return null;

    return (
        <div>
            <div>
                {legends.map((legend, index) => {
                    const IconComponent = iconMap[legend.icon];
                    return (
                        <div key={index}>
                            <div style={{ color: legend.color }} onClick={legend.onClick}>
                                {IconComponent ? (
                                    <IconComponent size={16} color={legend.color} />
                                ) : (
                                    <i className={legend.icon} style={{ padding: '5px' }} />
                                )}
                            </div>
                            <span>{legend.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LegendComponent;

import cn from 'classnames';
import Container from 'components/Container';
import { LockTypeEnum } from 'types/user-interface';
import { Info, TriangleAlert, Home, Lock, Wifi, Database, Server } from 'lucide-react';
interface Props {
    size?: 'small' | 'normal' | 'large';
    lockTitle?: string;
    lockText?: string;
    lockDetails?: string;
    lockType?: LockTypeEnum;
    dataTestId?: string;
}

// TODO: Add a refresh button
const WidgetLock = ({
    size = 'normal',
    lockTitle = 'There was some problem',
    lockText = 'There was some issue please try again later',
    lockType = LockTypeEnum.GENERIC,
    lockDetails,
    dataTestId,
}: Props) => {
    const getIcon = () => {
        const iconSize = size === 'small' ? 24 : size === 'normal' ? 32 : 48;

        switch (lockType) {
            case LockTypeEnum.GENERIC:
                return <TriangleAlert size={iconSize} />;
            case LockTypeEnum.CLIENT:
                return <Home size={iconSize} />;
            case LockTypeEnum.PERMISSION:
                return <Lock size={iconSize} />;
            case LockTypeEnum.NETWORK:
                return <Wifi size={iconSize} />;
            case LockTypeEnum.SERVICE_ERROR:
                return <Database size={iconSize} />;
            case LockTypeEnum.SERVER_ERROR:
                return <Server size={iconSize} />;
            default:
                return <TriangleAlert size={iconSize} />;
        }
    };

    const renderPopOver = () => {
        return (
            <div className="hs-tooltip inline-block">
                <button
                    type="button"
                    className="hs-tooltip-toggle inline-flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                    <Info size={16} className="ml-1" />
                </button>
                <div
                    className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                    role="tooltip"
                >
                    <div className="text-center font-semibold mb-1">{lockTitle}</div>
                    <div className="text-center">{lockDetails}</div>
                </div>
            </div>
        );
    };

    const getMainColWidthLg = () => {
        if (size === 'small') return 'md:col-start-3 md:col-span-5';
        if (size === 'normal') return 'md:col-start-4 md:col-span-6';
        return 'md:col-span-12';
    };

    return (
        <Container>
            <div className="grid grid-cols-12" data-testid={dataTestId || 'widget-lock'}>
                <div className={`col-span-12 ${getMainColWidthLg()} text-center`}>
                    <div className={cn('bg-gray-100 dark:bg-gray-800 rounded-lg p-6')}>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 xl:col-start-2 xl:col-span-3 flex items-center justify-center">{getIcon()}</div>
                            <div className="col-span-12 xl:col-span-8">
                                <h5 className={cn('flex justify-center items-center gap-2')}>
                                    {lockTitle}
                                    {lockDetails && renderPopOver()}
                                </h5>
                                <p>{lockText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default WidgetLock;

import Cron from "react-cron-generator";
import "./CronWidget.scss";

interface Props {
    value: string | undefined;
    onChange: (e: string | undefined) => void;
    showResultText: boolean;
    showResultCron: boolean;
}

const CronWidget = ({ onChange, showResultCron, showResultText, value }: Props) => {
    return <Cron value={value} onChange={onChange} showResultText={showResultText} showResultCron={showResultCron} />;
};

export default CronWidget;

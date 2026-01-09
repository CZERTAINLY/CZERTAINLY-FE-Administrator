interface Props {
    status: boolean;
}

function KeyStatusCircle({ status }: Props) {
    const { color, text } = status
        ? { color: 'var(--status-success-color)', text: 'Enabled' }
        : { color: 'var(--status-danger-color)', text: 'Disabled' };

    return <span title={text} className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />;
}

export default KeyStatusCircle;

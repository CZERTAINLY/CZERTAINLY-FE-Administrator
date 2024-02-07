interface Props {
    status: boolean;
}

function KeyStatusCircle({ status }: Props) {
    const { color, text } = status ? { color: 'success', text: 'Enabled' } : { color: 'danger', text: 'Disabled' };

    return <i title={text} className={`fa fa-circle text-${color}`} />;
}

export default KeyStatusCircle;

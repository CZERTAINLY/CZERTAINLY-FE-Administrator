interface Props {
    active?: boolean;
}

function Spinner({ active = true }: Props) {
    if (!active) return null;

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
                className="animate-spin inline-block size-8 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;

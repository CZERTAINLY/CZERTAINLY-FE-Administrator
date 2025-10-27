import cn from 'classnames';
import { Link } from 'react-router';

interface Props {
    items: {
        label: string;
        href?: string;
    }[];
}

function Breadcrumb({ items }: Props) {
    return (
        <ol className="flex items-center whitespace-nowrap mb-4 md:mb-8">
            {items.map((item, index) => (
                <li
                    key={index}
                    className={cn('inline-flex items-center', { 'text-gray-400 dark:text-neutral-600': index < items.length - 1 })}
                >
                    {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                    {index < items.length - 1 && (
                        <svg
                            className="shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"></path>
                        </svg>
                    )}
                </li>
            ))}
        </ol>
    );
}

export default Breadcrumb;

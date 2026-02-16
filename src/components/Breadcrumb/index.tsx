import cn from 'classnames';
import { Link } from 'react-router';

interface Props {
    items: {
        label: string;
        href?: string;
    }[];
    title?: string;
}

function Breadcrumb({ items, title: titleProp }: Props) {
    const title = titleProp || items[items.length - 1]?.label || '';
    return (
        <div className="mb-4 md:mb-8">
            <ol className="flex items-center whitespace-nowrap">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={cn('inline-flex items-center text-sm', {
                            'text-gray-700 dark:text-neutral-600': index < items.length - 1,
                        })}
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
                                <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
                            </svg>
                        )}
                    </li>
                ))}
            </ol>
            {title && <h1 className="text-2xl font-semibold mt-4 md:mt-8">{title}</h1>}
        </div>
    );
}

export default Breadcrumb;

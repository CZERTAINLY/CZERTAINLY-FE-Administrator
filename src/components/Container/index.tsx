import cn from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
    marginTop?: boolean;
    gap?: number;
}

function Container({ children, className, marginTop, gap }: Props) {
    const gapClass = gap ? `gap-${gap}` : 'gap-4 md:gap-8';
    return <div className={cn('flex flex-col', className, gapClass, { 'mt-4 md:mt-8': marginTop })}>{children}</div>;
}

export default Container;

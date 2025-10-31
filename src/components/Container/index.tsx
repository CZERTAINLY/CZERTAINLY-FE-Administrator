import cn from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
    marginTop?: boolean;
}

function Container({ children, className, marginTop }: Props) {
    return <div className={cn('flex flex-col gap-4 md:gap-8', marginTop && 'mt-4 md:mt-8', className)}>{children}</div>;
}

export default Container;

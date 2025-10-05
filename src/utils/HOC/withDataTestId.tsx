import { components, ControlProps, MenuProps } from 'react-select';

function withDataTestId<T extends { innerProps?: any }>(Component: React.ComponentType<T>, testId: string) {
    return (props: T) => <Component {...props} innerProps={{ ...props.innerProps, 'data-testid': testId }} />;
}

const TestableMenu = (testId: string) => withDataTestId<MenuProps<any, false>>(components.Menu, testId);
const TestableControl = (testId: string) => withDataTestId<ControlProps<any, false>>(components.Control, testId);

export { TestableMenu, TestableControl };

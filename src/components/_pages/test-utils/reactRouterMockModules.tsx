const Link = ({ to, children }: any) => <a href={to}>{children}</a>;

export const listRouterMockModule = {
    Link,
};

export const secretDetailRouterMockModule = {
    Link,
    useParams: () => ({ id: 'sec-1' }),
};

export const vaultProfileDetailRouterMockModule = {
    Link,
    useParams: () => ({ vaultUuid: 'vault-1', id: 'vp-1' }),
};

import LinksGroup from "./LinksGroup";
import style from "./Sidebar.module.scss";

export default function Sidebar() {
    return (
        <nav className={style.root}>
            <div className={style.nav}>
                <ul>
                    <LinksGroup _key="/dashboard" header="Dashboard" headerLink="/dashboard" />
                    <LinksGroup _key="/certificates" header="Certificates" headerLink="/certificates" />
                    <LinksGroup _key="/cryptographickeys" header="Keys" headerLink="/cryptographickeys" />
                    <LinksGroup _key="/discovery" header="Discoveries" headerLink="/discoveries" />
                    <LinksGroup _key="/connectors" header="Connectors" headerLink="/connectors" />

                    <LinksGroup
                        _key="accessControl"
                        header="Access Control"
                        childrenLinks={[
                            { _key: "/users", name: "Users", link: "/users" },
                            { _key: "/roles", name: "Roles", link: "/roles" },
                        ]}
                    />

                    <LinksGroup
                        _key="profiles"
                        header="Profiles"
                        childrenLinks={[
                            { _key: "/raprofiles", name: "RA Profiles", link: "/raprofiles" },
                            { _key: "/tokenprofiles", name: "Token Profiles", link: "/tokenprofiles" },
                            { _key: "/complianceprofiles", name: "Compliance Profiles", link: "/complianceprofiles" },
                        ]}
                    />

                    <LinksGroup
                        _key="inventory"
                        header="Inventory"
                        childrenLinks={[
                            { _key: "/credentials", name: "Credentials", link: "/credentials" },
                            { _key: "/authorities", name: "Authorities", link: "/authorities" },
                            { _key: "/tokens", name: "Tokens", link: "/tokens" },
                            { _key: "/groups", name: "Groups", link: "/groups" },
                            { _key: "/entities", name: "Entities", link: "/entities" },
                            { _key: "/locations", name: "Locations", link: "/locations" },
                        ]}
                    />

                    <LinksGroup
                        _key="protocols"
                        header="Protocols"
                        childrenLinks={[
                            { _key: "/acmeaccounts", name: "ACME Accounts", link: "/acmeaccounts" },
                            { _key: "/acmeprofiles", name: "ACME Profiles", link: "/acmeprofiles" },
                            { _key: "/scepprofiles", name: "SCEP Profiles", link: "/scepprofiles" },
                        ]}
                    />

                    <LinksGroup
                        _key="settings"
                        header="Settings"
                        childrenLinks={[
                            { _key: "/platform", name: "Platform", link: "/platform" },
                            { _key: "/customattributes", name: "Custom Attributes", link: "/customattributes" },
                            { _key: "/globalmetadata", name: "Global Metadata", link: "/globalmetadata" },
                        ]}
                    />

                    <LinksGroup _key="/audit" header="Audit Logs" headerLink="/audit" />
                </ul>
            </div>
        </nav>
    );
}

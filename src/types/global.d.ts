type Env = {
    BASE_URL: string;
    API_URL: string;
    LOGIN_URL: string;
    LOGOUT_URL: string;
};

interface Window {
    readonly __ENV__: Env;
}

declare const __ENV__: Env;

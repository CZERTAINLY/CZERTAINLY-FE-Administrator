import { createBrowserHistory } from "history";

const history = createBrowserHistory({basename: (window as any).__ENV__.BASE_URL});

export default history;
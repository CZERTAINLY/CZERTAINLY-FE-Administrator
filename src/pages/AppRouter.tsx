import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/app" element={<App />} />

                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

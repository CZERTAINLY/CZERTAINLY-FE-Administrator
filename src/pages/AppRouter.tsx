import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./home";

export const AppRouter = () => {
    return (
        <BrowserRouter basename={(window as any).__ENV__.BASE_URL}>
            <Routes>
                <Route path="/" element={<Navigate to="/app/home" />} />
                <Route path="/app" element={<Navigate to="/app/home" />} />
                <Route path="/app/home" element={<Home />} />

                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

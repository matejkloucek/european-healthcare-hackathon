import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./theme/theme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <ThemeProvider theme={createTheme(appTheme)}>
        <CssBaseline>
            <App />
        </CssBaseline>
    </ThemeProvider>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import store from "./store";
import App from "./App.jsx";
import "./index.css";

// setup fake backend
import { fakeBackend } from "./services";
fakeBackend();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

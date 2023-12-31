import { ColorModeScript } from "@chakra-ui/react";
import { persistor, store } from "lib/config/store.config";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingText } from "core/components/loading";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <ColorModeScript />
    <BrowserRouter>
      <PersistGate loading={<LoadingText />} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

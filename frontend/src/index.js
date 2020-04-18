import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "./Context";

//Adds dismiss button button to snackbars
const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};
/**
 * Snackbar provider is a wrapper class that provides the option to add snackbars to the UI easily.
 */
ReactDOM.render(
  <SnackbarProvider
    maxSnack={1}
    ref={notistackRef}
    action={(key) => (
      <IconButton onClick={onClickDismiss(key)}>
        <CloseOutlinedIcon />
      </IconButton>
    )}
  >
    <Provider>
      <App />
    </Provider>
  </SnackbarProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

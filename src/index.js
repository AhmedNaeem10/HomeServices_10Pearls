import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './config/firebase-config';
import './firebase';
import { Provider } from 'react-redux'
import store from "./redux/store";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />

      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
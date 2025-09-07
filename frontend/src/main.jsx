
import { Provider } from 'react-redux';
import store from './store';
import ReactDOM from 'react-dom'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

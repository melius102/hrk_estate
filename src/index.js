// import 'reset-css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import 'normalize.css';
import './scss/style.scss';

import { getList } from './lib/util';
import App from './containers/app';
import reducers from './reducers';

const clog = console.log;
const initCode = '0000000000';

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(reducers, enhancer);

window.onload = () => {
    getList(1, initCode).then(data => {
        ReactDOM.render(<Provider store={store}>
            <App mapCode={initCode} regCode={initCode} province={data} />
        </Provider>, document.getElementById("root"));
    });
};

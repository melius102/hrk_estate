// import 'reset-css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import 'normalize.css';
import './scss/style.scss';

import { getList, nullCode } from './lib/util';
import App from './containers/app';
import reducers from './reducers';
import tmpMiddleware from './lib/tmp-middleware';

const clog = console.log;

// const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
// const enhancer = applyMiddleware(tmpMiddleware, ReduxThunk);
const enhancer = applyMiddleware(ReduxThunk);
const store = createStore(reducers, enhancer);

window.onload = () => {
    getList(1, nullCode).then(data => {
        ReactDOM.render(<Provider store={store}>
            <App province={data} />
        </Provider>, document.getElementById("root"));
    });
};

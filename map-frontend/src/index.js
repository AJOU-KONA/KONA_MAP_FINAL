import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer, {rootSaga} from "./modules";
import createSagaMiddleware from 'redux-saga';
import {tempSetUser, check} from "./modules/user";
import {HelmetProvider} from 'react-helmet-async';
import {Provider as AlertProvider} from 'react-alert';
import AlertTemplate from "react-alert-template-basic";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser(history) {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            return;
        }

        store.dispatch(tempSetUser(user));
        store.dispatch(check());
    } catch (e) {
        console.log('로컬 스토리지 작동 x');
    }
}

sagaMiddleware.run(rootSaga);
loadUser();

const options = {
    position: 'bottom right',
    timeout: 5000,
    offset: '30px',
    transition: 'scale'
};

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <HelmetProvider>
                <AlertProvider template={AlertTemplate} {...options}>
                    <App/>
                </AlertProvider>
            </HelmetProvider>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

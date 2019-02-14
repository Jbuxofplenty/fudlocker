import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import { App } from './App';

import Firebase, { FirebaseContext }  from './_firebase';
render(
    <Provider context={FirebaseContext} store={store} >
        <FirebaseContext.Provider value={new Firebase()} >
            <App />
        </FirebaseContext.Provider>
    </Provider>,
    document.getElementById('app')
);
module.hot.accept();
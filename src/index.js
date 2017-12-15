import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import rootReducer from './ducks/rootReducer';
// import registerServiceWorker from './registerServiceWorker';

const extension = window.devToolsExtension ? window.devToolsExtension() : f => f;
const store = createStore(rootReducer, compose(applyMiddleware(reduxThunk), extension));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

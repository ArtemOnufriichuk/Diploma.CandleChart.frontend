import React from 'react';
import ReactDOM from 'react-dom';

import './styles/Main.scss';
import './styles/App.scss';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root'),
);

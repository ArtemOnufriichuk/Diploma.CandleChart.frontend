import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SocketIo } from './utils/ConnectSocket';

import HomePage from './pages/HomePage';
import LoginRegisterModal from './components/LoginRegisterModal';

import ChartPage from './pages/ChartPage';
import ConfirmPage from './pages/ConfirmPage';
import ResetPage from './pages/ResetPage';

import AdminCabinet from './pages/AdminCabinet';
import AdminAuth from './pages/AdminAuth';

import AppContext from './utils/Context';

function App() {
	const [logModalOpen, setLogModalOpen] = useState(false);
	const [regModalOpen, setRegModalOpen] = useState(false);

	useEffect(() => {
		SocketIo();
	}, []);

	return (
		<AppContext.Provider value={{ logModalOpen, regModalOpen, setLogModalOpen, setRegModalOpen }}>
			<Switch>
				<Route exact path='/admin-auth'>
					<AdminAuth />
				</Route>

				<Route exact path='/admin-cabinet'>
					<AdminCabinet />
				</Route>

				<Route exact path='/chart'>
					<ChartPage />
				</Route>

				<Route path='/'>
					<>
						<Switch>
							<Route exact path='/' render={() => <HomePage />} />
							<Route path='/confirm' render={() => <ConfirmPage />} />
							<Route path='/reset' render={() => <ResetPage />} />
						</Switch>
						<LoginRegisterModal />
					</>
				</Route>
			</Switch>
		</AppContext.Provider>
	);
}

export default App;

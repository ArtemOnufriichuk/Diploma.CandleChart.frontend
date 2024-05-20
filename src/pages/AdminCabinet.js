import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import '../styles/Admin.scss';

import AdminUsers from '../components/AdminPage/AdminUsers';
import AdminUserManipulation from '../components/AdminPage/AdminUserManipulation';
import DepositPreparation from '../components/AdminPage/DepositPreparation';
import BTCWalletChange from '../components/AdminPage/BTCWalletChange';

function AdminCabinet() {
	const history = useHistory();
	const [tab, setTab] = useState('');

	useEffect(() => {
		if (!localStorage.getItem('token__admin')) {
			history.push('/admin-auth');
		}

		setTab(localStorage.getItem('ADMIN_TAB') || '1');
		return () => {
			localStorage.setItem('ADMIN_TAB', '1');
		};
		//eslint-disable-next-line
	}, []);

	const setTabHandler = (tab) => {
		localStorage.setItem('ADMIN_TAB', tab);
		setTab(tab);
	};

	const exitHandler = () => {
		localStorage.removeItem('token__admin');
		history.push('/admin-auth');
	};

	const copyIdHandler = (id) => {
		const aux = document.createElement('input');
		aux.setAttribute('value', id);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand('copy');
		document.body.removeChild(aux);
	};

	const menu = [
		{ key: '1', name: 'Users' },
		{ key: '2', name: 'User manipulation' },
		{ key: '3', name: 'Deposit preparations' },
		{ key: '4', name: 'BTC wallet' },
	];

	const MenuItem = (key, name) => (
		<div onClick={() => setTabHandler(key)} className={`nav-link ${tab === key && 'active'}`}>
			{name}
		</div>
	);

	return (
		<div className='cabinet'>
			<div className='cabinet-sidebar'>
				<div className='nav'>
					{menu.map((el) => MenuItem(el.key, el.name))}

					<div onClick={exitHandler} className={`nav-link exit`}>
						Exit
					</div>
				</div>
			</div>
			<div className='cabinet-content'>
				{tab === '1' && <AdminUsers copyIdHandler={copyIdHandler} />}
				{tab === '2' && <AdminUserManipulation copyIdHandler={copyIdHandler} />}
				{tab === '3' && <DepositPreparation copyIdHandler={copyIdHandler} />}
				{tab === '4' && <BTCWalletChange />}
			</div>
		</div>
	);
}

export default AdminCabinet;

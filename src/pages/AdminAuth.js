import React, { useRef } from 'react';
import { useHistory } from 'react-router';
import '../styles/Admin.scss';
import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';

function AdminAuth() {
	const form = useRef(null);
	const history = useHistory();

	const formSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`${process.env.REACT_APP_BACK_LINK}/users/auth`, {
				email: e.target.username.value,
				password: e.target.password.value,
				isAdmin: true,
			})
			.then(({ data }) => {
				localStorage.setItem('token__admin', data.data.token);
				history.push('/admin-cabinet');
			})
			.catch(errorHandler);
	};

	return (
		<div className='admin-login'>
			<form onSubmit={formSubmit} ref={form} className='admin-form'>
				<div className='form-row'>
					<label htmlFor='username'>Username</label>
					<input id='username' type='text' />
				</div>
				<div className='form-row'>
					<label htmlFor='password'>Password</label>
					<input id='password' type='text' />
				</div>
				<button className='main-button' type='submit'>
					Submit
				</button>
			</form>
		</div>
	);
}

export default AdminAuth;

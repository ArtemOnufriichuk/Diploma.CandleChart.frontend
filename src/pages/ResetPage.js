import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router';
import { errorHandler } from '../utils/errorHandler';

function ResetPage() {
	const history = useHistory();

	const resetPasswordSubmit = (e) => {
		e.preventDefault();
		const url = new URL(document.location.href);
		const emailToken = url.pathname.slice('/reset/'.length);

		const pass1 = e.target.pass1.value;
		const pass2 = e.target.pass2.value;

		if (pass1 !== pass2) {
			alert('Passwords not match');
			e.target.pass1.value = '';
			e.target.pass2.value = '';
			return;
		}

		axios
			.patch(`${process.env.REACT_APP_BACK_LINK}/users/password/${emailToken}`, {
				password: e.target.pass1.value,
			})
			.then(({ data }) => {
				console.log(data.data);
				e.target.pass1.value = '';
				e.target.pass2.value = '';
				alert('Пароль успешно изменен');
				setTimeout(() => {
					history.push('/');
				}, 10000);
			})
			.catch(errorHandler);
	};

	return (
		<div className='admin-login' style={{ minHeight: '500px' }}>
			<form onSubmit={resetPasswordSubmit} className='admin-form'>
				<p className='pop-up-log-in__title'>Восстановление пароля</p>
				<div className='form-row'>
					<label htmlFor='input-log-in2'>Новый пароль*</label>
					<input id='input-log-in2' type='password' name='pass1' required />
				</div>
				<div className='form-row'>
					<label htmlFor='input-log-in2'>Повторите пароль*</label>
					<input id='input-log-in2' type='password' name='pass2' required />
				</div>
				<button className='main-button' type='submit'>
					Отправить
				</button>
				<p>* Заполните все поля</p>
			</form>
		</div>
	);
}

export default ResetPage;

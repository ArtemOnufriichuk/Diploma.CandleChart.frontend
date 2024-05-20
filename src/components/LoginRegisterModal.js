import React, { useContext, useState } from 'react';
import AppContext from '../utils/Context';
import { useHistory } from 'react-router';
import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';

function LoginRegisterModal() {
	const { logModalOpen, regModalOpen, setLogModalOpen, setRegModalOpen } = useContext(AppContext);
	const history = useHistory();
	const [resetModal, setResetModal] = useState(false);

	const loginHandler = (e) => {
		e.preventDefault();
		axios
			.post(`${process.env.REACT_APP_BACK_LINK}/users/auth`, {
				email: e.target.email.value,
				password: e.target.password.value,
			})
			.then(({ data }) => {
				console.log(data.data);
				localStorage.setItem('token', data.data.token);
				history.push('/chart');
			})
			.catch(errorHandler);
	};

	const registerHandler = (e) => {
		e.preventDefault();
		axios
			.post(`${process.env.REACT_APP_BACK_LINK}/users`, {
				name: e.target.name.value,
				email: e.target.email.value,
				password: e.target.password.value,
			})
			.then(({ data }) => {
				console.log(data.data);
				alert('Зайдите на свою почту и подтвердите e-mail');
				setRegModalOpen(false);
			})
			.catch(errorHandler);
	};

	const resetPasswordSubmit = (e) => {
		e.preventDefault();
		axios
			.patch(`${process.env.REACT_APP_BACK_LINK}/users/reset`, {
				email: e.target.email.value,
			})
			.then(({ data }) => {
				console.log(data.data);
				alert('Зайдите на свою почту и перейдите по ссылке');
				setResetModal(false);
			})
			.catch(errorHandler);
	};

	const resetModalHandler = () => {
		setLogModalOpen(false);
		setResetModal(true);
	};

	return (
		<>
			<div className={`overlay ${logModalOpen && 'active'}`}>
				<form onSubmit={loginHandler} className='pop-up admin-form'>
					<div className='pop-up__close' onClick={() => setLogModalOpen(false)} />

					<p className='pop-up__title'>Вход</p>

					<div className='form-row'>
						<label>E-mail*</label>
						<input type='text' name='email' required />
					</div>
					<div className='form-row'>
						<label>Пароль*</label>
						<input type='password' name='password' required />
					</div>

					<div onClick={resetModalHandler} className='pop-up-log-in__link  p-open' data-id-popup='recovery-pass'>
						Восстановить пароль
					</div>

					<button className='btn orange' type='submit'>
						Войти
					</button>
					<p>* Заполните все поля</p>
				</form>
			</div>

			<div className={`dev_reg overlay ${regModalOpen && 'active'}`}>
				<form onSubmit={registerHandler} className='pop-up admin-form'>
					<div className='pop-up__close' onClick={() => setRegModalOpen(false)} />

					<p className='pop-up__title'>Регистрация</p>

					<div className='form-row'>
						<label>Ваше имя*</label>
						<input type='text' name='name' required defaultValue='' />
					</div>
					<div className='form-row'>
						<label>E-mail*</label>
						<input type='text' name='email' required defaultValue='' />
					</div>
					<div className='form-row'>
						<label>Пароль*</label>
						<input type='password' name='password' required />
					</div>

					<button className='btn orange' type='submit'>
						Отправить
					</button>
					<p>* Заполните все поля</p>
				</form>
			</div>

			<div className={`overlay ${resetModal && 'active'}`}>
				<form onSubmit={resetPasswordSubmit} className='pop-up admin-form'>
					<div className='pop-up__close' onClick={() => setResetModal(false)} />

					<p className='pop-up__title'>Восстановление пароля</p>

					<div className='form-row'>
						<label>E-mail*</label>
						<input type='text' name='email' required />
					</div>

					<button className='btn orange' type='submit'>
						Отправить
					</button>
					<p>* Заполните все поля</p>
				</form>
			</div>
		</>
	);
}

export default LoginRegisterModal;

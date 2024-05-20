import React, { useContext } from 'react';
import AppContext from '../utils/Context';

function HomePage() {
	const { setRegModalOpen, setLogModalOpen } = useContext(AppContext);

	return (
		<div className='container-login'>
			<div className='btn orange login' onClick={() => setRegModalOpen(true)}>
				Регистрация
			</div>
			<div className='btn black login' onClick={() => setLogModalOpen(true)}>
				Войти
			</div>
		</div>
	);
}

export default HomePage;

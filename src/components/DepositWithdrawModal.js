import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';

const DepositWithdrawModal = ({ BTCWallet, depositModal, setDepositModal, withdrawModal, setWithdrawModal }) => {
	const withdrawWallet = BTCWallet ? BTCWallet : '1FgQg8k8egFegCTgncUwWWkGSmMMjcCCQr11';

	const copyIdHandler = (id) => {
		const aux = document.createElement('input');
		aux.setAttribute('value', id);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand('copy');
		document.body.removeChild(aux);
	};

	const depositHandler = (e) => {
		e.preventDefault();
		axios
			.post(
				`${process.env.REACT_APP_BACK_LINK}/deposit`,
				{ amount: Number(e.target.amount.value) },
				{
					headers: { authorization: localStorage.getItem('token') },
				},
			)
			.then(() => {
				alert('Preparation created successfully');
				setDepositModal(false);
			})
			.catch(errorHandler);
	};

	const withdrawHandler = (e) => {
		e.preventDefault();
		axios
			.post(
				`${process.env.REACT_APP_BACK_LINK}/withdraw`,
				{
					amount: Number(e.target.amount.value),
					wallet: e.target.amount.value,
				},
				{
					headers: { authorization: localStorage.getItem('token') },
				},
			)
			.then(() => {
				alert('Withdraw request created successfully');
				setWithdrawModal(false);
			})
			.catch(errorHandler);
	};

	if (depositModal) {
		return (
			<div className={`modal-overlay overlay--active`}>
				<div className='modal-box'>
					<div onClick={() => setDepositModal(false)} className='modal-box__close'>
						X
					</div>
					<h1>Prepare deposit</h1>

					<div style={{ marginTop: '10px' }}>
						Account wallet:
						<span onClick={() => copyIdHandler(withdrawWallet)} style={{ marginLeft: '6px', cursor: 'pointer' }}>
							{withdrawWallet}
							<img src='https://img.icons8.com/windows/20/000000/duplicate.png' alt='copy' />
						</span>
					</div>

					<form onSubmit={depositHandler} style={{ width: '100%' }} className='admin-form'>
						<div style={{ marginTop: '15px' }} className='form-row'>
							<label htmlFor='amount'>Amount*</label>
							<input name='amount' type='number' placeholder='Deposit amount' required />
						</div>
						<button className='main-button' type='submit'>
							Create preparation
						</button>
						<p>* Заполните все поля</p>
					</form>
				</div>
			</div>
		);
	}

	if (withdrawModal) {
		return (
			<div className={`modal-overlay overlay--active`}>
				<div className='modal-box'>
					<div onClick={() => setWithdrawModal(false)} className='modal-box__close'>
						X
					</div>
					<h1>Withdraw money</h1>

					<form onSubmit={withdrawHandler} style={{ width: '100%' }} className='admin-form'>
						<div style={{ marginTop: '15px' }} className='form-row'>
							<label htmlFor='wallet'>Your BTC wallet*</label>
							<input id='wallet' type='text' required />
						</div>
						<div style={{ marginTop: '15px' }} className='form-row'>
							<label htmlFor='amount'>Amount*</label>
							<input id='amount' type='text' required />
						</div>
						<button className='main-button' type='submit'>
							Withdraw
						</button>
						<p>* Заполните все поля</p>
					</form>
				</div>
			</div>
		);
	}

	return null;
};

export default DepositWithdrawModal;

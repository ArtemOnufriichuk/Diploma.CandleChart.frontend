import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { errorHandler } from '../../utils/errorHandler';

function BTCWalletChange() {
	const [BTCWallet, setBTCWallet] = useState(null);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/btcwallet`)
			.then(({ data }) => {
				if (data.data.btcWallet === '') {
					setBTCWallet(null);
				} else {
					setBTCWallet(data.data.btcWallet);
				}
			})
			.catch(errorHandler);
	}, []);

	const formSubmit = (e) => {
		e.preventDefault();
		axios
			.put(
				`${process.env.REACT_APP_BACK_LINK}/btcWallet`,
				{ btcWallet: e.target.wallet.value },
				{
					headers: { authorization: localStorage.getItem('token__admin') },
				},
			)
			.then(() => {
				alert('Successfully changed');
				setBTCWallet(e.target.wallet.value);
			})
			.catch(errorHandler);
	};

	return (
		<section>
			<div className='main_title'>Set BTC wallet</div>

			<form onSubmit={formSubmit} className='search'>
				<input type='text' name='wallet' placeholder='BTC wallet...' defaultValue={BTCWallet ?? ''} />
				<button className='main-button' type='submit'>
					Set
				</button>
			</form>
		</section>
	);
}

export default BTCWalletChange;

import axios from 'axios';
import React, { useState } from 'react';
import { errorHandler } from '../../utils/errorHandler';

const imgStatusStyle = {
	marginLeft: '6px',
	marginTop: '-4px',
	marginRight: '4px',
};
const statusItemStyle = {
	borderBottom: '1px solid #bebebe',
	paddingTop: '20px',
};

function AdminUserManipulation({ copyIdHandler }) {
	const [user, setUser] = useState(null);
	const [preparations, setPreparations] = useState([]);

	const userSubmit = (e) => {
		e.preventDefault();
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/users/${e.target.id.value}`, {
				headers: { authorization: localStorage.getItem('token__admin') },
			})
			.then(({ data }) => {
				setUser(data.data);

				axios
					.get(`${process.env.REACT_APP_BACK_LINK}/deposit/all?user=${data.data.id}`, {
						headers: { authorization: localStorage.getItem('token__admin') },
					})
					.then(({ data }) => {
						setPreparations(data.data);
					})
					.catch(errorHandler);
			})
			.catch(errorHandler);
	};

	const walletSubmit = (e) => {
		e.preventDefault();
		axios
			.patch(
				`${process.env.REACT_APP_BACK_LINK}/users/wallet/${user.id}`,
				{ wallet: Number(e.target.wallet.value).toFixed() },
				{
					headers: { authorization: localStorage.getItem('token__admin') },
				},
			)
			.then(() => {
				alert('Изменено');
			})
			.catch(errorHandler);
	};
	return (
		<section>
			<div className='main_title'>Manipulation</div>

			<form onSubmit={userSubmit} className='search'>
				<input type='text' name='id' placeholder='user id...' />
				<button className='main-button' type='submit'>
					Search
				</button>
			</form>

			{!!user ? (
				<>
					<div className='main_title'>Selected user</div>

					<UserItem user={user} copyIdHandler={copyIdHandler} />

					<form onSubmit={walletSubmit} className='search'>
						<div className='search-title'>Wallet USD:</div>
						<input className='input-little' type='number' name='wallet' defaultValue={Number(user.wallet) || 0} />
						<button className='main-button' type='submit'>
							Save
						</button>
					</form>
				</>
			) : (
				<NotFound />
			)}

			<div className='main_title'>User preparations</div>

			{preparations.length > 0 ? preparations.map((el, i) => <StatusItem key={i} item={el} />) : <NotFound />}
		</section>
	);
}

export const UserItem = ({ user, copyIdHandler }) => (
	<div className='user-item'>
		<div className='id'>
			<span>id:</span> {user.id}
			<span onClick={() => copyIdHandler(user.id)} className='copy'>
				<img src='https://img.icons8.com/windows/20/000000/duplicate.png' alt='copy' />
			</span>
		</div>
		<div>
			<span>name:</span> {user.name}
		</div>
		<div>
			<span>email:</span> {user.email}
		</div>
	</div>
);

export const StatusItem = ({ item }) => (
	<div style={statusItemStyle} className='user-item'>
		<div className='id'>
			<span>Amount:</span> {item.amount}
		</div>
		<div className='id'>
			<span>Status:</span>
			<img
				style={imgStatusStyle}
				src={
					item.status === 'READY'
						? 'https://img.icons8.com/emoji/20/000000/red-circle-emoji.png'
						: 'https://img.icons8.com/emoji/20/000000/green-circle-emoji.png'
				}
				alt='status'
			/>
			{item.status === 'READY' ? 'NOT PAYED' : item.status}
		</div>
	</div>
);

export const NotFound = () => <div className='main_title'>Not found</div>;

export default AdminUserManipulation;

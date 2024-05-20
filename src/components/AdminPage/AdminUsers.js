import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { errorHandler } from '../../utils/errorHandler';

function AdminUsers({ copyIdHandler }) {
	const [users, setUsers] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const inputRef = useRef(null);

	const getUsers = () => {
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/users`, {
				headers: { authorization: localStorage.getItem('token__admin') },
			})
			.then(({ data }) => {
				setUsers(data.data);
			})
			.catch(errorHandler);
	};

	const allUsersSubmit = (e) => {
		e.preventDefault();
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/users?filter=(name=~${searchValue},email=~${searchValue})`, {
				headers: { authorization: localStorage.getItem('token__admin') },
			})
			.then(({ data }) => {
				console.log(data.data);
				setUsers(data.data);
			})
			.catch((e) => {
				setUsers([]);
				errorHandler(e);
			});
	};

	const resetSearchValue = () => {
		inputRef.current.value = '';
		setSearchValue('');
		getUsers();
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<section>
			<div className='main_title'>Users</div>
			<form onSubmit={allUsersSubmit} className='search reset'>
				<input ref={inputRef} onChange={(e) => setSearchValue(e.target.value)} type='text' name='search' placeholder='type email or name...' />
				{searchValue.length > 0 && (
					<div onClick={resetSearchValue} className='search-reset'>
						x
					</div>
				)}
				<button className='main-button' type='submit'>
					Search
				</button>
			</form>
			<div className='users'>
				{users.length > 0 ? (
					users.map(({ id, name, email, wallet }) => (
						<div key={id} className='users-item'>
							<div className='id'>
								<span>id:</span> {id}
								<span onClick={() => copyIdHandler(id)} className='copy'>
									<img src='https://img.icons8.com/windows/20/000000/duplicate.png' alt='copy' />
								</span>
							</div>
							<div className=''>
								<span>name:</span> {name}
							</div>
							<div className=''>
								<span>email:</span> {email}
							</div>
							<div className='wallet'>
								<span>wallet:</span> {wallet}
							</div>
						</div>
					))
				) : (
					<div className='main_title'>Not found</div>
				)}
			</div>
		</section>
	);
}

export default AdminUsers;

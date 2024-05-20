import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { errorHandler } from '../../utils/errorHandler';

const imgStatusStyle = {
	marginLeft: '6px',
	marginTop: '-4px',
};
const statusItemStyle = {
	borderBottom: '1px solid #bebebe',
	paddingTop: '20px',
};

function DepositPreparation({ copyIdHandler }) {
	const [preparations, setPreparations] = useState([]);
	const statusSelect = useRef(null);
	const getAllPreparations = () => {
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/deposit/all`, {
				headers: { authorization: localStorage.getItem('token__admin') },
			})
			.then(({ data }) => {
				setPreparations(data.data);
			})
			.catch(errorHandler);
	};

	const statusSelectHandler = (e, el) => {
		if (el.status !== e.target.value) {
			e.target.parentNode.children[3].classList.add('active');
		} else {
			e.target.parentNode.children[3].classList.remove('active');
		}
	};

	const statusButtonHandler = (e, el) => {
		const path = e.target;
		const statusValue = path.parentNode.children[2].value;
		axios
			.put(
				`${process.env.REACT_APP_BACK_LINK}/deposit/${el.id}`,
				{ status: statusValue },
				{
					headers: { authorization: localStorage.getItem('token__admin') },
				},
			)
			.then(() => {
				setPreparations([]);
				alert('Successfully changed');
			})
			.then(() => {
				getAllPreparations();
			})
			.catch(errorHandler);
	};

	useEffect(() => {
		getAllPreparations();
	}, []);

	return (
		<section>
			<div className='main_title'>Deposit preparations</div>

			{preparations.length > 0 ? (
				preparations.map((el, i) => (
					<div key={i} style={statusItemStyle} className='user-item'>
						<div className='id'>
							<span>User id:</span> {el.user.id}
							<span onClick={() => copyIdHandler(el.user.id)} className='copy'>
								<img src='https://img.icons8.com/windows/20/000000/duplicate.png' alt='copy' />
							</span>
						</div>
						<div className='id'>
							<span>Valid till:</span> {moment(el.validTo).format('YY.MM.DD HH:MM')}
						</div>
						<div className='id'>
							<span>Amount:</span> {el.amount}
						</div>
						<div className='id'>
							<span>Status:</span>
							<img
								style={imgStatusStyle}
								src={
									el.status === 'READY'
										? 'https://img.icons8.com/emoji/20/000000/red-circle-emoji.png'
										: 'https://img.icons8.com/emoji/20/000000/green-circle-emoji.png'
								}
								alt='status'
							/>
							<select ref={statusSelect} onChange={(e) => statusSelectHandler(e, el)} defaultValue={el.status} name='type'>
								<option value='READY'>Not payed</option>
								<option value='PAYED'>Payed</option>
							</select>
							<button className='status-button' onClick={(e) => statusButtonHandler(e, el)}>
								OK
							</button>
						</div>
					</div>
				))
			) : (
				<div className='main_title'>Not found</div>
			)}
		</section>
	);
}

export default DepositPreparation;

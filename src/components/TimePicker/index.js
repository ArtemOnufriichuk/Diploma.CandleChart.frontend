import React, { useEffect, useState } from 'react';
import moment from 'moment';
import TimeCounter from '../TimeCounter';

function TimePicker({ currentBetTime, setCurrentBetTime }) {
	const [pickerMenu, setPickerMenu] = useState(false);
	const [pickerActiveHour, setPickerActiveHour] = useState(null);
	const [pickerActiveMinute, setPickerActiveMinute] = useState(null);
	const hh = moment().format('HH');
	const mm = moment().format('mm');
	const minutesAll = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
	const hoursAll = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	useEffect(() => {
		const closeTimePicker = (e) => {
			const target = e.target.classList;
			if (target.contains('picker') || target.contains('picker-open')) {
				setPickerMenu(true);
			} else {
				setPickerMenu(false);
			}
		};
		document.body.addEventListener('click', closeTimePicker);
		return () => {
			document.body.removeEventListener('click', closeTimePicker);
		};
	}, []);

	useEffect(() => {
		for (let index = 0; index < hoursAll.length; index++) {
			const element = hoursAll[index];
			const timeArr = currentBetTime.split(':');

			if (hoursAll[index - 1] === +hh) {
				break;
			}

			if (+mm > 55) {
				setCurrentBetTime(`${element + 1}:00`);
				setPickerActiveHour(element + 1);
				break;
			} else if (element < +hh) {
				setCurrentBetTime(`${element}:${timeArr[1]}`);
				setPickerActiveHour(hh);
			} else if (element >= +hh) {
				setCurrentBetTime(`${element}:${timeArr[1]}`);
				setPickerActiveHour(element);
			}
		}
		//eslint-disable-next-line
	}, [hh]);

	useEffect(() => {
		for (let index = 0; index < minutesAll.length; index++) {
			const element = minutesAll[index];
			const timeArr = currentBetTime.split(':');

			if (minutesAll[index - 1] > +mm) {
				break;
			}

			if (+mm > 55) {
				setCurrentBetTime(`${+hh + 1}:0${minutesAll[index]}`);
				setPickerActiveHour(+hh + 1);
				break;
			} else if (element > +mm) {
				setCurrentBetTime(`${timeArr[0]}:${element < 10 ? `0${+element}` : element}`);
				setPickerActiveMinute(element);
			} else {
				setCurrentBetTime(`${timeArr[0]}:0${minutesAll[0]}`);
				setPickerActiveMinute(minutesAll[0]);
			}
		}
		//eslint-disable-next-line
	}, [mm]);

	const setHour = (num) => {
		const timeArr = currentBetTime.split(':');
		setCurrentBetTime(`${num < 10 ? `0${num}` : num}:${timeArr[1]}`);
		setPickerActiveHour(num);
	};
	const setMinute = (num) => {
		const timeArr = currentBetTime.split(':');
		setCurrentBetTime(`${timeArr[0]}:${num < 10 ? `0${num}` : num}`);
		setPickerActiveMinute(num);
	};

	const decrementTime = () => {
		const oldHourId = hoursAll.indexOf(pickerActiveHour);
		const oldMinuteId = minutesAll.indexOf(pickerActiveMinute);

		if (+mm > 55 && hoursAll[oldHourId] === +hh + 1) {
			if (+hh > hoursAll[oldHourId]) {
				alert('Минимальное время уже выставлено');
				return;
			}
		} else if (+mm <= 55 && hoursAll[oldHourId] <= +hh && minutesAll[oldMinuteId > 0 ? oldMinuteId - 1 : 0] < +mm) {
			alert('Минимальное время уже выставлено');
			return;
		} else if (hoursAll[oldHourId] > +hh && minutesAll[oldMinuteId] < 5) {
			const newMinute = minutesAll[oldMinuteId > minutesAll.length ? oldMinuteId - 1 : minutesAll.length - 1];
			const newHour = hoursAll[oldHourId - 1];
			setPickerActiveHour(newHour);
			setPickerActiveMinute(newMinute);
			setCurrentBetTime(`${newHour < 10 ? `0${newHour}` : newHour}:${newMinute < 10 ? `0${newMinute}` : newMinute}`);
		} else {
			const newMinute = minutesAll[oldMinuteId - 1];
			setPickerActiveMinute(newMinute);
			setCurrentBetTime(`${pickerActiveHour < 10 ? `0${pickerActiveHour}` : pickerActiveHour}:${newMinute < 10 ? `0${newMinute}` : newMinute}`);
		}
	};

	const incrementTime = () => {
		const oldHourId = hoursAll.indexOf(pickerActiveHour);
		const oldMinuteId = minutesAll.indexOf(pickerActiveMinute);

		if (oldHourId === hoursAll.length - 1 && oldMinuteId === minutesAll.length - 1) {
			alert('Дождитесь следующего дня');
			return;
		} else if (oldHourId !== hoursAll.length - 1 && oldMinuteId === minutesAll.length - 1) {
			const newHour = hoursAll[oldHourId + 1];
			const newMinute = minutesAll[0];
			setPickerActiveHour(newHour);
			setPickerActiveMinute(newMinute);
			setCurrentBetTime(`${newHour < 10 ? `0${newHour}` : newHour}:${newMinute < 10 ? `0${newMinute}` : newMinute}`);
		} else {
			const newMinute = minutesAll[oldMinuteId + 1];
			setPickerActiveMinute(newMinute);
			setCurrentBetTime(`${pickerActiveHour < 10 ? `0${pickerActiveHour}` : pickerActiveHour}:${newMinute < 10 ? `0${newMinute}` : newMinute}`);
		}
	};

	return (
		<>
			<div className='time-currency'>
				<div className='picker'>
					<div className='picker-open' onClick={() => setPickerMenu(!pickerMenu)} style={{ textAlign: 'center', width: '65px' }}>
						{currentBetTime}
					</div>
					{pickerMenu && (
						<div className='picker-menu'>
							<div className='picker-menu__hours'>
								<h1>Hour</h1>
								{hoursAll.map((num, i) => (
									<button key={i} className={pickerActiveHour === num ? 'active' : ''} onClick={() => setHour(num)} disabled={num < +hh ? true : false}>
										{num < 10 ? `0${num}` : num}
									</button>
								))}
							</div>
							<div className='picker-menu__minutes'>
								<h1>Minute</h1>
								{minutesAll.map((num, i) => (
									<button
										key={i}
										className={pickerActiveMinute === num ? 'active' : ''}
										onClick={() => setMinute(num)}
										disabled={+mm < 55 && num <= +mm && pickerActiveHour === +hh ? true : false}>
										{num < 10 ? `0${num}` : num}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className='time-counter'>
				<TimeCounter type={'DECREMENT'} decrementTime={decrementTime} incrementTime={incrementTime} />
				<span></span>
				<TimeCounter type={'INCREMENT'} decrementTime={decrementTime} incrementTime={incrementTime} />
			</div>
		</>
	);
}

export default TimePicker;

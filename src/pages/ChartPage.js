import React, { useEffect, useRef, useState } from 'react';
import '../styles/Chart.scss';

import { socket, SocketIo } from '../utils/ConnectSocket';

import DepositWithdrawModal from '../components/DepositWithdrawModal';
import TimePicker from '../components/TimePicker';
import BitCounter from '../components/BitCounter';
import BitButton from '../components/BitButton';

import ChartTypeItem from '../components/ChartTypeItem';

import { SvgUp, SvgDown, SvgExit, SvgSettings, SvgAccount, SvgDeposit, SvgWithdraw } from '../components/Svgs';

import { createChart, CrosshairMode } from 'lightweight-charts';
import moment from 'moment';
import { useHistory } from 'react-router';
import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';

function ChartPage() {
	const history = useHistory();
	const [user, setUser] = useState(null);
	const [menuModal, setMenuModal] = useState(false);

	const chartTypes = [
		{ id: 1, name: 'BNB/USDT', url: 'binance' },
		{ id: 2, name: 'BTC/USDT', url: 'bitcoin' },
		{ id: 3, name: 'DASH/USDT', url: 'dash' },
		{ id: 4, name: 'DOGE/USDT', url: 'dogecoin' },
		{ id: 5, name: 'ETH/USDT', url: 'ethereum' },
		{ id: 6, name: 'LTC/USDT', url: 'litecoin' },
		{ id: 7, name: 'XMR/USDT', url: 'monero' },
		{ id: 8, name: 'BCH/USDT', url: 'bitcoinCash' },
		{ id: 9, name: 'XRP/USDT', url: 'ripple' },
		{ id: 10, name: 'ZEC/USDT', url: 'zcash' },
	];

	const chartContainerRef = useRef(null);
	const chart = useRef(null);
	const resizeObserver = useRef(null);
	const legendRef = useRef(null);

	const rateVal = useRef(null);
	const inputMoney = useRef(null);
	const [inputMoneyValue, setInputMoneyValue] = useState(1);

	const [activeChartType, setActiveChartType] = useState({ id: 1, name: 'BNB/USDT', url: 'binance' });
	const [betsTab, setBetsTab] = useState(1);

	const [currentBetTime, setCurrentBetTime] = useState(`${moment().format('HH:mm')}`);
	const [betPrice, setBetPrice] = useState(null);

	const [candleChartSeries, setCandleChartSeries] = useState(null);
	const [candleVolumeSeries, setCandleVolumeSeries] = useState(null);
	const [BTCWallet, setBTCWallet] = useState(null);

	const [openBets, setOpenBets] = useState([]);
	const [closedBets, setClosedBets] = useState([]);

	const [depositModal, setDepositModal] = useState(false);
	const [withdrawModal, setWithdrawModal] = useState(false);
	const profit = 80;

	const arr = [];
	const arrVolume = [];
	const arrAll = [];
	const arrVolumeAll = [];

	const [stateLoaded, setStateLoaded] = useState(false);
	const [arrPastCandle, setArrPastCandle] = useState([]);
	const [arrPastVolume, setArrPastVolume] = useState([]);

	//-------- Start chart settings
	const setChartSettings = () => {
		chart.current = createChart(chartContainerRef.current, {
			width: chartContainerRef.current.offsetWidth,
			height: chartContainerRef.current.offsetHeight,
			layout: {
				backgroundColor: '#253248',
				textColor: 'rgba(255, 255, 255, 0.9)',
			},
			grid: {
				vertLines: {
					color: '#334158',
				},
				horzLines: {
					color: '#334158',
				},
			},
			crosshair: {
				mode: CrosshairMode.Normal,
			},
			priceScale: {
				borderColor: '#485c7b',
			},
			timeScale: {
				borderColor: '#485c7b',
				rightOffset: 12,
				barSpacing: 3,
				fixRightEdge: true,
				visible: true,
				timeVisible: true,
				secondsVisible: true,
			},
		});

		//-------- Chart candle styles
		const candleSeries = chart.current.addCandlestickSeries({
			upColor: '#4bffb5',
			downColor: '#ff4976',
			borderDownColor: '#ff4976',
			borderUpColor: '#4bffb5',
			wickDownColor: '#ff4976',
			wickUpColor: '#4bffb5',
		});

		//-------- Chart volume styles
		const volumeSeries = chart.current.addHistogramSeries({
			color: '#182233',
			lineWidth: 0.5,
			barSpacing: 3,
			priceFormat: {
				type: 'volume',
			},
			overlay: true,
			scaleMargins: {
				top: 0.9,
				bottom: 0,
			},
		});

		return { candleSeries, volumeSeries };
	};

	//-------- Start chart values
	const setChartValues = (candleSeries, volumeSeries, data) => {
		arrAll.push({
			time: data.time,
			open: data.open,
			high: data.high,
			low: data.low,
			close: data.close,
		});
		arrVolumeAll.push({
			time: data.time,
			value: data.value,
		});

		if (arrAll.length >= 2 && arrAll[arrAll.length - 2].open !== data.open) {
			arr.push(arrAll[arrAll.length - 2]);
			arrVolume.push(arrVolumeAll[arrVolumeAll.length - 2]);

			candleSeries.setData(arr);
			volumeSeries.setData(arrVolume);
		} else {
			candleSeries.setData([
				...arr,
				{
					time: data.time,
					open: data.open,
					high: data.high,
					low: data.low,
					close: data.close,
				},
			]);
			volumeSeries.setData([
				...arrVolume,
				{
					time: data.time,
					value: data.value,
				},
			]);
			rateVal.current.innerText = data.close.toFixed(2);
		}
	};

	//-------- Start page
	useEffect(() => {
		//-------- Return to home page if no user
		const userToken = localStorage.getItem('token');
		if (!userToken) {
			history.push('/');
		}

		//-------- LocalStorage "bet_pair"
		const localStorageBetPair = localStorage.getItem('bet_pair') ? JSON.parse(localStorage.getItem('bet_pair')) : { id: 1, name: 'BNB/USDT', url: 'binance' };
		setActiveChartType(localStorageBetPair);

		//-------- Socket connect
		SocketIo();

		//-------- Set global chars settings and chart items
		const { candleSeries, volumeSeries } = setChartSettings();
		setCandleChartSeries(candleSeries);
		setCandleVolumeSeries(volumeSeries);

		//-------- Set user
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/users/me`, {
				headers: { authorization: userToken },
			})
			.then(({ data }) => {
				setUser(data.data);
			})
			.catch((e) => {
				errorHandler(e);
			});

		//-------- Set BTC wallet
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/btcwallet`)
			.then(({ data }) => {
				if (data.data.btcWallet === '') {
					setBTCWallet(null);
				} else {
					setBTCWallet(data.data.btcWallet);
				}
			})
			.catch((e) => {
				errorHandler(e);
			});

		//-------- Set past series
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/candles?pair=${localStorageBetPair.url}&limit=1440`)
			.then(({ data }) => {
				const pastDataCandles = [];
				const pastDataVolume = [];

				data.data.reverse().map((element) => {
					pastDataCandles.push({
						time: element.time,
						open: element.open,
						high: element.high,
						low: element.low,
						close: element.close,
					});
					pastDataVolume.push({
						time: element.time,
						value: element.value,
					});
				});

				setArrPastCandle(pastDataCandles);
				setArrPastVolume(pastDataVolume);
			})
			.then(() => {
				setStateLoaded(true);
			})
			.catch((e) => {
				errorHandler(e);
			});

		//-------- Set open bets
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/bet?filter=priceClose==\\null&limit=10000`, {
				headers: { authorization: localStorage.getItem('token') },
			})
			.then(({ data }) => {
				const reversedData = data.data.reverse().filter((el) => el.pair === localStorageBetPair.url);
				setOpenBets([...reversedData]);

				//-------- Set price lines
				reversedData.map((el) => {
					const t1 = moment().format('YYYY-MM-DD HH:mm:ss');
					const t2 = moment(el.dateClose).format('YYYY-MM-DD HH:mm:ss');
					const secondsDiff = moment(t2).diff(moment(t1), 'seconds');

					const line = candleSeries.createPriceLine({
						price: el.priceOpen,
						color: el.direction === 'DOWN' ? '#ff7598' : '#a1f8d4',
						lineWidth: 1,
						priceVisible: true,
						alertString: el.direction === 'DOWN' ? 'sell' : 'buy',
					});

					setTimeout(() => {
						candleSeries.removePriceLine(line);
					}, secondsDiff * 1000);
				});
			})
			.catch((e) => {
				errorHandler(e);
			});

		//-------- Set closed bets
		axios
			.get(`${process.env.REACT_APP_BACK_LINK}/bet?filter=priceClose!=\\null&limit=10000`, {
				headers: { authorization: localStorage.getItem('token') },
			})
			.then(({ data }) => {
				const reversedData = data.data.reverse();
				setClosedBets([...reversedData]);
			})
			.catch((e) => {
				errorHandler(e);
			});

		//-------- Socket wallet change event
		socket.on('userWallet', (wallet) => {
			//-------- Set user after wallet change
			axios
				.get(`${process.env.REACT_APP_BACK_LINK}/users/me`, {
					headers: { authorization: userToken },
				})
				.then(({ data }) => {
					setUser(data.data);
				})
				.catch((e) => {
					errorHandler(e);
				});

			//-------- Set BTCWallet after wallet change
			axios
				.get(`${process.env.REACT_APP_BACK_LINK}/btcwallet`)
				.then(({ data }) => {
					if (data.data.btcWallet === '') {
						setBTCWallet(null);
					} else {
						setBTCWallet(data.data.btcWallet);
					}
				})
				.catch((e) => {
					errorHandler(e);
				});

			//-------- Set open bets "wallet change event"
			axios
				.get(`${process.env.REACT_APP_BACK_LINK}/bet?filter=priceClose==\\null&limit=10000`, {
					headers: { authorization: localStorage.getItem('token') },
				})
				.then(({ data }) => {
					const reversedData = data.data.reverse();
					setOpenBets([...reversedData]);
				})
				.catch((e) => {
					errorHandler(e);
				});

			//-------- Set closed bets "wallet change event"
			axios
				.get(`${process.env.REACT_APP_BACK_LINK}/bet?filter=priceClose!=\\null&limit=10000`, {
					headers: { authorization: localStorage.getItem('token') },
				})
				.then(({ data }) => {
					const reversedData = data.data.reverse();
					setClosedBets([...reversedData]);
				})
				.catch((e) => {
					errorHandler(e);
				});
		});

		//-------- Socket reconnect
		socket.on('connect_error', () => {
			console.log('FrontLog: connect_error');
			setTimeout(() => {
				socket.connect();
			}, 10000);
		});
		return () => {
			socket.disconnect();
		};
		//eslint-disable-next-line
	}, []);

	//-------- Data loaded amd pass values in chart
	useEffect(() => {
		const localStorageBetPair = localStorage.getItem('bet_pair') ? JSON.parse(localStorage.getItem('bet_pair')) : { id: 1, name: 'BNB/USDT', url: 'binance' };

		if (stateLoaded && candleChartSeries && candleVolumeSeries) {
			arr.push(...arrPastCandle);
			arrVolume.push(...arrPastVolume);

			candleChartSeries.setData(arr);
			candleVolumeSeries.setData(arrVolume);

			chart.current.subscribeCrosshairMove((param) => {
				if (param.time) {
					const ohlc = param.seriesPrices.get(candleChartSeries);
					const volume = param.seriesPrices.get(candleVolumeSeries);
					if (legendRef.current) {
						legendRef.current.innerHTML = `${activeChartType && activeChartType.name}  ОТКР: ${ohlc.open}  МАКС: ${ohlc.high}  МИН: ${ohlc.low}  ЗАКР: ${
							ohlc.close
						}  (${-(100 - ohlc.close / (ohlc.open / 100)).toFixed(4)} %) <br/> Объём: ${volume && volume.toFixed(2)}`;
					}
				}
			});

			socket.on('sendPrice', (dataRaw) => {
				let data = dataRaw[localStorageBetPair.url];
				setBetPrice(data.close);
				setChartValues(candleChartSeries, candleVolumeSeries, data);
			});
		}
		//eslint-disable-next-line
	}, [stateLoaded]);

	//----- Resize chart on container resizes.
	useEffect(() => {
		resizeObserver.current = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			chart.current?.applyOptions({ width, height });
			setTimeout(() => {
				chart.current?.timeScale().fitContent();
			}, 0);
		});
		resizeObserver.current.observe(chartContainerRef.current);
		return () => resizeObserver.current.disconnect();
	}, []);

	//----- Input money Changes
	const decrementMoney = () => {
		if (inputMoneyValue <= 1) return;
		setInputMoneyValue(inputMoneyValue - 1);
		if (inputMoney.current) {
			inputMoney.current.value = inputMoneyValue - 1;
		}
	};

	const incrementMoney = () => {
		if (inputMoneyValue >= user.wallet) return;
		setInputMoneyValue(inputMoneyValue + 1);
		if (inputMoney.current) {
			inputMoney.current.value = inputMoneyValue + 1;
		}
	};

	//----- Bets post
	const postBetHandler = (type) => {
		if (inputMoneyValue > user.wallet) {
			alert('You do not have so amount of money');
			return;
		}

		const startTime = moment().format('L') + ' ' + moment().format('HH:mm');
		const endTime = moment(moment().format('L') + ' ' + currentBetTime);
		const secondsDiff = endTime.diff(startTime, 'seconds');

		if (secondsDiff < 0) {
			alert('Set correct time to place bet');
			return;
		}

		axios
			.post(
				`${process.env.REACT_APP_BACK_LINK}/bet`,
				{
					direction: type,
					priceToBet: inputMoneyValue,
					seconds: Number(secondsDiff),
					pair: activeChartType.url,
					profit,
				},
				{
					headers: { authorization: localStorage.getItem('token') },
				},
			)
			.then((data) => {
				//-------- Set price lines
				const el = data.data.data;
				const line = candleChartSeries.createPriceLine({
					price: el.priceOpen,
					color: el.direction === 'DOWN' ? '#ff7598' : '#a1f8d4',
					lineWidth: 1,
					priceVisible: true,
					alertString: el.direction === 'DOWN' ? 'sell' : 'buy',
				});

				setTimeout(() => {
					candleChartSeries.removePriceLine(line);
				}, el.seconds * 1000);
			})
			.catch((e) => {
				errorHandler(e);
			});
	};

	//----- DepositModal
	const depositHandler = () => {
		setDepositModal(true);
	};

	//----- WithdrawModal
	const withdrawHandler = () => {
		setWithdrawModal(true);
	};

	//----- Change chart pair
	const activeChartTypeHandler = (type) => {
		localStorage.setItem('bet_pair', JSON.stringify(type));
		window.location.reload();
	};

	//----- Exit page
	const exitHandler = () => {
		localStorage.removeItem('token');
		history.push('/');
	};

	//----- Change user password
	const changePassword = (e) => {
		e.preventDefault();
		const pass1 = e.target.pass1.value;
		const pass2 = e.target.pass2.value;

		if (pass1 !== pass2) {
			alert('Passwords not match');
			e.target.pass1.value = '';
			e.target.pass2.value = '';
			return;
		}

		if (user) {
			axios
				.put(
					`${process.env.REACT_APP_BACK_LINK}/users/${user.id}`,
					{
						password: pass1,
					},
					{
						headers: { authorization: localStorage.getItem('token') },
					},
				)
				.then(() => {
					alert('Password successfully changed');
					e.target.pass1.value = '';
					e.target.pass2.value = '';
					setMenuModal(false);
				})
				.catch((e) => {
					errorHandler(e);
				});
		} else {
			alert('User does not exist error');
			return;
		}
	};

	//----- Get name of bet pair in stored bets
	const inlineBetPairName = (elUrl) => {
		const name = chartTypes.find((el) => el.url === elUrl);
		return name.name;
	};

	return (
		<>
			<div className='chart-top'>
				{menuModal && (
					<div className='chart-menu'>
						<div onClick={() => setMenuModal(false)} className={`chart-menu__logo ${menuModal ? 'active' : ''}`}>
							<div onClick={() => setMenuModal(false)} className='chart-menu__close'>
								x
							</div>
						</div>

						<div className='account'>
							<div className='account__title'>
								<SvgAccount />
								<span>Account</span>
							</div>

							<div className='account__description'>
								Welcome <br />
								<span>
									{user && user.name} <br />
									{user && user.email}
								</span>
							</div>
						</div>

						<div className='account'>
							<div className='account__title'>
								<SvgSettings />
								<span>Settings</span>
							</div>

							<div className='account__description'>
								Change password <br />
								<form onSubmit={changePassword} className='account__form'>
									<input type='text' name='pass1' placeholder='new password...' required />
									<input type='text' name='pass2' placeholder='repeat password...' required />
									<button type='submit' className='main-button withdraw'>
										Submit
									</button>
								</form>
							</div>
						</div>

						<div className='payment'>
							<button onClick={depositHandler} className='deposit'>
								<SvgDeposit />
								<span>Deposit</span>
							</button>

							<button onClick={withdrawHandler} className='withdraw'>
								<SvgWithdraw />
								<span>Withdraw</span>
							</button>
						</div>

						<div style={{ marginTop: '-15px' }} onClick={exitHandler} className='account'>
							<div style={{ cursor: 'pointer' }} className='account__title'>
								<SvgExit />
								<span>Exit</span>
							</div>
						</div>
					</div>
				)}
				<div className='chart-top-left'>
					<div onClick={() => setMenuModal(true)} className={`left-logo ${menuModal ? 'active' : ''}`}>
						<img src='https://img.icons8.com/ios-filled/50/000000/menu-rounded.png' alt='menu' />
					</div>
					<div className='chart-type'>
						{chartTypes &&
							chartTypes.map((el) => (
								<ChartTypeItem key={el.id} element={el} name={el.name} activeChartTypeHandler={activeChartTypeHandler} activeChartType={activeChartType} />
							))}
					</div>
				</div>
				<div className='chart-top-right'>
					<div className='bit'>
						<div className='bit-currency'>
							<span>$</span>
							<input
								ref={inputMoney}
								id='investment'
								name='investment'
								type='number'
								onChange={(e) => setInputMoneyValue(Number(e.target.value))}
								defaultValue={inputMoneyValue}
								min='1'
								max='25000'
							/>
						</div>
						<div className='bit-counter'>
							<BitCounter type={'DECREMENT'} decrementMoney={decrementMoney} incrementMoney={incrementMoney} />
							<span></span>
							<BitCounter type={'INCREMENT'} decrementMoney={decrementMoney} incrementMoney={incrementMoney} />
						</div>
					</div>

					<div className='time'>
						<TimePicker currentBetTime={currentBetTime} setCurrentBetTime={setCurrentBetTime} />
					</div>

					<div className='money'>
						<span>{user ? user.wallet : 0} $</span>
					</div>
				</div>
			</div>
			<div className='chart'>
				<div ref={chartContainerRef} className='chart-box'>
					<div ref={legendRef} className='legend'></div>
				</div>

				<div className='chart-sidebar'>
					<div className='chart-sidebar-wallet'>
						<div className='profit'>
							<div className='profit-amount'>
								Прибыль: <span>{profit}%</span>
							</div>
							<div className='profit-info'>
								<p>
									Выплата: <span>{(inputMoneyValue + (inputMoneyValue / 100) * profit).toFixed(2)} $</span>
								</p>
								<p>
									Доход: <span>{(inputMoneyValue !== null && (inputMoneyValue / 100) * profit).toFixed(2)} $</span>
								</p>
							</div>
						</div>
					</div>
					<div ref={rateVal} className='rate-val'>
						0.00
					</div>
					<div className='button-container'>
						<BitButton type={'CALL'} postBetHandler={postBetHandler} />
						<BitButton type={'PUT'} postBetHandler={postBetHandler} />
					</div>
					<div className='bets'>
						<div className='bets-buttons'>
							<span className={`${betsTab === 1 && 'active'}`} onClick={() => setBetsTab(1)}>
								Открытые
							</span>
							<span className={`${betsTab === 2 && 'active'}`} onClick={() => setBetsTab(2)}>
								Закрытые
							</span>
						</div>

						{betsTab === 1 && (
							<div className='bets-opened'>
								{openBets.length > 0
									? openBets.map(({ id, direction, dateOpen, dateClose, pair, priceOpen, priceToBet, moneyGet }) => (
											<div key={id} className='bets-closed__item'>
												<div className='type'>
													{direction === 'UP' && <SvgUp fill={true} />}
													{direction === 'DOWN' && <SvgDown fill={true} />}
												</div>

												<div className='date'>
													{dateOpen.split('T')[0].toString()} <br />
													{dateOpen.split('T')[1].toString().slice(0, 8)} <br />
													{dateClose.split('T')[0].toString()} <br />
													{dateClose.split('T')[1].toString().slice(0, 8)}
												</div>

												<div className='info'>
													<span style={{ fontSize: '12px', marginBottom: '5px' }}>{inlineBetPairName(pair)}</span>
													{priceOpen.toFixed(2)} <br />
													<span style={{ display: 'block', color: betPrice >= priceOpen ? '#219653' : '#eb5757' }}>{betPrice && betPrice.toFixed(2)}</span>
												</div>

												<div className='money'>
													{priceToBet} $ <br />
													{moneyGet && moneyGet.toFixed(2)} $
												</div>
											</div>
									  ))
									: null}
							</div>
						)}

						{betsTab === 2 && (
							<div className='bets-closed'>
								{closedBets.length > 0
									? closedBets.map(({ id, direction, dateOpen, dateClose, pair, priceOpen, priceClose, priceToBet, moneyGet }) => (
											<div key={id} className='bets-closed__item'>
												<div className='type'>
													{direction === 'UP' && <SvgUp fill={true} />}
													{direction === 'DOWN' && <SvgDown fill={true} />}
												</div>

												<div className='date'>
													{dateOpen.split('T')[0].toString()} <br />
													{dateOpen.split('T')[1].toString().slice(0, 8)} <br />
													{dateClose.split('T')[0].toString()} <br />
													{dateClose.split('T')[1].toString().slice(0, 8)}
												</div>

												<div className='info'>
													<span style={{ fontSize: '12px', marginBottom: '5px' }}>{inlineBetPairName(pair)}</span>
													{priceOpen.toFixed(2)} <br />
													{priceClose.toFixed(2)}
												</div>

												<div className='money'>
													{priceToBet} $ <br />
													{moneyGet && moneyGet.toFixed(2)} $
												</div>
											</div>
									  ))
									: null}
							</div>
						)}
					</div>
				</div>
			</div>
			<DepositWithdrawModal
				BTCWallet={BTCWallet}
				withdrawModal={withdrawModal}
				setWithdrawModal={setWithdrawModal}
				depositModal={depositModal}
				setDepositModal={setDepositModal}
			/>
		</>
	);
}

export default ChartPage;

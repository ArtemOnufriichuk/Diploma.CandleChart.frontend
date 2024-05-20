import React from 'react';

import { SvgUp, SvgDown } from './Svgs';

const BitButton = ({ type, postBetHandler }) => {
	switch (type) {
		case 'CALL':
			return (
				<button onClick={() => postBetHandler('UP')} className='main-button call' type='submit'>
					<SvgUp />
					Call
				</button>
			);
		case 'PUT':
			return (
				<button onClick={() => postBetHandler('DOWN')} className='main-button put' type='submit'>
					<SvgDown />
					Put
				</button>
			);
		default:
			break;
	}
};

export default BitButton;

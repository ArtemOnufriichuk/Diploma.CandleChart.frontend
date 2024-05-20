import React from 'react'

const BitCounter = ({ type, decrementMoney, incrementMoney }) => {
    switch (type) {
        case 'INCREMENT':
            return <div onClick={incrementMoney}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" className="trade_head_svg replaced-svg">
                    <g>
                        <line stroke="#000" strokeWidth="4" strokeMiterlimit="10" x1="32" y1="50" x2="32" y2="14"></line>
                        <line stroke="#000" strokeWidth="4" strokeMiterlimit="10" x1="14" y1="32" x2="50" y2="32"></line>
                    </g>
                </svg>
            </div>
        case 'DECREMENT':
            return <div onClick={decrementMoney}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 50 50" enableBackground="new 0 0 50 50" className="trade_head_svg replaced-svg">
                    <path d="M40,23.99H10c-0.552,0-1,0.447-1,1s0.448,1,1,1h30c0.552,0,1-0.447,1-1S40.552,23.99,40,23.99z"></path>
                </svg>
            </div>
        default:
            break;
    }
}

export default BitCounter

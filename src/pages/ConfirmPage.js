import axios from 'axios';
import React, { useEffect, useState } from 'react'

function ConfirmPage() {
    const [allOk, setAllOk] = useState(true);

    useEffect(() => {
        const url = new URL(document.location.href)
        const emailToken = url.pathname.slice('/confirm/'.length)

        axios.patch(`${process.env.REACT_APP_BACK_LINK}/users/confirm/${emailToken}`)
            .then(() => { setAllOk(true) }
            )
            .catch((e) => {
                console.log(e);
                setAllOk(false)
            }
            )
    }, [])

    return (
        <div className="container">
            <div style={{ height: '50vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="section_title">
                    {allOk ? 'Email подтвержден' : 'Email не подтвержден'}
                </div>
            </div>
        </div>
    )
}

export default ConfirmPage

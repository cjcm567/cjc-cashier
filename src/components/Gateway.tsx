/** @format */

import React from "react"
import "../styles/Gateway.css"

interface Props {
    gatewayName: string
    gatewayImgUri: string
    clickedStyle: string
}

export default function Gateway(props: Props) {
    const {gatewayName, gatewayImgUri, clickedStyle} = props
    return (
        <>
            <div className={clickedStyle}>
                <header className="skill-card__header">
                    <img className="skill-card__icon" src={gatewayImgUri} alt="HTML5 Logo" />
                </header>
                <div className="skill-card__body">
                    <h2 className="skill-card__title" style={{color: "#000000"}}>
                        {gatewayName}
                    </h2>
                </div>
            </div>
        </>
    )
}

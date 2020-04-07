/** @format */

import React from "react"
import "../styles/Loader.css"

export default function Loader() {
    return (
        <>
            <div className="loading">
                <div className="loading__square"></div>
                <div className="loading__square"></div>
                <div className="loading__square"></div>
                <div className="loading__square"></div>
                <div className="loading__square"></div>
                <div className="loading__square"></div>
                <div className="loading__square"></div>
            </div>
        </>
    )
}

/** @format */

import React, {useEffect, useState, CSSProperties} from "react"
import {useLocation} from "react-router-dom"
import logo from "../images/logo.svg"
import Loader from "../components/Loader"
import Gateway from "../components/Gateway"
import "../styles/App.css"

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

function App() {
    let query = useQuery()
    let sessionId = query.get("sessionId") || ""
    let orderId = query.get("orderId") || ""
    let userId = query.get("userId") || ""
    let userName = query.get("userName") || ""
    let orderAmount = query.get("orderAmount") || ""
    let orderCurrency = query.get("orderCurrency") || ""
    let queryParams = {
        sessionId: sessionId,
        orderId: orderId,
        userId: userId,
        userName: userName,
        orderAmount: orderAmount,
        orderCurrency: orderCurrency,
    }

    const initalGatewayData = [
        {
            gatewayName: "",
            gatewayImgUri: "",
        },
    ]

    const gatewayCardCssProperties: CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    }
    const [gatewayData, setGatewayData] = useState(initalGatewayData)

    useEffect(() => {
        const requestHeaders: HeadersInit = new Headers()
        requestHeaders.set("Content-Type", "application/json")
        requestHeaders.set("Access-Control-Allow-Origin", "true")
        async function fetchData() {
            const res = await fetch("process.env.REACT_APP_API_PUBLIC_URL", {
                method: "POST",
                headers: requestHeaders,
                body: JSON.stringify({
                    orderCurrency: orderCurrency,
                }),
            })
            const data = await res.json()
            setGatewayData(data)
        }
        fetchData()
    }, [orderCurrency])

    let isValidQueryParams = !Object.values(queryParams).some(x => x === "")
    let isValidGatewayData = !Object.values(gatewayData[0]).some(x => x === "")

    if (!isValidQueryParams) {
        return <p>NOTFOUND</p>
    } else {
        if (!isValidGatewayData) {
            return (
                <>
                    <section>
                        <h4 style={{textAlign: "left"}}>1111Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>2222Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>3Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>4Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>5Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>1Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>2Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>3Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>4Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>5Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>1Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>2Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>3Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>4Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>5Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>1Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>2Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>3Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>4Please Double Check Your Information</h4>
                        <h4 style={{textAlign: "left"}}>5Please Double Check Your Information</h4>
                    </section>
                    <div className="App">
                        <div className="container">
                            <div className="row">
                                <h4 style={{textAlign: "left"}}>Please Double Check Your Information</h4>
                            </div>
                            <div className="row">
                                <h4 style={{textAlign: "left"}}>
                                    Please Select Your Preferred Payment Method. Currently Selected:{" "}
                                </h4>
                                <div style={gatewayCardCssProperties}>
                      <Gateway />

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return <Loader />
            // return <p>NOTFOUND</p>
        }
    }
}

export default App

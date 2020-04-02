/** @format */

import React, {useState, CSSProperties, Suspense, useEffect} from "react"
import {useLocation} from "react-router-dom"
import Loader from "../components/Loader"
import Gateway from "../components/Gateway"
import "../styles/App.css"

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

function App() {
    const query = useQuery()
    const sessionId = query.get("sessionId") || ""
    const orderId = query.get("orderId") || ""
    const userId = query.get("userId") || ""
    const userName = query.get("userName") || ""
    const orderAmount = query.get("orderAmount") || ""
    const orderCurrency = query.get("orderCurrency") || ""
    const queryParams = {
        sessionId: sessionId,
        orderId: orderId,
        userId: userId,
        userName: userName,
        orderAmount: orderAmount,
        orderCurrency: orderCurrency,
    }

    const initalGatewayData = [
        {
            gatewayName: "gateway 1",
            gatewayImgUri: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
        },
        {
            gatewayName: "gateway 2",
            gatewayImgUri: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
        },
    ]

    const gatewayCardCssProperties: CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    }

    const infoCardCssProperties: CSSProperties = {
        padding: "20px",
        margin: "10px",
        // minWidth: "10em",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
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

    const isValidQueryParams = !Object.values(queryParams).some(x => x === "")
    const isValidGatewayData = !Object.values(gatewayData[0]).some(x => x === "")

    let gatewayDict: {gatewayIndex: number; gatewayName: string; gatewayImgUri: string; style: string}[] = []

    for (let index = 0; index < gatewayData.length; index++) {
        gatewayDict.push({
            gatewayIndex: index,
            gatewayName: gatewayData[index].gatewayName,
            gatewayImgUri: gatewayData[index].gatewayImgUri,
            style: "skill-card",
        })
    }

    const [clickedGateway, setClickedGateway] = useState(gatewayDict)
    const [selectedGateway, setSelectedGateway] = useState(-1)

    const handleClick = (id: number) => {
        if (id !== 0) {
            gatewayDict[id].style = "skill-card clicked"
            gatewayDict[0].style = "skill-card"
        } else {
            gatewayDict[0].style = "skill-card clicked"
        }
        setClickedGateway(gatewayDict)
        setSelectedGateway(id)
    }

    async function handleSubmit(gatewayIndex: number) {
        if (gatewayIndex !== -1) {
            const requestHeaders: HeadersInit = new Headers()
            requestHeaders.set("Content-Type", "application/json")
            requestHeaders.set("Access-Control-Allow-Origin", "true")
            const res = await fetch("process.env.REACT_APP_API_PUBLIC_URL", {
                method: "POST",
                headers: requestHeaders,
                body: JSON.stringify({...queryParams, gatewayName: gatewayDict[gatewayIndex].gatewayName}),
            })
            const data = await res.text()
            console.log(data)
        }
    }

    let gatewayRender = clickedGateway.map(gateway => (
        <div onClick={() => handleClick(gateway.gatewayIndex)} key={gateway.gatewayIndex}>
            <Gateway
                gatewayName={gateway.gatewayName}
                gatewayImgUri={gateway.gatewayImgUri}
                clickedStyle={gateway.style}
            />
        </div>
    ))

    if (!isValidQueryParams) {
        return <p>NOTFOUND</p>
    } else {
        if (isValidGatewayData) {
            return (
                <>
                    <div style={infoCardCssProperties}>
                        <div className="App">
                            <div className="container">
                                <div className="row">
                                    <h4 style={{textAlign: "left"}}>Please Double Check Your Information</h4>
                                    <div style={infoCardCssProperties}>
                                        <div style={{textAlign: "left"}}>
                                            <p>
                                                User Name: <b>{queryParams.userName}</b>
                                            </p>
                                            <p>
                                                Amount: <b>{queryParams.orderAmount}</b>
                                            </p>
                                            <p>
                                                Currency: <b>{queryParams.orderCurrency}</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <h4 style={{textAlign: "left"}}>Please Select Your Preferred Payment Method.</h4>
                                </div>
                                <div className="row">
                                    {selectedGateway === -1 ? (
                                        <h4 style={{textAlign: "left", color: "red"}}>
                                            Please select at least one payment method
                                        </h4>
                                    ) : (
                                        <h4 style={{textAlign: "left"}}>
                                            Currently Selected: {gatewayDict[selectedGateway].gatewayName}
                                        </h4>
                                    )}
                                </div>
                                <Suspense fallback={<Loader />}>
                                    <div style={gatewayCardCssProperties}>{gatewayRender}</div>
                                </Suspense>
                                <div className="row" style={{marginTop: "4vh", marginBottom: "4vh"}}>
                                    <button className={selectedGateway === -1 ? "confirm-button disabled" : "confirm-button"} onClick={() => handleSubmit(selectedGateway)} >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return <Loader />
        }
    }
}

export default App

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
    const userId = query.get("userId") || ""
    const walletId = query.get("walletId") || ""
    const orderAmount = query.get("orderAmount") || ""
    const orderCurrency = query.get("orderCurrency") || ""
    const queryParams = {
        sessionId: sessionId,
        userId: userId,
        walletId: walletId,
        orderAmount: orderAmount,
        orderCurrency: orderCurrency,
    }

    const initalGatewayData = [{gatewayName: "", gatewayImgUri: ""}]

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
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    }

    const [gatewayData, setGatewayData] = useState(initalGatewayData)

    

    const isValidQueryParams = !Object.values(queryParams).some(x => x === "")
    const isValidGatewayData = !Object.values(gatewayData[0]).some(x => x === "")

    useEffect(() => {
        
        // const requestHeaders = new Headers()
        // requestHeaders.set("Accept", "text/plain")
        // requestHeaders.set("Content-Type", "text/plain")
        // requestHeaders.set("Access-Control-Allow-Origin", "*")
        async function fetchData() {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({orderCurrency: orderCurrency}),
            }
            const res = await fetch("https://oetcashier.azurewebsites.net/api/OetCashierNudge", requestOptions)
            const data = await res.json()
            setGatewayData(data)
        }
        fetchData()
    }, [orderCurrency])

    let gatewayDict: {gatewayIndex: number; gatewayName: string; gatewayImgUri: string; style: string}[] = []

    for (let index = 0; index < gatewayData.length; index++) {
        gatewayDict.push({
            gatewayIndex: index,
            gatewayName: gatewayData[index].gatewayName,
            gatewayImgUri: gatewayData[index].gatewayImgUri,
            style: "skill-card",
        })
    }

    // const [clickedGateway, setClickedGateway] = useState(gatewayDict)
    const [selectedGateway, setSelectedGateway] = useState(-1)
    const [submitStatus, setSubmitStatus] = useState("Submit")

    const handleClick = (id: number) => {
        if (id !== 0) {
            gatewayDict[id].style = "skill-card clicked"
            gatewayDict[0].style = "skill-card"
        } else {
            gatewayDict[0].style = "skill-card clicked"
        }
        if (id !== -1) {
            // setClickedGateway(gatewayDict)
            setSelectedGateway(id)
        }
    }

    async function handleSubmit(gatewayIndex: number) {
        if (gatewayIndex !== -1) {
            const res = await fetch("https://oetcashier.azurewebsites.net/api/OetCashierTrigger", {
                method: "POST",
                body: JSON.stringify({...queryParams, gatewayName: gatewayDict[gatewayIndex].gatewayName}),
            })
            const data = await res.json()
            let cashierUrl = ""
            cashierUrl = data.cashway.toString()
            console.table(data)
            console.log("cashway" + cashierUrl)
            setSelectedGateway(-1)
            Object.values(gatewayDict).forEach(v => (v.style = "skill-card disabled"))
            // setClickedGateway(gatewayDict)
            setSubmitStatus("Submitted")
            if (cashierUrl !== "" || cashierUrl !== undefined) {
                window.open(cashierUrl, "_self")
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({orderCurrency: orderCurrency}),
            }
            const res = await fetch("https://oetcashier.azurewebsites.net/api/OetCashierNudge", requestOptions)
            const data = await res.json()
            setGatewayData(data)
        }
        fetchData()
    }, [orderCurrency])

    let gatewayRender = gatewayDict.map(gateway => (
        <div onClick={() => handleClick(gateway.gatewayIndex)} key={gateway.gatewayIndex}>
            <Gateway
                gatewayName={gateway.gatewayName}
                gatewayImgUri={gateway.gatewayImgUri}
                clickedStyle={gateway.style}
            />
        </div>
    ))

    if (!isValidQueryParams) {
        return <h1>MALFORMED REQUEST</h1>
    } else {
        if (!isValidGatewayData) {
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
                                                Amount: <b>{queryParams.orderAmount}</b>
                                            </p>
                                            <p>
                                                Currency: <b>{queryParams.orderCurrency}</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {submitStatus === "Submit" ? (
                                        <h4 style={{textAlign: "left"}}>
                                            Please Select Your Preferred Payment Method.
                                        </h4>
                                    ) : (
                                        <h4 style={{textAlign: "left"}}>Your deposit request has been submitted.</h4>
                                    )}
                                </div>

                                {submitStatus === "Submit" ? (
                                    <Suspense fallback={<Loader />}>
                                        <div style={gatewayCardCssProperties}>{gatewayRender}</div>
                                    </Suspense>
                                ) : (
                                    <></>
                                )}
                                <div className="row">
                                    {selectedGateway === -1 ? (
                                        <></>
                                    ) : (
                                        <h4 style={{textAlign: "left"}}>
                                            Currently Selected: {gatewayDict[selectedGateway].gatewayName}
                                        </h4>
                                    )}
                                </div>
                                <div className="row" style={{marginTop: "4vh", marginBottom: "4vh"}}>
                                    <button
                                        className={
                                            selectedGateway === -1 ? "confirm-button disabled" : "confirm-button"
                                        }
                                        onClick={() => {
                                            handleSubmit(selectedGateway)
                                            setSelectedGateway(-1)
                                        }}>
                                        {submitStatus}
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

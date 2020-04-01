/** @format */

import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom"
import Home from "./pages/App"
import NotFound from "./pages/404"
import "./styles/foundation.css"
import "react-app-polyfill/ie9"
import "react-app-polyfill/stable"
import * as serviceWorker from "./serviceWorker"

ReactDOM.render(
    // <React.StrictMode>
    //     <App />
    // </React.StrictMode>,
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/404" component={NotFound} />
            <Route path="*" component={NotFound} />
            <Route component={NotFound} />
        </Switch>
    </Router>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

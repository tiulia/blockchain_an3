import React from "react"

import Path from "./path"
import {Welcome} from "../components/Welcome.js"
import {Main} from "../components/Main"
import Transactions from "../components/Transactions"
import Proposals from "../components/Proposals"

const routes = [
    { path: Path.WELCOME, element: <Welcome /> },
    { path: Path.MAIN, element: <Main /> },
    { path: Path.HOME, element: <Welcome /> },
    { path: Path.TRANSACTIONS, element: <Transactions /> },
    { path: Path.PROPOSALS, element: <Proposals /> },

]

export default routes
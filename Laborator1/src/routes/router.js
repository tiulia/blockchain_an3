import React from "react"

import Path from "./path"
import {Welcome} from "../components/Welcome.js"
import {Wallet} from "../components/Wallet"

const routes = [
    { path: Path.WELCOME, element: <Welcome /> },
    { path: Path.WALLET, element: <Wallet /> },
    { path: Path.HOME, element: <Welcome /> },

]

export default routes
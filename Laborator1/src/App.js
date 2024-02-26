import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider} from "react-router-dom"

import { WalletProvider } from './utils/Context';
import routes from "./routes/router"

import './styles/App.css';

const router = createBrowserRouter(routes)

function App() {
  
  return (
      <WalletProvider>
        {useMemo(() => (
          <RouterProvider router={router} />)
          , [])}
      </WalletProvider>
  )
}

export default App

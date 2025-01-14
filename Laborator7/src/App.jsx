import { useMemo } from 'react';
import { IndexedDB } from "react-indexed-db-hook";
import { initDB } from "react-indexed-db-hook";
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { WalletProvider } from './utils/WalletContext';
import { UserProvider } from './utils/UserContext';
import { IndexDBConfig } from './utils/IndexDBConfig'
import routes from "./routes/router"

const router = createBrowserRouter(routes)

initDB(IndexDBConfig);

function App() {
  return (
    <IndexedDB
      name={IndexDBConfig.name}
      version={IndexDBConfig.version}
      objectStoresMeta={IndexDBConfig.objectStoresMeta}
    >
      <UserProvider>
        <WalletProvider>
          {useMemo(() => (
            <RouterProvider router={router} />)
            , [])}
        </WalletProvider>
      </UserProvider>
    </IndexedDB>
  )
}

export default App

import { StorageContextProvider } from "./context/StorageContext"
import Dapp from "./Dapp"

const App = () => {
  return (
    <StorageContextProvider>
      <Dapp />
    </StorageContextProvider>
  )
}

export default App

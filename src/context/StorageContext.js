import { createContext } from "react"
import { useContract } from "web3-hooks"
import { storageAddress, storageABI } from "../contract/Storage"

export const StorageContext = createContext()

export const StorageContextProvider = ({ children }) => {
  const storage = useContract(storageAddress, storageABI)
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  )
}

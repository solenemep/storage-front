import { useContext } from "react"
import { StorageContext } from "../context/StorageContext"

export const useStorageContext = () => {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error(
      `It seems that you are trying to use StorageContext outside of its provider`
    )
  }
  return context
}

import React from "react"
import ReactDOM from "react-dom"
import { Web3Provider } from "web3-hooks"
import { ChakraProvider } from "@chakra-ui/react"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

reportWebVitals()

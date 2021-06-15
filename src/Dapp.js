import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import { Alert, AlertIcon, Input, Spinner } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { useState, useEffect, Fragment } from "react"
import { useWeb3 } from "web3-hooks"
import { useStorageContext } from "./hook/useStorageContext"
import { storageAddress } from "./contract/Storage"

const Dapp = () => {
  const [web3State, login] = useWeb3()
  const storage = useStorageContext()

  const [value, setValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, SetInputValue] = useState("")
  const toast = useToast()
  const {
    isOpen: isOpenLogoutModal,
    onOpen: onOpenLogoutModal,
    onClose: onCloseLogoutModal,
  } = useDisclosure()

  const eveAddress = "0x247de9b8dFCDE2Bb10628334462B2C2e6e46BC05"

  // Get storage value when component is mounted
  useEffect(() => {
    if (storage) {
      const getValue = async () => {
        try {
          const value = await storage.getData()
          setValue(value)
        } catch (e) {
          console.log(e)
        }
      }
      getValue()
    }
  }, [storage])

  // Listen to DataSet event and react with a state change
  useEffect(() => {
    if (storage) {
      const cb = (account, str) => {
        setValue(str)
        if (account.toLowerCase() !== web3State.account.toLowerCase()) {
          toast({
            title: "Event DataSet",
            description: `${account} set storage with value: ${str}`,
            status: "info",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          })
        }
      }
      // ecouter sur l'event DataSet
      storage.on("DataSet", cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        storage.off("DataSet", cb)
      }
    }
  }, [storage, web3State.account, toast])

  // Listen to DataSet event, and if initiator of the transaction is
  // eveAddress then pop a toast
  useEffect(() => {
    if (storage) {
      const cb = (account, str) => {
        setValue(str)
        if (account.toLowerCase() !== web3State.account.toLowerCase()) {
          toast({
            title: "Eve made a transaction",
            description: `${account} set storage with value: ${str}`,
            status: "warning",
            position: "top-left",
            duration: 9000,
            isClosable: true,
          })
        }
      }
      // Filter for DataSet events with account equal to 0x128de69b13Bf0456716920b1D88A017A422A9840
      const eveFilter = storage.filters.DataSet(eveAddress)

      // ecouter sur l'event DataSet avec le filter eveFilter appliqué
      storage.on(eveFilter, cb)
      return () => {
        // arreter d'ecouter lorsque le component sera unmount
        storage.off(eveFilter, cb)
      }
    }
  }, [storage, web3State.account, toast])

  const handleClickLogin = () => {
    if (!web3State.isLogged) {
      login()
    } else {
    }
  }
  const handleClickSetStorage = async () => {
    try {
      setIsLoading(true)
      let tx = await storage.setData(inputValue)
      await tx.wait()
      toast({
        title: "Confirmed transaction",
        description: `storage is set wiht value: ${inputValue}\nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } catch (e) {
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Fragment>
      <Modal isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logout from a Dapp</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You can not logout from a Dapp.</Text>
            <Text>
              Disconnect your MetaMask from this website if you want to logout.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="cyan" onClick={onCloseLogoutModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex flexDirection="column" alignItems="center" m={4} h="300px">
        <Flex
          justifyContent="space-between"
          width="100%"
          mb={4}
          alignItems="center"
        >
          <Heading size="xl">Storage</Heading>
          <Button
            colorScheme="cyan"
            onClick={() =>
              !web3State.isLogged ? handleClickLogin() : onOpenLogoutModal()
            }
          >
            {!web3State.isLogged ? "Log in" : "Log out"}
          </Button>
        </Flex>
        <Heading size="xs" as="small" alignSelf="flex-start">
          Deployed on Kovan at {storageAddress}
        </Heading>
        <Spacer />
        {!storage ? (
          <Spinner
            size="xl"
            label="Connecting to Ethereum"
            color="cyan.500"
            emptyColor="cyan.200"
          />
        ) : (
          <>
            {web3State.chainId === 42 ? (
              <>
                <Heading as="p" fontSize="30">
                  value: {value}
                </Heading>
                <HStack m={4}>
                  <Input
                    width="50"
                    value={inputValue}
                    placeholder="storage value to set"
                    onChange={(event) => SetInputValue(event.target.value)}
                  />
                  <Button
                    isLoading={isLoading}
                    loadingText="setting storage"
                    colorScheme="cyan"
                    onClick={handleClickSetStorage}
                  >
                    set storage
                  </Button>
                </HStack>
              </>
            ) : (
              <Alert status="error">
                <AlertIcon />
                You are on the wrong network please switch to Kovan
              </Alert>
            )}
          </>
        )}
      </Flex>
    </Fragment>
  )
}
export default Dapp

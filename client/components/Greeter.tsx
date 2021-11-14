import { Text, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import GreeterContract from "../public/Greeter.json"
import { AbiItem } from 'web3-utils'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setAccount, setProvider } from '../store/globalSlice'
import { useButton, useInput } from '../hooks/ui'
import useWeb3Modal from "../hooks/useWeb3Modal"
import Web3 from "web3"

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Greeter() {
  // const { globalState, dispatch } = useContext(globalContext)
  const [provider] = useWeb3Modal()
  const [web3, setWeb3] = useState()
  const account = useSelector((state: RootState) =>  state.global.account)

  const dispatch = useDispatch()

  useEffect(() => {
    if (provider) {
      setWeb3(new Web3(provider.provider))
    }
  }, [provider])

  // const { account, web3 } = globalState
  const [greetingText, setGreetingText] = useState("")
  const [greetingOutput, setGreetingOutput] = useState("")
  const [greetingButtonLoading, greetingButton] = useButton(setGreeting, 'Set Greeting')
  const [greeting, greetingInput] = useInput(greetingButtonLoading as boolean)
  const [greetButtonLoading, greetButton] = useButton(handleGreet, 'Greet')
  const [greet, greetInput] = useInput(greetButtonLoading as boolean)
  const contractAddress = process.env.NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS_RINKEBY
  const abiItems: AbiItem[] = web3 && GreeterContract.abi as AbiItem[]
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)

  function getGreeting() {
    if (contract) {
      console.log('getGreeting', contract.methods.greeting())
      contract.methods.greeting().call().then((result: any) => {
        setGreetingText(result)
      });
    }
  }

  async function handleGreet() {
    console.log('handleGreet', greet)
    try {
      const result = await contract.methods.greet(greet).call()
      setGreetingOutput(result)
    } catch (error) {
      console.error(error)
    }
  }

  async function setGreeting() {
    console.log('setGreeting')
    try {
      const result = await contract.methods.setGreeting(greeting).send({ from: account })
      console.log('result', result)
      getGreeting()
    } catch (error) {
      console.error('error in try...catch', error)
    } 
  }

  useEffect(() => {
    if (contract) {
      getGreeting()
    }
  })

  return (
    <div>
      {
        account && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem><Text textAlign="right" fontWeight="bold">Greeting</Text></GridItem>
          <GridItem><Text>{greetingText}</Text></GridItem>
          <GridItem align="end">{greetingButton}</GridItem>
          <GridItem>{greetingInput}</GridItem>
          <GridItem align="end">{greetButton}</GridItem>
          <GridItem>{greetInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{greetingOutput}</Text>
          </GridItem>
        </Grid>
        )
      }
    </div>
  )
}
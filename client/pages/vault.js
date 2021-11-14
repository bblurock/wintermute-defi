import Web3 from 'web3'
import Head from 'next/head'
import styled from '@emotion/styled'
import { useEffect, useState, useCallback } from 'react'

import { RepeatIcon } from '@chakra-ui/icons'
import { Button, Box, Flex, IconButton, Text, Input } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';

import { RootState } from '../store/store'
import { useSelector } from 'react-redux'
import { AbiItem } from 'web3-utils'

import styles from '../styles/Vault.module.css'
import Layout from '../components/Layout'
import Greeter from '../components/Greeter'
import useWeb3Modal from '../hooks/useWeb3Modal'
import VaultFactoryContract from '../public/VaultFactory.json'


const TOKEN_NAME = "OSE"

function Home() {
  const [provider] = useWeb3Modal()
  const account = useSelector((state) =>  state.global.account)
  const title = 'Creating your Vault - OSE.FINANCE'
  const [etherBalance, setEtherBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0.0)

  const [web3, setWeb3] = useState()
  const contractAddress = process.env.NEXT_PUBLIC_VAULT_FACTORY_CONTRACT_ADDRESS_RINKEBY
  const abiItems = web3 && VaultFactoryContract.abi
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)

  useEffect(() => {
    if (provider) {
      setWeb3(new Web3(provider.provider))
    }
  }, [provider])

  const onCreateVault = useCallback(async () => {
    console.log(contract)
    if (contract) {
      const result = await contract.methods.createvault(TOKEN_NAME).send({
        from: account,
        value: 9 * 1e15
      })
      console.log('result', result)
    }
  }, [depositAmount, contract])

  const setInputMax = useCallback(
    () => {
      setDepositAmount(etherBalance)
    },
    [etherBalance]
  )
  const reloadBalance = useCallback(
    async () => {
      try {
        if (!provider) return;
        // console.log(web3.eth.getBalance, account)
        const balance = await web3.eth.getBalance(account)
        console.log('balance', balance)
        setEtherBalance(parseInt(balance) / 1e18)
      } catch (error) {
        console.error(error)
      }
    },
    [account, provider, web3],
  )

  useEffect(() => {
    async function getBalance() {
      if (!provider || !account) {
        return;
      }

      await reloadBalance()
    }

    getBalance()
  }, [account, provider])

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className={styles.main}>
        <Box
          w="100%"
          p={6}
          bg="white"
          borderRadius="lg"
          m={6}
          style={{
            boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.06)'
          }}
        >
          <Flex direction="column">
            <Box bg="#e8e5d8" borderRadius="md" p={1} mb={4} display="flex" w="fit-content">
              <Box bg="#df6248" borderRadius="md" p={3} color="white">
                Vault
              </Box>
              <Box borderRadius="md" p={3}>
                Governance
              </Box>
            </Box>
            <Box
              mb={4}
              p={3}
              bg="#e8e5d8"
              borderRadius="md"
              display="flex"
              flexDirection="column"
            >
              <Box display="flex" mb={1}>
                <div className={styles.coinImage}>
                  <Image
                    src="https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg"
                    width="48"
                    height="48"
                  />
                </div>

                <Flex ml={3} flexDirection="column" flex={1}>
                  <Text fontSize="sm">Create with one time fee:</Text>
                  <Text fontSize="xl">ETH</Text>
                </Flex>

                <Box bg="white" borderRadius="lg" display="flex" p={2}>
                  <Input
                    variant="unstyled"
                    placeholder="0.0"
                    value={0.009}
                    disabled
                    onChange={e => setDepositAmount(e.target.value)}
                  />
                  {/* <Button
                    px={3}
                    py={1}
                    border="1px solid #949494"
                    borderRadius={16}
                    onClick={setInputMax}
                  >
                    Max
                  </Button> */}
                </Box>
              </Box>
              <Box textAlign="right">
                <Text fontSize="sm">Balance: { etherBalance || '0.0' }</Text>
                <IconButton
                  aria-label="Reload balance"
                  icon={<RepeatIcon />}
                  onClick={reloadBalance}
                />
              </Box>
            </Box>
            <Box mb={4}>
              <Button colorScheme="teal" size="lg" w="100%" onClick={onCreateVault}>
                Create Vault
              </Button>
            </Box>
          </Flex>
        </Box>
      </main>
    </Layout>
  )
}

export default Home

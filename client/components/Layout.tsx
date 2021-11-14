import Web3 from 'web3'
import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { Flex, Button } from '@chakra-ui/react';

import { useSelector, useDispatch } from 'react-redux'

import homestyles from '../styles/Home.module.css'
import { RootState } from '../store/store'
import { setAccount, setProvider, clearState } from '../store/globalSlice'

import styles from '../styles/Home.module.css'
import useWeb3Modal from "../hooks/useWeb3Modal";

const Nav = styled.nav`
  width: 100%;
  padding: 1.5rem 1rem;
`

const StyledButton = styled(Button)`
  background-color: #7de78e;
`

type Props = {
  children?: ReactNode;
};


function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const account = useSelector((state: RootState) =>  state.global.account)
  const dispatch = useDispatch()
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // Load the user's accounts.
        const accounts = await provider.listAccounts();

        dispatch(setAccount(accounts[0]))

        // Resolve the ENS name for the first account.
        const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        dispatch(setAccount(""))
        dispatch(setProvider(""));
        console.error("fetchAccount error", err);
      }
    }

    fetchAccount();
  }, [account, provider, setRendered, dispatch]);

  return (
    <StyledButton
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </StyledButton>
  );
}

export default function Layout({ children }: Props) {
  const [provider, web3, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
    >
      <Nav>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/" passHref>
            <Image className={styles.logo} src="/logos/ose.png" alt="OSE Finance" width="223" height="57" />
          </Link>

          <WalletButton
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        </Flex>
      </Nav>
      {children}

      <footer className={homestyles.footer}>
        Powered by{' '}
        <img className={homestyles.logo} src="/logos/ethereum.png" alt="Ethereum Logo" width="144" height="32" />
        <img className={homestyles.logo} src="/logos/nextjs.png" alt="NextJS Logo" width="64" height="32" />
        <img className={homestyles.logo} src="/logos/metamask.png" alt="MetaMask Logo" width="128" height="32" />
        <img className={homestyles.logo} src="/logos/walletconnect.png" alt="WalletConnect Logo" width="128" height="32" />
      </footer>
    </Flex>
  )
}

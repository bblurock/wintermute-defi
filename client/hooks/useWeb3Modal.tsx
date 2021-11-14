import Web3 from 'web3'
import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useCallback, useEffect, useMemo, useState } from 'react'
import Web3Modal from 'web3modal'

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store'
import { clearState } from '../store/globalSlice'

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "4911f186c765437e9a7633ba749eb48d";

const NETWORK = "mainnet";

function useWeb3Modal(config = {}) {
  const dispatch = useDispatch();
  const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, network = NETWORK } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return typeof window !== 'undefined' ? new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
      },
    }) : {}
  }, [infuraId, network]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect()
    const web3provider = new Web3Provider(newProvider)
    const web3 = new Web3(web3provider.provider)
    setWeb3(web3)
    setProvider(web3provider)
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      console.log('clearState 1')

      await web3Modal.clearCachedProvider();

      console.log('clearState 2')
      dispatch(clearState());
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, web3, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;

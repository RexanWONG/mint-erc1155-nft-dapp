import { useState } from 'react'
import './App.css'
import NFTImage from './assets/NFTImage.png'
import abi from "./utils/SampleNFTs.json"
import { ethers } from "ethers";

const App = () => {
  const contractAddress = '0x359B573359DDaF99856F2F036894A5DaD30d55C4'
  const contractABI = abi.abi
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(contractAddress, contractABI, signer);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [yourWalletAddress, setYourWalletAddress] = useState("");
  const [isMintLoading, setIsMintLoading] = useState(false)
  const [isMinted, setIsMinted] = useState(false);
  const [mintTxHash, setMintTxHash] = useState("")

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const mumbaiChainId = '0x13881';
  
        if (chainId === mumbaiChainId) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          
          console.log("Account Connected: ", account);

          setIsWalletConnected(true);
          setYourWalletAddress(account);
        } else {
          console.log('Switching to Polygon Mumbai Testnet');
          await addPolygonMumbaiNetwork();

          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          
          console.log("Account Connected: ", account);

          setIsWalletConnected(true);
          setYourWalletAddress(account);
        }
      } else {
        console.log("No MetaMask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const addPolygonMumbaiNetwork = async () => {
    try {
      const networkDetails = {
        chainId: '0x13881', // Chain ID for Mumbai Testnet
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      };
  
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkDetails],
      });
  
    } catch (error) {
      console.log('Error while adding network:', error);
    }
  };

  const mintNFT = async () => {
    try {
      const mint = await nftContract.mint(0, {value: ethers.utils.parseEther('0.0000001')})
      setIsMintLoading(true)
      await mint.wait()
      setIsMinted(true)
      setMintTxHash(mint.hash)

    } catch (error) {
      alert(error)
    }
  }
  

  return (
    <div className='font-inter bg-black min-h-screen flex flex-col items-center justify-center'>
      <div className='flex w-full h-screen '>
        <div className='w-1/2 h-full p-20'>
          <h1 className='text-white text-8xl font-black bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-200 bg-clip-text text-transparent animate-text'>
            Mint this NFT 
          </h1>
          <h2 className='text-white text-2xl font-medium mt-5'>There will be 100 of these weird dudes.  Get your's by clicking the mint button below and paying 0.0000001 MATIC.</h2>
          <p className='text-gray-400 text-2xl font-medium mt-5'>You can only mint 1 at a time</p>

          {!isWalletConnected ? (

            <div>
              <p className='text-gray-400 text-2xl font-light mt-5'>Please connect your wallet to get started (you will need Polygon Mumbai network) : </p>
              <p className='text-gray-400 font-light mt-5'>If you don't have Polygon Mumbai on your metamask, we'll do it for you 👇 </p>
              <button onClick={checkIfWalletIsConnected} class="font-bold text-3xl rounded-lg px-8 py-4 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-200 animate-text hover:shadow-lg hover:from-blue-500 hover:to-purple-600 hover:text-white mt-5">
                Connect wallet
              </button>
            </div>
          
        ) : (
          <div>
            <h1 className='text-white text-5xl font-black mt-16'>Mint NFT</h1>
            <p className='text-white text-2xl mt-10'>🟡 Your wallet address : {yourWalletAddress}</p>

            <p className='text-white text-2xl mt-10'>🟣 NFT Contract address (on Polygon Mumbai): {contractAddress}</p>

            {!isMinted ? (
              !isMintLoading ? (
                <button onClick={mintNFT} class="font-bold text-3xl rounded-lg px-8 py-4 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-200 animate-text hover:shadow-lg hover:from-blue-500 hover:to-purple-600 hover:text-white mt-5">
                  Mint now!
                </button>
              ) : (
                <h1 className='text-white text-2xl mt-5'>Loading...</h1>

              )
              


            ) : (
              <div className='mt-16'>
                <h1 className='text-white text-2xl'>Minted!</h1>
                <p className='text-white'>Tx hash : {mintTxHash}</p>
                <p className='text-white'>Opensea: https://testnets.opensea.io/collection/unidentified-contract-15125</p>
                
              </div>

            )}
          </div>

        )}

        </div>

        <img
            src={NFTImage}
            alt="NFT"
            className='w-1/2 h-full'
        />

        
      </div>
    </div>
  )
}

export default App

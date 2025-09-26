import { SDKProvider } from '@metamask/sdk';
import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  webSocket,
} from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from './ehousing.sol.json';

const client = createPublicClient({
  chain: sepolia,
  transport: webSocket(process.env.WSS_ALCHEMY_URL),
});

function getWalletClient(sdkProvider: SDKProvider) {
  return createWalletClient({
    chain: sepolia,
    transport: custom(sdkProvider),
  });
}

function getReadableContract(sdkProvider: SDKProvider) {
  if (!process.env.EHOUSING_CONTRACT_ADDRESS) {
    throw new Error('Undefined process.env.EHOUSING_CONTRACT_ADDRESS');
  }
  const contract = getContract({
    abi,
    address: process.env.EHOUSING_CONTRACT_ADDRESS,
    client: {
      wallet: getWalletClient(sdkProvider),
      public: client,
    },
  });

  return contract;
}

export { client, getWalletClient, getReadableContract };

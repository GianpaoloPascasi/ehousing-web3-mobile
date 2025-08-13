import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

export default function getWalletClient(provider: any) {
  return createWalletClient({
    chain: mainnet,
    transport: custom(provider),
  });
}

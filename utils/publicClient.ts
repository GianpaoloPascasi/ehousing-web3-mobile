import { createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: webSocket(
    "wss://eth-sepolia.g.alchemy.com/v2/Lo5RzjpNv0wsabG0SvR-_U_P15eANYhc"
  ),
});
export default publicClient;

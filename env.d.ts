declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EHOUSING_CONTRACT_ADDRESS?: `0x${string}`;
      WSS_ALCHEMY_URL: `wss://${string}`;
      BASE_API_URL: string;
    }
  }
}

export {};

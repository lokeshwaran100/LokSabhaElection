import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

require("dotenv").config({ path: "../.env" });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_RPC_URL,
      accounts: ["0x" + process.env.HARD_HAT_PRIVATE_KEY || ""],
    },
  },
};

export default config;

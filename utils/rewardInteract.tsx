import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { REWARD } from "../web3Config";

export const web3 = createAlchemyWeb3(
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ""
);

const rewardContract = new web3.eth.Contract(
  REWARD.REWARD_ABI,
  REWARD.REWARD_CONTRACT_ADDRESS
);

export const rewardBalanceOf = async (): Promise<number> => {
  if (!window.ethereum.selectedAddress) return 0;
  try {
    const tx = await rewardContract.methods
      .balanceOf(window.ethereum.selectedAddress)
      .call();
    return Number((tx / 10 ** 18).toFixed(0));
  } catch (error) {
    console.error(error);
    return 0;
  }
};

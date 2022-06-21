import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { IUnStackedToken } from "../interfaces";
import { GET_NFT, STAKE } from "../web3Config";

export const web3 = createAlchemyWeb3(
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ""
);

const utilContract = new web3.eth.Contract(
  GET_NFT.GET_NFT_ABI,
  GET_NFT.GET_NFT_CONTRACT_ADDRESS
);

interface IRawUnStackedToken extends IUnStackedToken {
  isApprovedAddress: string;
}

export const getIsApprovedBatch = async (): Promise<IUnStackedToken[] | []> => {
  if (!window.ethereum.selectedAddress) return [];
  const isApprovedArr = await utilContract.methods
    .getApprovedBatch(window.ethereum.selectedAddress)
    .call();

  const _isApprovedArr = isApprovedArr.map((item: IRawUnStackedToken) => {
    return {
      isApproved: item.isApprovedAddress === STAKE.STAKE_CONTRACT_ADDRESS,
      tokenId: item.tokenId,
    };
  });
  return _isApprovedArr;
};

export const isWithdrawableBatch = async (
  tokenIds: number[]
): Promise<boolean> => {
  if (!window.ethereum.selectedAddress) return false;
  try {
    const tx = await utilContract.methods.isWithdrawableBatch(tokenIds).call();
    return tx;
  } catch (error) {
    console.error(error);
    return false;
  }
};

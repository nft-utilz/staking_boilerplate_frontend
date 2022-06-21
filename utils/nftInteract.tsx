import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { NFT, STAKE } from "../web3Config";

export const web3 = createAlchemyWeb3(
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ""
);

const nftContract = new web3.eth.Contract(
  NFT.NFT_ABI,
  NFT.NFT_CONTRACT_ADDRESS
);

export const isPublicSaleState = async () => {
  const publicSale = await nftContract.methods.publicM().call();
  return publicSale;
};
export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call();
  return totalMinted;
};

export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxSupply().call();
  return maxSupply;
};

export const publicMint = async (mintAmount: number) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: "To be able to mint, you need to connect your wallet",
    };
  }

  // get nounce for preventing replay attacks
  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    "latest"
  );

  // Set up our Ethereum transaction
  const tx = {
    to: NFT.NFT_CONTRACT_ADDRESS,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(NFT.PRICE * mintAmount), "ether")
    ).toString(16), // hex
    data: nftContract.methods.publicSaleMint(mintAmount).encodeABI(),
    nonce: nonce.toString(16),
  };

  console.log(tx);

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    return {
      success: true,
      status: (
        <a
          href={`https://rinkeby.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      ),
    };
  } catch (error: any) {
    return {
      success: false,
      status: "😞 Smth went wrong:" + error.message,
    };
  }
};

export const getTotalTokens = async () => {
  if (!window.ethereum.selectedAddress) return;
  const totalTokens = await nftContract.methods
    .tokensOfOwner(window.ethereum.selectedAddress)
    .call();
  return totalTokens;
};

export const getIsApproved = async (tokenId: number) => {
  if (!window.ethereum.selectedAddress) return;
  const isApproved = await nftContract.methods.getApproved(tokenId).call();
  return isApproved === STAKE.STAKE_CONTRACT_ADDRESS;
};

export const approve = async (tokenId: number) => {
  if (!window.ethereum.selectedAddress) return;
  try {
    const isApproved = await nftContract.methods
      .approve(STAKE.STAKE_CONTRACT_ADDRESS, tokenId)
      .send({ from: window.ethereum.selectedAddress });
    console.log(isApproved);
    return isApproved;
  } catch (error) {
    console.error(error);
  }
};

export const setApprovalForAll = async () => {
  if (!window.ethereum.selectedAddress) return;
  try {
    const isApproved = await nftContract.methods
      .setApprovalForAll(STAKE.STAKE_CONTRACT_ADDRESS, true)
      .send({ from: window.ethereum.selectedAddress });
    console.log(isApproved);
    return isApproved;
  } catch (error) {
    console.error(error);
  }
};

export const isApprovedForAll = async (): Promise<boolean> => {
  if (!window.ethereum.selectedAddress) return false;
  const isApproved = await nftContract.methods
    .isApprovedForAll(
      window.ethereum.selectedAddress,
      STAKE.STAKE_CONTRACT_ADDRESS
    )
    .call();
  return isApproved;
};

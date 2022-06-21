import React, { useEffect, useState } from "react";
import { Button_1 } from "./styles/button";
import { useWeb3React } from "@web3-react/core";
import { cutWallet } from "../../utils/common";
import { useTypedDispatch } from "../../store";
import { SET_WALLET_MODAL_OPEN } from "../../reducers/common";
import { fetchWallet } from "../../api";

const ConnectBtn = () => {
  const { chainId, account, deactivate, active } = useWeb3React();
  const dispatch = useTypedDispatch();
  const onClickConnectWallet = () => dispatch(SET_WALLET_MODAL_OPEN(true));
  const [registerTimeSpan, setRegisterTimeSpan] = useState<Date | null>(null);

  // register
  useEffect(() => {
    if (!account) return;
    // 여기 시간초 두기 한번 fetchwallet하고 1.5초 후에 가능하게 하기
    const nowTime: Date = new Date();
    const init = async () => {
      await fetchWallet(account);
      setRegisterTimeSpan(new Date());
    };
    if (!registerTimeSpan) init();
    if (registerTimeSpan && Number(nowTime) - Number(registerTimeSpan) > 10000)
      init();
  }, [account]);

  useEffect(() => {}, [registerTimeSpan]);

  console.log(registerTimeSpan);
  return (
    <>
      {!active && (
        <Button_1
          bgColor="black"
          fontColor="white"
          onClick={onClickConnectWallet}
        >
          Connect Wallet
        </Button_1>
      )}
      {active && (
        <Button_1 bgColor="white" fontColor="black" onClick={deactivate}>
          {cutWallet(account!)}
        </Button_1>
      )}
    </>
  );
};

export default ConnectBtn;

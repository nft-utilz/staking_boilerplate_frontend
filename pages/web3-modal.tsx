import { Button_1 } from "../components/common/styles/button";
import { Section, Wrapper } from "../components/common/styles/page";
import { Body } from "../components/modal/styles";

import { ChangeEvent, useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box,
  ChakraProvider,
} from "@chakra-ui/react";
import SelectWalletModal from "../components/modal/WalletModal";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "../utils/networks";
import { connectors } from "../utils/connectors";
import { toHex, truncateAddress } from "../utils/common";
import { TNetworkParam, TProvider } from "../interfaces";

const Web3Modal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<any>("");
  const [network, setNetwork] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState<boolean | undefined>(undefined);

  const handleNetwork = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network) as TNetworkParam]],
          });
        } catch (error) {
          setError(error as string);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error as string);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = (await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      })) as string;
      console.log(verify);
      if (typeof account !== "string") return;
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error as string);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", "");
    setNetwork(0);
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem(
      "provider"
    ) as unknown as TProvider;
    if (provider) activate(connectors[provider]);
  }, []);
  return (
    <ChakraProvider>
      <Section>
        <Wrapper>
          <Body>
            <Text position="absolute" top={0} right="15px">
              If you&apos;re in the sandbox, first &quot;Open in New
              Window&quot; ⬆️
            </Text>
            <VStack justifyContent="center" alignItems="center" h="100vh">
              <HStack marginBottom="10px">
                <Text
                  margin="0"
                  lineHeight="1.15"
                  fontSize={["1.5em", "2em", "3em", "4em"]}
                  fontWeight="600"
                >
                  Let&apos;s connect with
                </Text>
                <Text
                  margin="0"
                  lineHeight="1.15"
                  fontSize={["1.5em", "2em", "3em", "4em"]}
                  fontWeight="600"
                  sx={{
                    background:
                      "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Web3-React
                </Text>
              </HStack>
              <HStack>
                {!active ? (
                  <Button onClick={onOpen}>Connect Wallet</Button>
                ) : (
                  <Button onClick={disconnect}>Disconnect</Button>
                )}
              </HStack>
              <VStack
                justifyContent="center"
                alignItems="center"
                padding="10px 0"
              >
                <HStack>
                  <Text>{`Connection Status: `}</Text>
                  {active ? (
                    <CheckCircleIcon color="green" />
                  ) : (
                    <WarningIcon color="#cd5700" />
                  )}
                </HStack>

                <Tooltip label={account} placement="right">
                  <Text>{`Account: ${truncateAddress(
                    account as string
                  )}`}</Text>
                </Tooltip>
                <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
              </VStack>
              {active && (
                <HStack justifyContent="flex-start" alignItems="flex-start">
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    padding="10px"
                  >
                    <VStack>
                      <Button onClick={switchNetwork} isDisabled={!network}>
                        Switch Network
                      </Button>
                      <Select
                        placeholder="Select network"
                        onChange={handleNetwork}
                      >
                        <option value="3">Ropsten</option>
                        <option value="4">Rinkeby</option>
                        <option value="42">Kovan</option>
                        <option value="1666600000">Harmony</option>
                        <option value="42220">Celo</option>
                      </Select>
                    </VStack>
                  </Box>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    padding="10px"
                  >
                    <VStack>
                      <Button onClick={signMessage} isDisabled={!message}>
                        Sign Message
                      </Button>
                      <Input
                        placeholder="Set Message"
                        maxLength={20}
                        onChange={handleInput}
                        w="140px"
                      />
                      {signature ? (
                        <Tooltip label={signature} placement="bottom">
                          <Text>{`Signature: ${truncateAddress(
                            signature
                          )}`}</Text>
                        </Tooltip>
                      ) : null}
                    </VStack>
                  </Box>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    padding="10px"
                  >
                    <VStack>
                      <Button onClick={verifyMessage} isDisabled={!signature}>
                        Verify Message
                      </Button>
                      {verified !== undefined ? (
                        verified === true ? (
                          <VStack>
                            <CheckCircleIcon color="green" />
                            <Text>Signature Verified!</Text>
                          </VStack>
                        ) : (
                          <VStack>
                            <WarningIcon color="red" />
                            <Text>Signature Denied!</Text>
                          </VStack>
                        )
                      ) : null}
                    </VStack>
                  </Box>
                </HStack>
              )}
              <Text>{(error as any) ? error!.message : null}</Text>
            </VStack>
          </Body>
        </Wrapper>
      </Section>
    </ChakraProvider>
  );
};

export default Web3Modal;

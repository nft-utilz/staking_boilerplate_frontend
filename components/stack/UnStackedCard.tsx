import { FC, useState } from "react";
import styled, { css } from "styled-components";
import ToggleBtnComponent from "./ToggleButton";
import {
  CardButtons,
  CardContainer,
  CardName,
  Image,
  StackTime,
} from "./styles";
import { RANDOM_BG_COLORS } from "../../constants";
// import { setApprovalForAll } from "../../utils/nftInteract";
// import { dispatch } from "@web3-onboard/core/dist/store";
import {
  APPROVE_FOR_ALL,
  getClickedTokenId,
  getModalCardLoading,
  getTotalCardLoading,
  SET_TOTAL_CARD_LOADING,
} from "../../reducers/common";
import { useTypedDispatch, useTypedSelector } from "../../store";
import LoaderSvg from "../common/LoaderSvg";
interface IStackCard {
  name: string;
  bgColor: string;
  isApproved: boolean;
  tokenId: number;
  handleClickStake: (tokenId: number) => void;
}
const UnStackedComponent: FC<IStackCard> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isTotalCardLoading = useTypedSelector(getTotalCardLoading);
  const isModalCardLoading = useTypedSelector(getModalCardLoading);
  const clickedCard = useTypedSelector(getClickedTokenId);

  const isModalCard = clickedCard === props.tokenId;

  const dispatch = useTypedDispatch();
  const onClickApproveForAll = async () => {
    // setIsLoading(true);
    dispatch(SET_TOTAL_CARD_LOADING(true));
    try {
      await dispatch(APPROVE_FOR_ALL());
    } catch (error) {
      console.log(error);
    }
    dispatch(SET_TOTAL_CARD_LOADING(false));
  };
  return (
    <CardContainerEl
      bgColor={props.bgColor}
      isLoading={isTotalCardLoading}
      isModalCard={isModalCard}
    >
      <Image src="/images/mystery-ape.webp" alt="ape" />
      <CardName>{props.name}</CardName>

      <StakingInfo>
        <StackTime>
          <ToggleBtnComponent
            title="Approve to stack"
            status={props.isApproved}
            handleClick={() => {}}
          />
        </StackTime>
      </StakingInfo>
      <CardButtonsEl isApproved={props.isApproved}>
        {props.isApproved ? (
          <button onClick={() => props.handleClickStake(props.tokenId)}>
            stack
          </button>
        ) : (
          <button onClick={onClickApproveForAll}>approve for stake</button>
          // <button onClick={setApprovalForAll}>approve for stake</button>
        )}
      </CardButtonsEl>
      {isTotalCardLoading && (
        <LoaderContainer>
          <LoaderSvg />
        </LoaderContainer>
      )}
    </CardContainerEl>
  );
};

export default UnStackedComponent;

const StakingInfo = styled.div`
  flex: 1;
`;
const CardButtonsEl = styled(CardButtons)<{ isApproved: boolean }>`
  ${({ isApproved }) =>
    isApproved
      ? css`
          button {
            /* background: ${(props) => props.theme.colors.highlight}; */
            background: ${RANDOM_BG_COLORS[2]};
            /* color: ${(props) => props.theme.colors.white}; */
          }
        `
      : css`
          button {
          }
        `}
`;

const disabled = css`
  background: ${(props) => props.theme.colors.gray3};

  pointer-events: none;
  ::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.375);
    z-index: 3;
  }

  button {
    cursor: not-allowed !important;
    background: ${(props) => props.theme.colors["w-gray2"]};
  }
`;

const CardContainerEl = styled(CardContainer)<{
  isLoading: boolean;
  isModalCard: boolean;
}>`
  position: relative;
  ${({ isLoading }) => isLoading && disabled};
  ${({ isModalCard }) => isModalCard && disabled};
`;

const LoaderContainer = styled.div`
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  fill: #fff;
  svg {
    width: 50px;
    height: 50px;
  }
`;

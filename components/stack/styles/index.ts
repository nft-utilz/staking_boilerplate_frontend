import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import { RANDOM_BG_COLORS } from "../../../constants";

export const flash = keyframes`
0% {
  opacity: 0;
}
5% {
  opacity: 0;
}
20% {
  opacity: 0;
}
40% {
  opacity: 0;
}
60% {
  opacity: 0;
}
80% {
  opacity: 1;
}
100% {
  opacity: 1;
}
`;

export const Box = styled.div`
  width: 100%;
  gap: 0.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  .input__status {
    flex-direction: column;
  }
`;

export const Status = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: center;

  padding: 0.25rem;
  background: ${(props) => props.theme.colors.white};
  border-radius: 5px;
  box-sizing: border-box;

  border: 1px solid #000000;
  border-radius: 2px;

  > div,
  > span {
    flex: 1;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* span:nth-child(1) { */
  /* padding-right: 1rem; */
  /* } */
`;
export const Title = styled.div`
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  color: ${(props) => props.theme.colors["w-gray1"]};
`;

export const Toggle = styled.div<{ status: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    cursor: pointer;
    height: 30px;
    path:nth-child(1) {
      transition: 200ms ease-in-out;
      ${({ status }) =>
        status
          ? css`
              transform: translate(0px, 0);
              /* fill: ${(props) => props.theme.colors.highlight}; */
              fill: ${RANDOM_BG_COLORS[0]};
            `
          : css`
              transform: translate(-20px, 0);
            `}
    }
    path:nth-child(2) {
      transition: 200ms ease-in-out;
      ${({ status }) =>
        status &&
        css`
          /* fill: ${(props) => props.theme.colors.highlight}; */
          fill: ${RANDOM_BG_COLORS[0]};
        `}
    }
  }
`;

export const CardContainer = styled.div<{ bgColor: string }>`
  transition: all 0.3s ease-in-out;

  width: 90%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  /* background: lightcoral; */
  border: 3.5px solid ${(props) => props.theme.colors.black};
  box-shadow: 0.2rem 0.2rem 0 ${(props) => props.theme.colors.black};
  padding: 0.2rem;
  border-radius: 0.4rem;
  /* height: fit-content; */
  background: ${(props) => props.bgColor};
  /* color: ${(props) => props.theme.colors.white}; */
  /* background: #e0c061; */
  /* background: #e0c061; */

  animation: ${flash} 0.7s linear;
  img {
    width: 100%;
    object-fit: contain;
    animation: ${flash} 0.7s linear;
  }
`;

export const Image = styled.img`
  padding: 1rem;
`;
export const CardName = styled.div`
  font-weight: 700;
  padding: 0rem 1rem;
  padding-bottom: 0.5rem;
`;
export const StackTime = styled.div`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: ${(props) => props.theme.fontSizes.fontsm};

  > span:first-child {
    /* color: ${(props) => props.theme.colors["w-gray3"]}; */
    color: ${(props) => props.theme.colors["w-gray1"]};
  }
`;
export const CardButtons = styled.div`
  text-transform: capitalize;
  display: flex;
  /* justify-content: space-between; */
  /* max-width:  */
  padding: 1rem;
  /* padding: 1rem; */
  gap: 1rem;
  button {
    font-family: ${(props) => props.theme.fonts.Montserrat};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => props.theme.fontSizes.fontmd};
    font-weight: 600;
    /* background: #fff; */
    border: 2px solid ${(props) => props.theme.colors.black};
    border-radius: 1.5rem;
    /* box-shadow: 0.1rem 0.1rem 0 ${(props) => props.theme.colors.black}; */

    padding: 0.3rem 1rem;
    flex: 1;
    /* padding: 1rem 1rem; */
    cursor: pointer;
  }
`;

export const CardEarn = styled.div`
  font-weight: 600;
  display: flex;
  font-size: ${(props) => props.theme.fontSizes.fontsm};
  justify-content: space-between;
  padding: 0 1rem;
  position: relative;

  > span:first-child {
    color: ${(props) => props.theme.colors["w-gray1"]};
  }
`;

export const StakingInfo = styled.div``;

export const Bar = styled.div<{ percent: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  transition: all 1s ease-in-out;

  > div {
    width: 100%;
    height: 0.75rem;
    border-radius: 2rem;
    background: ${(props) => props.theme.colors.white};
    border: 2.25px solid ${(props) => props.theme.colors.black};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    ::before {
      content: "";
      transition: all 1s ease-in-out;

      /* width: 0%; */
      /* width: ${({ percent }) => percent}%; */
      width: var(--progress--width);

      height: 100%;
      background: #fb8b8c;
      /* 다 되면  */
      ${({ percent }) => percent >= 100 && `background: #5ccbf5;`}
      border-radius: 2rem;
      position: absolute;
    }
  }
`;

export const LoaderContainer = styled.div`
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

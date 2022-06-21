import React from "react";
import styled, { keyframes } from "styled-components";

const grow = keyframes`
    60% {
      transform: scale(0.8);
      stroke-width: 4px;
      fill-opacity: 0;
    }
    100% {
      transform: scale(0.9);
      stroke-width: 8px;
      fill-opacity: 1;
      fill: #219a00;
    }
`;

const draw = keyframes`
    0%,
    100% {
      stroke-opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
    }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  @supports (
    animation: ${grow} 0.5s cubic-bezier(0.25, 0.25, 0.25, 1) forwards
  ) {
    .tick {
      stroke-opacity: 0;
      stroke-dasharray: 29px;
      stroke-dashoffset: 29px;
      animation: ${draw} 0.5s cubic-bezier(0.25, 0.25, 0.25, 1) forwards;
      animation-delay: 0.6s;
    }

    .circle {
      fill-opacity: 0;
      stroke: #219a00;
      stroke-width: 16px;
      transform-origin: center;
      transform: scale(0);
      animation: ${grow} 1s cubic-bezier(0.25, 0.25, 0.25, 1.25) forwards;
    }
  }
`;

const CheckSvg = () => {
  //   let path = document.querySelector(".tick");
  //   let length = path.getTotalLength();
  //   console.log(length);
  return (
    <Container>
      <svg
        className="ft-green-tick"
        xmlns="http://www.w3.org/2000/svg"
        height="50"
        width="50"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle className="circle" fill="#5bb543" cx="24" cy="24" r="22" />
        <path
          className="tick"
          fill="none"
          stroke="#FFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M14 27l5.917 4.917L34 17"
        />
      </svg>
    </Container>
  );
};

export default CheckSvg;

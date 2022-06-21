import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  /* height: 300px; */
  display: flex;
  justify-content: center;
  align-items: center;
  .ui-success,
  .ui-error {
    width: 50px;
    height: 50px;
    /* margin: 40px; */
    // border:1px solid #eee;
  }

  .ui-success {
    &-circle {
      stroke-dasharray: 260.75219024795285px, 260.75219024795285px;
      stroke-dashoffset: 260.75219024795285px;
      transform: rotate(220deg);
      transform-origin: center center;
      stroke-linecap: round;
      animation: ani-success-circle 1s ease-in both;
    }
    &-path {
      stroke-dasharray: 60px 64px;
      stroke-dashoffset: 62px;
      stroke-linecap: round;
      animation: ani-success-path 0.4s 1s ease-in both;
    }
  }

  @keyframes ani-success-circle {
    to {
      stroke-dashoffset: 782.2565707438586px;
    }
  }

  @keyframes ani-success-path {
    0% {
      stroke-dashoffset: 62px;
    }
    65% {
      stroke-dashoffset: -5px;
    }
    84% {
      stroke-dashoffset: 4px;
    }
    100% {
      stroke-dashoffset: -2px;
    }
  }

  .ui-error {
    &-circle {
      stroke-dasharray: 260.75219024795285px, 260.75219024795285px;
      stroke-dashoffset: 260.75219024795285px;
      animation: ani-error-circle 1.2s linear;
    }
    &-line1 {
      stroke-dasharray: 54px 55px;
      stroke-dashoffset: 55px;
      stroke-linecap: round;
      animation: ani-error-line 0.15s 1.2s linear both;
    }
    &-line2 {
      stroke-dasharray: 54px 55px;
      stroke-dashoffset: 55px;
      stroke-linecap: round;
      animation: ani-error-line 0.2s 0.9s linear both;
    }
  }

  @keyframes ani-error-line {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes ani-error-circle {
    0% {
      stroke-dasharray: 0, 260.75219024795285px;
      stroke-dashoffset: 0;
    }
    35% {
      stroke-dasharray: 120px, 120px;
      stroke-dashoffset: -120px;
    }
    70% {
      stroke-dasharray: 0, 260.75219024795285px;
      stroke-dashoffset: -260.75219024795285px;
    }
    100% {
      stroke-dasharray: 260.75219024795285px, 0;
      stroke-dashoffset: -260.75219024795285px;
    }
  }
`;

const ErrorSvg = () => {
  return (
    <Wrapper>
      <div className="ui-error">
        <svg
          viewBox="0 0 87 87"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Group-2" transform="translate(2.000000, 2.000000)">
              <circle
                id="Oval-2"
                stroke="rgba(252, 191, 191, .5)"
                strokeWidth="4"
                cx="41.5"
                cy="41.5"
                r="41.5"
              ></circle>
              <circle
                className="ui-error-circle"
                stroke="#F74444"
                strokeWidth="4"
                cx="41.5"
                cy="41.5"
                r="41.5"
              ></circle>
              <path
                className="ui-error-line1"
                d="M22.244224,22 L60.4279902,60.1837662"
                id="Line"
                stroke="#F74444"
                strokeWidth="3"
                strokeLinecap="square"
              ></path>
              <path
                className="ui-error-line2"
                d="M60.755776,21 L23.244224,59.8443492"
                id="Line"
                stroke="#F74444"
                strokeWidth="3"
                strokeLinecap="square"
              ></path>
            </g>
          </g>
        </svg>
      </div>
    </Wrapper>
  );
};

export default ErrorSvg;

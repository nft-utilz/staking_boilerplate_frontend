import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  #Layer_1 {
    enable-background: new 0 0 50 50;
  }
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    /* margin: 0 0 2em; */
    /* height: 100px; */
    /* width: 10%; */
    text-align: center;
    /* padding: 1em; */
    /* margin: 0 auto 1em; */
    display: inline-block;
    vertical-align: top;
  }

  /*
  Set the color of the icon
*/
  svg path,
  svg rect {
    /* fill: #ff6700; */
    fill: var(--chakra-colors-purple-400);
  }
`;
const LoaderSvg = () => {
  return (
    <Wrapper>
      <div className="loader loader--style8" title="7">
        <svg
          version="1.1"
          id="Layer_1"
          //   xmlns="http://www.w3.org/2000/svg"
          //   xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="30px"
          height="30px"
          viewBox="0 0 24 30"
          xmlSpace="preserve"
        >
          <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
            <animate
              attributeName="opacity"
              attributeType="XML"
              values="0.2; 1; .2"
              begin="0s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              attributeType="XML"
              values="10; 20; 10"
              begin="0s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="10; 5; 10"
              begin="0s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2">
            <animate
              attributeName="opacity"
              attributeType="XML"
              values="0.2; 1; .2"
              begin="0.15s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              attributeType="XML"
              values="10; 20; 10"
              begin="0.15s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="10; 5; 10"
              begin="0.15s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2">
            <animate
              attributeName="opacity"
              attributeType="XML"
              values="0.2; 1; .2"
              begin="0.3s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              attributeType="XML"
              values="10; 20; 10"
              begin="0.3s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="10; 5; 10"
              begin="0.3s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
    </Wrapper>
  );
};

export default LoaderSvg;

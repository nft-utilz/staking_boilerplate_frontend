import React, { FC } from "react";
import styled from "styled-components";
interface Props {
  imgSrc: string;
  newStyle?: string;
  alt: string;
}

const Image = styled.img<{ newStyle?: string }>`
  ${({ newStyle }) => newStyle};
  border: 10px;
`;

const FallbackImage: FC<Props> = (props) => {
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = props?.imgSrc;
  };

  return (
    <Image
      src={"/images/whiteBG.png"}
      alt={props.alt}
      newStyle={props.newStyle}
      onLoad={onLoad}
    />
  );
};

export default FallbackImage;

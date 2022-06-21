import styled, { css } from "styled-components";

interface IButton {
  bgColor?: string;
  fontColor?: string;
}

export const Button_1 = styled.button<IButton>`
  transition: all 0.25s ease-in-out;
  font-size: ${(props) => props.theme.fontSizes.fontmd};
  text-transform: capitalize;
  cursor: pointer;
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.fontSizes.font3xl};
  padding: 0.75rem 2rem;
  font-family: ${(props) => props.theme.fonts.Montserrat};
  font-weight: 700;
  ${({ bgColor, fontColor }) => css`
    background-color: ${bgColor};
    color: ${fontColor};
  `}

  position: relative;
  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${(props) => props.theme.colors.black};

    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

export const Button_2 = styled.button<IButton>`
  background: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.black};
  box-shadow: 0.3rem 0.3rem 0 ${(props) => props.theme.colors.black};
  transition: all 0.2s ease-in-out;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  :hover {
    background: ${(props) => props.theme.colors["w-gray1"]};
    color: ${(props) => props.theme.colors.white};
  }
  :active {
    transform: translate(0.2rem, 0.2rem);
    box-shadow: 0.1rem 0.1rem 0 ${(props) => props.theme.colors.black};
  }
`;
//
export const Button_3 = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};
  outline: none;
  border: none;

  font-size: ${(props) => props.theme.fontSizes.fontsm};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${(props) => props.theme.colors.black};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

export const WritingButton = styled(Button_3)`
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
  transform: scale(0.9);

  ::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

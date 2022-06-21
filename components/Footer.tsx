import React from "react";
import styled from "styled-components";
import { Section, Wrapper } from "./common/styles/page";
import { AiFillTwitterCircle, AiFillMediumCircle } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

const NavButton = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};

const Footer = () => {
  return (
    <Section>
      <WrapperEl>
        <Box>
          <Link href="/">
            <Logo>Logo</Logo>
          </Link>
          <Navigator>
            <NavButton name="Home" />
            <NavButton name="Trade coin" />
            <NavButton name="Provide LP" />
            <NavButton name="Staking" />
            <NavButton name="Public release" />
          </Navigator>
        </Box>
        <Box>
          <span>copyright blah blah blah</span>
          <SNS>
            <div>
              <AiFillTwitterCircle />
            </div>
            <div>
              <AiFillMediumCircle />
            </div>
            <div>
              <FaDiscord />
            </div>
          </SNS>
        </Box>
      </WrapperEl>
    </Section>
  );
};

export default Footer;

const WrapperEl = styled(Wrapper)`
  display: flex;
  flex-direction: column;
`;
const Box = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const Navigator = styled.nav`
  display: flex;
  gap: 2rem;

  /* display: flex; */
  /* gap: 1rem; */
  font-weight: 500;
  color: ${(props) => props.theme.colors["w-gray1"]};
  > div {
    cursor: pointer;
  }
`;
const SNS = styled.div`
  display: flex;
  gap: 2rem;

  font-size: ${(props) => props.theme.fontSizes.fontlg};
  > div {
    cursor: pointer;
  }
`;

const Logo = styled.span`
  font-weight: 800;
  font-size: ${(props) => props.theme.fontSizes.fontlg};
  cursor: pointer;
`;

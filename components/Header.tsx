import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { navNames } from "../constants";
import { Section, Wrapper } from "./common/styles/page";
import ConnectWalletBtn from "./common/ConnectWalletBtn";
interface INaveButton {
  name: string;
  href: string;
}
const NavButton = (props: INaveButton) => {
  return (
    <Link href={props.href} passHref>
      <div>{props.name}</div>
    </Link>
  );
};

const Header = () => {
  // const router = useRouter();
  const onClickLogo = () => {
    document.location.href = "/";
  };

  return (
    <Section style={{ paddingTop: "1rem" }}>
      <Wrapper>
        <Box onClick={onClickLogo}>Logo</Box>
        <Navitation>
          <NavButton name="Home" href="/" />
          <NavButton name="Staking" href={`/staking/${navNames.DASHBOARD}`} />
          <NavButton name="Minting" href="/mint" />
        </Navitation>

        <div style={{ position: "absolute", right: "1rem" }}>
          <ConnectWalletBtn />
        </div>
      </Wrapper>
    </Section>
  );
};

export default Header;

const Box = styled.div`
  font-weight: 800;
  font-size: ${(props) => props.theme.fontSizes.fontlg};
  cursor: pointer;
`;
const Navitation = styled.nav`
  display: flex;
  gap: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors["w-gray1"]};
  > div {
    cursor: pointer;
  }
`;

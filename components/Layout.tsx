import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { getIsWalletModalOpen } from "../reducers/common";
import { useTypedSelector } from "../store";
import Footer from "./Footer";
import Header from "./Header";
import SelectWalletModal from "./modal/WalletModal";

interface LayoutProps {
  children: ReactNode;
}

const Section = styled.section`
  /* width: 100vw; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Layout: FC<LayoutProps> = ({ children }) => {
  const isWalletModalOpen = useTypedSelector(getIsWalletModalOpen);
  return (
    <Section>
      <Header />
      {children}
      <Footer />
      <AnimatePresence>
        {isWalletModalOpen && <SelectWalletModal />}
      </AnimatePresence>
    </Section>
  );
};

export default Layout;

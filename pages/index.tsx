import type { NextPage } from "next";
import styled from "styled-components";
import { Section, Wrapper } from "../components/common/styles/page";
const Home: NextPage = () => {
  return (
    <Section>
      <Wrapper>
        <Body>
          <div>HOME</div>
          <div>
            hi there, If you are interested in this website,
            <br /> please contact me here
          </div>
          <div>hanjk13262@gmail.com</div>
        </Body>
      </Wrapper>
    </Section>
  );
};

export default Home;

const Body = styled.div`
  min-height: 100vh;
  font-size: ${(props) => props.theme.fontSizes.fontxl};
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  > div:nth-child(1) {
    font-size: ${(props) => props.theme.fontSizes.fontxl};
    padding-bottom: 2rem;
    font-weight: 500;
  }

  > div:nth-child(2) {
    font-weight: 800;
  }
  > div:nth-child(3) {
    padding-top: 2rem;
    font-size: ${(props) => props.theme.fontSizes.fontxs};
    font-weight: 500;
  }
  /* justify-content: center; */
  /* align-items: center; */
`;

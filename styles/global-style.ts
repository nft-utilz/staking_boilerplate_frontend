import { createGlobalStyle } from "styled-components";
// import reset from "styled-reset";
import { theme } from "../styles/theme";

export const GlobalStyle = createGlobalStyle`

  :root {
    --color-white: #ffffff;
    --color-gray: #D2D2D2;
    --color-charcoal: #404040;
    --color-black: #101010;
    --color-highlight: #32ECA6;

    --gap: 40px;

    --font-size-title: 24px;
    --letter-spacing-title: 0.48px;

    --font-size-description: 32px;
    --letter-spacing-description: 0.64px;

    
    /* --clr-selection-bg: #cb3d92; */
    --clr-selection-bg: yellow;
    --clr-selection-text: #f4f0f0;
  }

  

  * {
    margin: 0;
    padding: 0;
    text-decoration: none;
    box-sizing: border-box;
}

  html {
    /* color: ${(props) => props.theme.colors.white}; */
    font-family: Montserrat, sans-serif;
    /* background:linear-gradient(#2e1f46, #181025); */
    /* background:#181025; */
    background: #eeedde !important;
    scroll-behavior: smooth;
    transition: scroll 0.3s cubic-bezier(0.0, 0.0, 0.58, 1.0);
  }

  body{
    background: #eeedde !important;

  }

  ::selection {
  /* background: var(--clr-selection-bg); */
  background: yellow;
  color:${(props) => props.theme.colors["w-gray1"]}
  }

  @media all and (min-width: 1025px){
  }

  @media all and (min-width: 320px) and (max-width: 1024px) {
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, button {
    outline: none; 
    border: none;
    background-color: transparent;                                                                                                                                                                        
  }
/*  
  @font-face {
    font-family: "NotoSans";
    font-weight: normal;
    font-style: normal;
    src: url("/fonts/NotoSansKR-Regular.otf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family: "NotoSans Thin";
    font-weight: normal;
    font-style: normal;
    src: url("/fonts/NotoSansKR-Thin.otf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 100;
    font-style: normal;
    src: url("/fonts/Montserrat-Thin.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 200;
    font-style: normal;
    src: url("/fonts/Montserrat-ExtraLight.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 300;
    font-style: normal;
    src: url("/fonts/Montserrat-Light.ttf") format("truetype");
    font-display:auto;
  }
    
  @font-face {
    font-family:"Montserrat";
    font-weight: 400;
    font-style: normal;
    src: url("/fonts/Montserrat-Regular.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 500;
    font-style: normal;
    src: url("/fonts/Montserrat-Medium.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 600;
    font-style: normal;
    src: url("/fonts/Montserrat-SemiBold.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 700;
    font-style: normal;
    src: url("/fonts/Montserrat-Bold.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 800;
    font-style: normal;
    src: url("/fonts/Montserrat-ExtraBold.ttf") format("truetype");
    font-display:auto;
  }

  @font-face {
    font-family:"Montserrat";
    font-weight: 900;
    font-style: normal;
    src: url("/fonts/Montserrat-Black.ttf") format("truetype");
    font-display:auto;
  } */
`;

export default GlobalStyle;

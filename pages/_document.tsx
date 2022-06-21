import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";
// 오류날 때
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });
      //
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        //FIXME: 어레이로 바꾸니까 된다 매우 중요 12323
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }
}

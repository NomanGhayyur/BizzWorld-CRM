import Document, { Html, Head, Main, NextScript } from 'next/document'
import { StyleSheetServer } from 'elements';
import { DocumentContext } from 'next/dist/shared/lib/utils';
import Script from 'next/script';

class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext): Promise<any> {
    const { css } = StyleSheetServer.renderStatic(ctx.renderPage as any);
    const ids = css.renderedClassNames;
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, css, ids }
  }

  render() {
    const { css, ids } = this.props
    return (
      <Html>
        <Head>
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: css.content }}
          />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/bootstrap.min.css"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          {ids && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.__REHYDRATE_IDS = ${JSON.stringify(ids)}
                `,
              }}
            />
          )}
        </body>
        <Script src="/js/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/js/popper.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.min.js" strategy="beforeInteractive" />
      </Html>
    )
  }
}

export default MyDocument
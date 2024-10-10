import './globals.css'

import { ContextProvider } from '@/context/wagmiContext'
import Footer from '@/design-systems/Organisms/Footer'
import Header from '@/design-systems/Organisms/Header'
import { allura, poppins, urbanist } from '@/utils/font'
import Script from 'next/script'
interface Metadata {
  title: string
  description: string
}
export const metadata: Metadata = {
  title: 'SOLAV | Generate your NFT with Artificial Intelligence',
  description:
    'SOLAV, short for "Solution of Art Value," is dedicated to revolutionizing the art investment experience by leveraging blockchain technology for secure and transparent art authentication, ownership verification, and tracking.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <meta charSet="utf-8" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        name="viewport"
      />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="default" name="apple-mobile-web-app-status-bar-style" />
      <meta content="yes" name="mobile-web-app-capable" />
      <meta content="website" name="og:type" property="og:type" />
      <meta content="summary_large_image" name="twitter:card" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" />
      <body className={`${urbanist.variable} ${poppins.variable} ${allura.variable} bg-[#f9f2ff] dark:bg-neutral-100`}>
        <ContextProvider>
          <Header />
          {children}
          <Footer />
          <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-5VFW6ZCTBT" />
          <Script
            strategy="afterInteractive"
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5VFW6ZCTBT');
            `,
            }}
          />
        </ContextProvider>
      </body>
    </html>
  )
}

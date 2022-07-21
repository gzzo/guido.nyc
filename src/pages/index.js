import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Script from 'next/script'

export default function Home() {
  return (
    <>
    <Script src="https://www.googletagmanager.com/gtag/js?id=UA-123955635-1" strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
      window.dataLayer = window.dataLayer || []

      function gtag() {
        dataLayer.push(arguments)
      }

      gtag('js', new Date())

      gtag('config', 'UA-123955635-1')
      `}
    </Script>
    <Head>
      <title>guido.nyc</title>
    </Head>
    <div className={styles.container}>
      Guido
    </div>
    </>
  )
}

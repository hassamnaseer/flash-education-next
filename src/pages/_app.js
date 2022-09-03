import '../../styles/globals.css'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../store'

import DashboardLayout from '../layouts/Web'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'


if (typeof window !== 'undefined') {
  require('../../public/js/jquery.min.js')
}
if (typeof window !== 'undefined') {
  require("../../public/js/popper.min.js");
}
if (typeof window !== 'undefined') {
  require("../../public/js/bootstrap.min.js");
}
// if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//   require("../../public/js/holder.min.js");
// }
// if (typeof window !== 'undefined') {
//   require("../../public/js/init.js");
// }


function App({ Component, pageProps }) {
  const router = useRouter()
  const [readyForRender, setReadyForRender] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // if (!localStorage.getItem('luke_token')) {
      //   router.push("/login")
      // }
  
      if (router.pathname === "/") {
        if (!localStorage.getItem('luke_token')) {
          router.push("/login")
        } else router.push("/home")
      }
      setReadyForRender(true)
    }
  }, [])
  
  return (
    <Provider store={store}>
      <Head>
        <meta property="og:title" content="LetsFlash" />
        <meta property="og:image" content="https://res.cloudinary.com/bampow/image/upload/v1631815649/Lightbulb_1.jpg" />
        <meta property="og:description" content="Virtual Study Assitant for any Occasion" data-react-helmet="true" />

        <meta name="twitter:title" content="LetsFlash" />
        <meta name="twitter:description" content="Virtual Study Assitant for any Occasion" />
        <meta name="twitter:image" content="https://res.cloudinary.com/bampow/image/upload/v1631815649/Lightbulb_1.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="keywords"
          content="virtual flashcards, Ai Flashcards, study virtual, assistant, online quiz, study quiz"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Study with efficiency by focusing on your competencies with an AI virtual assistant without interruption or pause through intelligent flashcards."
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.onload = function init() {
              try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
                window.URL = window.URL || window.webkitURL
                // const context = new AudioContext();
                // if (context.state !== "suspended") return;
                // const b = document.body;
                // const events = ["touchstart", "touchend", "mousedown", "keydown"];
                // events.forEach(e => b.addEventListener(e, unlock, false));
                // function unlock() {context.resume().then(clean);}
                // function clean() {events.forEach(e => b.removeEventListener(e, unlock));}
              } catch (e) {
                // alert('No web audio support in this browser!');
              }
              // var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
              // if (isIOS) {
              //   console.log('This is a IOS device');
              // } else {
              //   console.log('This is Not a IOS device');
              // }
              document && document.body && document.body.addEventListener('click', unlockAudio)
              document && document.body && document.body.addEventListener('touchstart', unlockAudio)
            }
            function unlockAudio() {
              const sound = new Audio('/audios/notification.mp3')
              sound.play()
              sound.pause()
              sound.currentTime = 0
              document.body.removeEventListener('click', unlockAudio)
              document.body.removeEventListener('touchstart', unlockAudio)
            }
          `
          }}
        />

        <script dangerouslySetInnerHTML={{
            __html: `
            !(function (w, d, s, l, i) {
              w[l] = w[l] || []
              w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : ''
              j.async = true
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
              f.parentNode.insertBefore(j, f)
            })(window, document, 'script', 'dataLayer', 'GTM-WDC56CF')
            `
          }}
        />

        <script dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || []
            function gtag() {
              dataLayer.push(arguments)
            }
            gtag('js', new Date())
            gtag('config', 'UA-217736213-1')
            `
          }}
        />
    
    
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-217736213-1"></script>
    
        <title>LetsFlash</title>

        <noscript>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
            rel="stylesheet"
            type="text/css"
          />
        </noscript>
      </Head>

      <DashboardLayout styles={styles.landingContainer}>
        {readyForRender ? <Component {...pageProps} /> : <></>}
      </DashboardLayout>
    </Provider>
  )

}

export default App


import React, { useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { connect, useDispatch, useSelector } from 'react-redux'
import favicon from '../../public/favicon.ico'

const LandingWrapper = props => {
  const {
    isBot,
  } = props

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="LetsFlash" />
        <link rel="icon" href={favicon} />
      </Head>

      <main className={styles.main}>
        <></>
      </main>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth,
})

export async function getServerSideProps(ctx) {
  // const userAgent = useUserAgent(ctx.req.headers['user-agent'])

  return {
    // props: { isBot: userAgent.isBot },
    props: { isBot: false },
  }
}
export default connect(mapStateToProps)(LandingWrapper)

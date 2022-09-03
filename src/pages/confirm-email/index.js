import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { EMAIL_VERIFY_LAMBDA_BASE_URL, GET_AUTH_USER_DETAILS_BASE_URL } from '../../config'
import LoaderFunc from '../../helper/LoaderFunc'


const ConfirmEmail = props => {
  const router = useRouter()
  const [loaderVisible, setLoaderVisible] = useState(true)

  useEffect(() => {
    const { token, ref, uid } = router.query
    // const token = query.get('token')
    // const ref = query.get('ref')
    // const uid = query.get('uid')
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('flash_app_stage')) localStorage.removeItem('flash_app_stage', 'partial')
    }
    verifyToken(token, ref, uid)
  }, [])

  const verifyToken = async (token, ref, uid) => {
    axios.get(`${EMAIL_VERIFY_LAMBDA_BASE_URL}/confirm-email?token=${token}`).then(res => {
      if (res.data.statusCode === 500) {
        alert(res.data.message)
      } else if (res.data.isVerified) {
        if (ref && uid) {
          axios
            .get(`${GET_AUTH_USER_DETAILS_BASE_URL}/after-referral-signup?userId=${uid}&referralCode=${ref}`)
            .then(r => {
              setLoaderVisible(false)
              if (localStorage.getItem('active_user_data')) router.push('/home')
              else router.push('/login')
            })
        } else {
          setLoaderVisible(false)
          if (localStorage.getItem('active_user_data')) router.push('/home')
          else router.push('/login')
        }
      }
    })
  }
  // return <LoaderFunc visible={loaderVisible} />
}

export default ConfirmEmail

import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import DashboardNav from '../../pages/components/DashboardNav'
import Sidebar from '../../pages/components/Sidebar'
import { useRouter } from 'next/router'

import ReactJoyride, { STATUS } from 'react-joyride'
import { showJoyRidePopup } from '../../redux/actions/category'

import useDidUpdateEffect from '../../helper/useDidUpdateEffect'
import { useDispatch, useSelector } from 'react-redux'

var _ToastsStore, _ToastsContainer, _ToastsContainerPosition;

if (typeof window !== 'undefined') {
  const { ToastsContainer } = require('react-toasts');
  _ToastsContainer = ToastsContainer
}

if (typeof window !== 'undefined') {
  const { ToastsStore } = require('react-toasts');
  _ToastsStore = ToastsStore
}

if (typeof window !== 'undefined') {
  const { ToastsContainerPosition } = require('react-toasts');
  _ToastsContainerPosition = ToastsContainerPosition
}


var hh = null

const DashboardLayout = ({ children, title }) => {
  const history = useRouter()
  const dispatch = useDispatch()

  const category = useSelector(state => state.category)

  const { showJoyRidePopupState } = category

  const [run, setRun] = useState(false)
  const [categoryAction, setCategoryAction] = useState(false)
  const [lukeToken, setLukeToken] = useState(null)
  const [allowed, setAllowed] = useState(false)
  const [readyForFirstRender, setReadyForFirstRender] = useState(false)

  const [outerRoutes, setOuterRoutes] = useState([
    '/health', '/login', '/register', '/forgot-password', '/health', '/category/[categoryName]/[id]', '/privacy-policy', '/confirm-email'
  ])

  useEffect(() => {
    typeof window !== 'undefined' ? setAllowed(true) : setAllowed(false)

    setLukeToken(localStorage.getItem('luke_token'))

    if (!localStorage.getItem('luke_token') && !checkIfOuterRoute()) history.push('/login')

    console.log("PATHNAME: >>> ", history.pathname);
    console.log("BASEPATH: >>> ", history.basePath);

    let activeUser = localStorage.getItem('active_user_data')
      ? JSON.parse(localStorage.getItem('active_user_data'))
      : {}
    if (activeUser && activeUser.is_first_login) {
      setRun(true)
    }
    // var formData = new FormData()
    // formData.append('id', activeUser.login_user_id)
    // dispatch(getUserFirstLoggedInStatus(formData))

    setReadyForFirstRender(true)
  }, [])



  const [steps, setSteps] = useState([
    {
      content: (
        <div>
          <h4>Welcome to LetsFlash App!</h4>
          <h5>Let's begin our journey!</h5>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: 'center',
      target: 'body',
    },
    {
      content: (
        <div>
          <h4>Categories</h4>
          <h6>Category contains a group of flashcards with similar subjects.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step2',
    },
    {
      content: 'Create a category instantly from home page.',
      placement: 'bottom',
      styles: {
        options: {
          width: 300,
        },
      },
      target: '.step3',
      title: 'Category',
      spotlightPadding: 10,
    },
    {
      content: (
        <div>
          <h4>Recent: </h4>
          <h6>Recent section includes all the recent activities like folder creation, category addition etc.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step4',
      placement: 'right',
    },
    {
      content: (
        <div>
          <h4>View Folders: </h4>
          <h6>Folder container group of sets created by user.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step5',
      placement: 'left',
    },
    {
      content: (
        <div>
          <h4>Quick Access: </h4>
          <h6>Quickly Access folders, sets and categories from sidebar.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step6',
      placement: 'right',
    },
    {
      content: (
        <div className="text-left">
          <h4>Click on Folders</h4>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.step7',
    },
    {
      content: (
        <div>
          <h4>Folders Page: </h4>
          <h6>A Folder contains group of sets created by user. You can View, Update/ Edit/ Delete/ Search Folders.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step8',
      placement: 'top',
    },
    {
      content: (
        <div className="text-left">
          <h4>Click on Sets</h4>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.step9',
    },
    {
      content: (
        <div>
          <h4>Sets Page: </h4>
          <h6>A Set contains group of categories created by user. You can View, Update/ Edit/ Delete/ Search Sets.</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step10',
      placement: 'top',
    },
    {
      content: (
        <div className="text-left">
          <h4>Click on Category</h4>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.step11',
    },
    {
      content: (
        <div>
          <h4>Category Page: </h4>
          <h6>
            A Category contains a group of flashcards with similar subjects. You can View, Update/ Edit/ Delete/ Search
            Sets.
          </h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step12',
      placement: 'top',
    },
    {
      content: (
        <div>
          <h6>View All profile setting here</h6>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
        offset: 0,
      },
      spotlightPadding: 10,
      target: '.step13',
      placement: 'bottom',
      title: 'Profile Settings',
    },

    {
      content: (
        <div>
          <h6>
            Lets create a category to explore flashcards. A Category contains a group of flashcards with similar
            subjects.
          </h6>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.step14',
      title: 'Click on Add New Category',
    },
  ])

  // useEffect(() => {
  //   if (categoryAction) {
  //     // document.querySelector('#wrapper').scrollIntoView()
  //     setTimeout(() => {

  //     }, 500)
  //   }
  // }, [categoryAction])

  const handleJoyrideCallback = data => {
    const { action, index, type, status, lifecycle } = data
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
    }
    if ((index === 5 || index === 6 || index === 8 || index === 10) && lifecycle === 'tooltip') {
      // setScrollTop(true)
      $('.sidebar').addClass('show')
    }
    if (index === 11 && lifecycle === 'complete') {
    }
    if (index === 11 && lifecycle === 'complete') {
      history.push('/home')
    }
  }

  const goToSlide = slide => {
    hh.go(slide)
  }
  const getHelpers = helpers => {
    hh = helpers
  }
  
  useDidUpdateEffect(() => {
    if (showJoyRidePopupState) {
      dispatch(showJoyRidePopup(false))
      setRun(false)
    }
  }, [showJoyRidePopupState])

  const checkIfOuterRoute = () => {
    // if (history.pathname.includes('/blogs')) return true
    if (outerRoutes.indexOf(history.pathname) > -1) return true
    else return false
  }

  if (readyForFirstRender) {
    return (
      <>
        {allowed && <_ToastsContainer store={_ToastsStore} position={_ToastsContainerPosition?.TOP_RIGHT} />}
        {lukeToken && !checkIfOuterRoute() ? <>
          <ReactJoyride
            callback={handleJoyrideCallback}
            continuous={true}
            getHelpers={getHelpers}
            run={run}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            steps={steps}
            styles={{
              options: {
                zIndex: 10000,
              },
            }}
          />
          {history.pathname === '/verifyEmail' || history.pathname === '/confirm-email' ? null : (
            <Sidebar setRun={setRun} goToSlide={goToSlide} />
            )}
          <div id="wrapper">
            {history.pathname === '/verifyEmail' || history.pathname === '/confirm-email' ? null : (
              <DashboardNav setLukeToken={setLukeToken} setRun={setRun} />
              )}
            <div className="dashboardLayoutContainer container-fluid">
              {React.cloneElement(children, {
                setRun: setRun,
                setLukeToken: setLukeToken,
              })}
            </div>
          </div>
        </>
        :
        <>
          {React.cloneElement(children, {
            setLukeToken: setLukeToken,
          })}
        </>}
      </>
    )
  } else return <></>
}

export default DashboardLayout

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import $ from 'jquery'

const DashboardNav = ({ setLukeToken, setRun }) => {
  const history = useRouter()
  const toggleSidebar = () => {
    $('.sidebar').toggleClass('show')
  }
  let activeUser = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data') ? JSON.parse(localStorage.getItem('active_user_data')) : {}
  
  const handleRouting = path => {
    history.push(`/${path}` )
  }
  const handleLogout = () => {
    localStorage.removeItem('active_user_data')
    localStorage.removeItem('luke_token')
    history.push(`/login`)
    setLukeToken(null)
  }
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar static-top">
      <div>
      {typeof window !== 'undefined' && window.innerWidth > 768 && 
          <i className="fa fa-bars ml-2 sidebarBurger" onClick={toggleSidebar} />
        }
        </div>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item no-arrow mr-3 d-flex align-items-center">
          <div className="text-primary cursorPointer" onClick={() => setRun(true)}>
            {/* <i className="fa-regular fa-lightbulb"></i> */}
            Guide <i className="fa fa-book fa-sm fa-fw  mr-2 text-gray-400"></i>
          </div>
        </li>
        <li className="nav-item dropdown no-arrow step13">
          <div
            className="dropdown-toggle d-flex align-items-center"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
          >
            <span className="profileUsername mr-2 text-gray-600">{activeUser ? activeUser.first_name : ''}</span>
            <img className="img-profile rounded-circle" src="/images/user_img.png" />
          </div>
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            <div className="dropdown-item" onClick={() => handleRouting('profile')}>
              <i className="fa fa-user fa-sm fa-fw mr-2 text-gray-400"></i> Profile{' '}
            </div>
            <div className="dropdown-item">
              <i className="fa fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i> Settings
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={handleLogout} data-toggle="modal" data-target="#logoutModal">
              <i className="fa fa-sign-out fa-sm fa-fw mr-2 text-gray-400"></i> Logout
            </div>
          </div>
        </li>
      </ul>
      {/* {typeof window !== 'undefined' ?? window.innerWidth < 769 ? <i className="fa fa-bars ml-2 sidebarBurger" onClick={toggleSidebar}></i> : null} */}
    </nav>
  )
}

export default DashboardNav

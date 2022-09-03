import React, { Component } from 'react'
import Link from 'next/link'
import $ from 'jquery'


export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageData: typeof window !== 'undefined' ?? localStorage.getItem('active_user_data') ? JSON.parse(localStorage.getItem('active_user_data')) : {},
      links: [
        { link: '/home', name: 'Home', icon: 'home', liClasses: '' },
        { link: '/folder', name: 'Folders', icon: 'folder', liClasses: 'step7' },
        { link: '/sets', name: 'Sets', icon: 'file-text', liClasses: 'step9' },
        { link: '/category', name: 'Category', icon: 'th-large', liClasses: 'step11' },
        { link: '/blogs', name: 'Blogs', icon: 'th-large', liClasses: 'step13' },
      ],
      active: 0,
    }
  }

  ActiveTab() {
    this.state.links.forEach((link, index) => {
      if (window.location.pathname === link.link) {
        $(`#tab${index}`).addClass('active')
      } else {
        $(`#tab${index}`).removeClass('active')
      }
    })
  }
  Nestedtabs() {
    if (window.location.pathname.startsWith('/folder/')) {
      $(`#tab${2}`).addClass('active')
    } else if (window.location.pathname.startsWith('/sets/')) {
      $(`#tab${3}`).addClass('active')
    } else if (window.location.pathname.startsWith('/category/')) {
      $(`#tab${3}`).addClass('active')
    }
  }

  componentDidUpdate() {
    this.ActiveTab()
    this.Nestedtabs()
  }

  render() {
    return (
      <div className={`sidebar collapse step6 ${typeof window !== 'undefined' ?? window.innerWidth > 768 ? 'show' : ''}`} id="sidebarCollapsible">
        <Link href="/">
          <div className="sidebar-heading">
            <img src="/images/lets-flash.png" alt="" width="60px" />
          </div>
        </Link>
        <div className="sidebar-header">
          <img src={'/images/user_img.png'} alt="" />
          <h3>Welcome!</h3>
          <h2 className="px-3">{`${this.state.storageData.first_name ? this.state.storageData.first_name : ''} ${
            this.state.storageData.last_name ? this.state.storageData.last_name : ''
          }`}</h2>
          <hr />
        </div>

        <nav className="sidebar-nav">
          <ul className="nav">
            {this.state.links &&
              this.state.links.map(({ link, name, icon, liClasses }, i) => {
                return (
                  <li
                    key={i}
                    data-toggle="collapse"
                    data-target="#sidebarCollapsible"
                    aria-expanded="true"
                    className={`nav-item ${liClasses}`}
                    id={`tab${i}`}
                    onClick={() => {
                      setTimeout(() => {
                        this.props.goToSlide(liClasses === 'step7' ? 7 : liClasses === 'step9' ? 9 : 11)
                      }, 100)
                    }}
                  >
                    <Link href={link}>
                      <a className="nav-link" >
                        <span><i className={`nav-icon fa fa-${icon}`}></i>&ensp; {name}</span>
                      </a>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </nav>
      </div>
    )
  }
}

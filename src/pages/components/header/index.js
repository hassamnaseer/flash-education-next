import React, { useEffect, useState } from "react";
import Link from "next/link"

const Header = () =>  {
  const [pathName, setPathName] = useState('')
  const regex = /\d/ //to see if number exist in Path

  useEffect(() => {
    setPathName(window.location.pathname)
  }, [])
  
  const isMobileQuestion = regex.test(pathName)

    return (
      <>
        {!isMobileQuestion ?
        <header>
          <nav className="navbar navbar-expand-md fixed-top">
            <div className="container">
              <a href="/" className="navbar-brand">
                <img className="img-fluid" src="/images/logo.png" alt="logo" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav ml-auto">
                  {/* {pathName === "/" && (
                    <>
                      <li className="nav-item active">
                        <a className="nav-link smoothscroll" href="#benefits" data-toggle="collapse" data-target=".navbar-collapse.show">
                          Benefits
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link smoothscroll" href="#mission" data-toggle="collapse" data-target=".navbar-collapse.show">
                          Mission
                        </a>
                      </li>
                    </>
                  )} */}
                  {pathName === "/" && (
                    <li className="nav-item active">
                      <a className="nav-link smoothscroll" href="#benefits" data-toggle="collapse" data-target=".navbar-collapse.show">
                        Benefits
                      </a>
                    </li>
                  )}
                  {pathName === "/" && (
                    <li className="nav-item">
                      <a className="nav-link smoothscroll" href="#mission" data-toggle="collapse" data-target=".navbar-collapse.show">
                        Mission
                      </a>
                    </li>
                  )}
                  <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <a href="/login" className="btn">
                      Login
                    </a>
                  </li>
                  <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <a href="/register" className="btn">
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header> : null}
      </>
    );
}

export default Header
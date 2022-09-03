import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUser, getAuthUserDetails, onUserInvite } from '../../redux/actions/user'
import { toaster } from '../../helper/Toaster'

export class User extends Component {
  constructor(props) {
    super(props)
    let storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data')
      ? JSON.parse(localStorage.getItem('active_user_data'))
      : {}
    this.state = {
      user_id: storageData && storageData.login_user_id,
      users: {},
      referrals: '',
      total_invites: 0,
      accepted_invites: 0,
      embedLinkCopied: false,
      shareLink: ``
    }
  }
  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') this.setState({ shareLink: `${window.location.origin}/register?referral=${this.state.user_id}` })
    this.props.getUser(this.state.user_id)
    this.props.getAuthUserDetails(this.state.user_id)
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { user_list, user_details } = newProps
    console.log('user_list', user_list)
    if (user_list && user_list.code === 200) {
      this.setState({ users: user_list.data })
    } else if (user_list && user_list.code === 400) {
      return toaster('error', user_list.message)
    }
    if (user_details) {
      this.setState({ total_invites: user_details.total_invites, accepted_invites: user_details.accepted_invites })
    }
  }

  handleCopyEmbedLink = val => {
    if (typeof window !== 'undefined') {
      const textArea = document.createElement('textarea')
      textArea.value = val
      document.body.appendChild(textArea)
      textArea.select()
      textArea.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(textArea.value)
      textArea.remove()
      this.props.onUserInvite(this.state.user_id)
      this.setState({ embedLinkCopied: true })
      setTimeout(() => {
        this.setState({ embedLinkCopied: false })
        this.props.getAuthUserDetails(this.state.user_id)
      }, 4000)
    }
  }

  render() {
    const { users, referrals, embedLinkCopied, total_invites, accepted_invites } = this.state

    return (
      <div>
        <section className="cate-hdng">
          <div className="container">
            <div className="cate_hdng">
              <div className="">
                <span className="h5 mb-0 text-gray-800 font-weight-bold">Profile </span>
              </div>
            </div>
          </div>
        </section>
        <section className="cate-sec">
          <div className="container profileResponsiveCard">
            <div className="row">
              <div className="col-12 col-md-10 col-lg-8 mx-auto ">
                <div className="row profile_media media  rounded border p-4 pr-5 align-items-center shadow">
                  <div className="col-md-5 col-12 media-left justify-content-center mb-3 mb-md-0">
                    <img src="/images/user_img.png" alt="" className="rounded-circle shadow" />
                  </div>
                  <div className="col-md-5 col-12 media-body">
                    <h4 className="pb-1 mb-3">
                      {users.first_name} <span>{users.last_name}</span>
                    </h4>
                    <p className="mb-2">
                      <i className="fa fa-envelope-o mr-2" />
                      <span>{users.email}</span>
                    </p>
                    <p className="mb-2">
                      <i className="fa fa-phone mr-2" />
                      <span>Phone Number : </span>
                      <span>{users.phone_number}</span>
                    </p>
                    <p className="mb-2">
                      <i className="fa fa-retweet mr-2" />
                      <span>Total Invites : </span>
                      <span>{total_invites}</span>
                    </p>
                    <p className="mb-2">
                      <i className="fa fa-retweet mr-2" />
                      <span>Accepted Invites : </span>
                      <span>{accepted_invites}</span>
                    </p>
                    <p className="mb-2">
                      <i className="fa fa-users mr-2" />
                      <span>
                        Share with friends :{' '}
                        <div className="d-flex" style={{ minWidth: '400px' }}>
                          <input
                            type="text"
                            className="form-control referralFormControl"
                            style={{ color: '#1D1D1D', fontSize: '14px', height: '1.85rem' }}
                            value={this.state.shareLink}
                            readonly
                          />
                          <div onClick={() => this.handleCopyEmbedLink(this.state.shareLink)}>
                            {embedLinkCopied ? (
                              <span className={`copy copied`}>
                                <i className="fa fa-check-circle"></i>
                              </span>
                            ) : (
                              <span className="copy">
                                <i className="fa fa-copy"></i>
                              </span>
                            )}
                          </div>
                        </div>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
const mapStateToProps = store => {
  return {
    user_list: store.user.user_list,
    user_details: store.user.user_details,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUser: params => dispatch(getUser(params)),
    getAuthUserDetails: params => dispatch(getAuthUserDetails(params)),
    onUserInvite: params => dispatch(onUserInvite(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)

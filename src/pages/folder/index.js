import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFolder, addEditFolder, deleteFolder } from '../../redux/actions//folder'
import { toaster } from '../../helper/Toaster'
import { ModalPopup } from '../../helper/ModalPopup'
import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'
import { withRouter } from 'next/router'

let addFlag = false
let editFlag = false
let deleteFlag = false

const Folder = withRouter(class extends Component {
  constructor(props) {
    super(props)
    var storageData = typeof window != 'undefined' ?? localStorage.getItem('active_user_data')
      ? JSON.parse(localStorage.getItem('active_user_data'))
      : {}
    this.state = {
      name: '',
      description: '',
      image: '',
      folder_id: '',
      folders: [],
      filtered_folders: [],
      role: storageData && storageData.role,
      user_id: storageData && storageData.login_user_id,
      addEditFunc: '',
      deletFunc: false,
      toggleFlag: true,
      folder_owner: 'all',
    }
  }

  UNSAFE_componentWillMount() {
    console.log(this.props);
    this.props.getFolder(this.state.user_id)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { folder_list, add_response, edit_response, delete_response } = newProps
    if (folder_list && folder_list.code === 200) {
      this.setState({
        folders: folder_list.data,
        filtered_folders: folder_list.data,
      })
    } else if (folder_list && folder_list.code === 400) {
      return toaster('error', folder_list.message)
    }

    if (add_response && add_response.code === 200 && addFlag) {
      toaster('success', add_response.message)
      addFlag = false
      this.setState({ addEditFunc: '' })
      this.props.getFolder(this.state.user_id)
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster('error', add_response.message)
      addFlag = false
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster('success', edit_response.message)
      console.log('EDIT: ', this.state.user_id)
      this.props.getFolder(this.state.user_id)
      editFlag = false
      this.setState({ addEditFunc: '' })
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster('error', edit_response.message)
      editFlag = false
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster('success', delete_response.message)
      this.props.getFolder(this.state.user_id)
      deleteFlag = false
      this.setState({ deletFunc: false })
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster('error', delete_response.message)
      deleteFlag = false
    }
  }

  handleActions = (e, flag, data) => {
    if (flag === 'view') {
      this.props.router.push({ pathname: `/folder/${data.name}`, query: data })
    } else if (flag === 'add') {
      this.setState({
        addEditFunc: 'add',
        name: '',
        description: '',
        folder_id: '',
      })
    } else if (flag === 'edit') {
      this.setState({
        addEditFunc: 'edit',
        name: data.name,
        description: data.description,
        folder_id: data.folder_id,
      })
    } else if (flag === 'delete') {
      this.setState({ folder_id: data.folder_id, deletFunc: true })
    }
  }
  handleChange = (e, name) => {
    if (name === 'name' && e.target.value.length > 20) {
      return
    } else if (name === 'description' && e.target.value.length > 100) {
      return
    }
    this.setState({ [name]: e.target.value })
  }

  handleSearch = e => {
    const filter = []
    this.state.filtered_folders &&
      this.state.filtered_folders.map(folder => {
        if (folder.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          filter.push(folder)
        }
      })
    this.setState({ filtered_folders: filter })
    if (e.target.value.length < 1) {
      this.setState({ filtered_folders: this.state.folders })
    }
  }

  modalClose = (e, name) => {
    if (name === 'delete_popup') {
      this.setState({
        folder_id: '',
        deletFunc: false,
      })
    } else if (name === 'add_edit_popup') {
      this.setState({
        addEditFunc: '',
        name: '',
        description: '',
        folder_id: '',
      })
    }
  }

  submitData = (e, flag) => {
    const { name, description, user_id, folder_id } = this.state
    let formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('user_id', user_id)
    if (flag === 'add') {
      if (name === '') {
        return toaster('error', 'Please enter folder name')
      }
      this.props.addEditFolder(formData, 'add')
      addFlag = true
    } else if (flag === 'edit') {
      if (name === '') {
        return toaster('error', 'Please enter folder name')
      }
      formData.append('folder_id', folder_id)
      this.props.addEditFolder(formData, 'edit')
      editFlag = true
    } else if (flag === 'delete') {
      this.props.deleteFolder(folder_id)
      deleteFlag = true
    }
  }

  handleSelect = (e, name) => {
    let folders = this.state.folders
    if (e.target.value === 'all') {
      this.setState({ filtered_folders: folders })
    } else if (e.target.value === 'own') {
      let data = []
      folders &&
        folders.map((o, i) => {
          if (o.user_id === this.state.user_id) {
            data.push(o)
          }
        })
      this.setState({ filtered_folders: data })
    }
    this.setState({ [name]: e.target.value })
  }
  render() {
    const { filtered_folders, name, description, addEditFunc, toggleFlag, deletFunc, user_id, role, folder_owner } =
      this.state
    return (
      <div className="step8">
        <Meta
          title="LetsFlash - Virtual Study Assistant"
          desc="Virtual Study Assistant for any Occasion."
          canonical="https://letsflash.co/folder"
          schema={OrganizationSchema}
          schema2={WebpageSchema.folders}
          schema3={BreadcrumbSchema.folders}
          schema4={WebsiteSchema}
        />
        <section className="cate-hdng ">
          <div className="container">
            <div className="cate_hdng">
              <div className="inner-logo">
                {/* <div className="logo-icns">
                  <div className="nav-icn-lnk" data-toggle="collapse" data-target="#sidebarCollapsible" aria-expanded="true">
                    <img src="/images/nav.png" alt="navbar" className="nav-icn" />
                  </div>
                </div> */}
                <input
                  type="text"
                  id="searchInput"
                  onChange={e => this.handleSearch(e)}
                  placeholder="Search something here"
                />

                <div className="srchbr-usricn">
                  <div className="search-bar-catagory"></div>
                  <div className="usr-icn dropdown" style={{ cursor: 'pointer' }}>
                    <button className="addNewHeaderButton btn btn-default" onClick={e => this.handleActions(e, 'add')}>
                      <i className="fa fa-plus"></i> Add New
                    </button>
                  </div>
                  {/* {window.innerWidth < 768 ? (
                    <div
                      className="nav-icn-lnk text-center"
                      data-toggle="collapse"
                      data-target="#sidebarCollapsible"
                      aria-expanded="true"
                    >
                      <img
                        src="/images/nav.png"
                        alt="navbar"
                        className="nav-icn"
                      />
                    </div>
                  ) : null} */}
                </div>
              </div>
              <div className="folder_heading">
                <h2>Folders</h2>
              </div>

              <div className="home_folders_body row no-gutters">
                {filtered_folders &&
                  filtered_folders.map(data => {
                    return (
                      <div key={data.folder_id} class="col-lg-2 col-5 col-md-4 col-sm-6 mr-2 mb-2">
                        <div class="box19 home_folders_item">
                          <i className="fa fa-folder py-1 pl-3"></i>
                          <div className="home_recents-text pb-3 pl-3">
                            <div>{data.name}</div>
                            <span>{data.description}</span>
                          </div>
                          {/* <img src="http://bestjquery.com/tutorial/hover-effect/demo102/images/img-1.jpg" alt="" /> */}
                          <div class="box-content">
                            <ul class="icon">
                              <li class="mx-1">
                                {(role === 'admin' || user_id === data.user_id) && (
                                  <img
                                    src="/images/icon5.svg"
                                    alt="edit"
                                    width="34px"
                                    onClick={e => this.handleActions(e, 'edit', data)}
                                  />
                                )}
                              </li>
                              <li class="mx-1">
                                <img
                                  src="/images/icon3.svg"
                                  alt="view"
                                  width="34px"
                                  onClick={e => this.handleActions(e, 'view', data)}
                                />
                              </li>
                              <li class="mx-1">
                                {(role === 'admin' || user_id === data.user_id) && (
                                  <img
                                    src="/images/icon4.svg"
                                    alt="delete"
                                    width="34px"
                                    onClick={e => this.handleActions(e, 'delete', data)}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>

        {deletFunc && (
          <ModalPopup
            className="delete-flag delete-all-folder"
            popupOpen={deletFunc}
            popupHide={e => this.modalClose(e, 'delete_popup')}
            title="Delete Folder"
            content={<span>Are you sure you want to delete.</span>}
            footer={
              <div>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4 mr-4"
                  onClick={e => this.modalClose(e, 'delete_popup')}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success px-4"
                  onClick={e => this.submitData(e, 'delete')}
                >
                  PROCEED
                </button>
              </div>
            }
          />
        )}
        {addEditFunc !== '' && (
          <ModalPopup
            className="add-edit-flag edit-folder-1"
            popupOpen={addEditFunc}
            popupHide={e => this.modalClose(e, 'add_edit_popup')}
            title={addEditFunc === 'add' ? 'Add Folder' : 'Edit Folder'}
            content={
              <div>
                <div className="row px-md-2">
                  <div className="col-12 mt-1">
                    <div className="form-label-group label-group-circle">
                      <input
                        type="text"
                        name="name"
                        id="c_name"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={e => this.handleChange(e, 'name')}
                      />
                      <label for="c_name">Folder Name</label>
                    </div>
                  </div>
                  <div className="col-12 mt-1">
                    <div className="form-label-group label-group-circle">
                      <input
                        type="text"
                        id="c_description"
                        className="form-control"
                        placeholder="Description"
                        name="description"
                        value={description}
                        onChange={e => this.handleChange(e, 'description')}
                      />
                      <label for="c_description">Folder Description</label>
                    </div>
                  </div>
                </div>
              </div>
            }
            footer={
              <div>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4 mr-4"
                  onClick={e => this.modalClose(e, 'add_edit_popup')}
                >
                  CANCEL
                </button>
                {addEditFunc === 'add' && (
                  <button
                    className="btn btn-outline-success px-4"
                    type="button"
                    onClick={e => this.submitData(e, 'add')}
                  >
                    ADD
                  </button>
                )}
                {addEditFunc === 'edit' && (
                  <button
                    type="button"
                    className="btn btn-outline-success px-4"
                    onClick={e => this.submitData(e, 'edit')}
                  >
                    EDIT
                  </button>
                )}
              </div>
            }
          />
        )}
      </div>
    )
  }
})

const mapStateToProps = store => {
  return {
    folder_list: store.folder.folder_list,
    add_response: store.folder.add_response,
    edit_response: store.folder.edit_response,
    delete_response: store.folder.delete_response,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: params => dispatch(getFolder(params)),
    addEditFolder: (params, flag) => dispatch(addEditFolder(params, flag)),
    deleteFolder: params => dispatch(deleteFolder(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Folder)

import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import Link from 'next/link'
import { getFolder, addEditFolder, deleteFolder } from '../../redux/actions/folder'
import { getRecentUpdates } from '../../redux/actions/recents'
import { addEditCategory, deleteCategory, getCategoryByUserId, showJoyRidePopup } from '../../redux/actions/category'
import { toaster } from '../../helper/Toaster'
import { ModalPopup } from '../../helper/ModalPopup'
import ScrollContainer from 'react-indiana-drag-scroll'

import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'
import { withRouter } from 'next/router'

// import img from '/images/Copy.png';

let addFlag = false
let editFlag = false
let deleteFlag = false
let storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data') ? JSON.parse(localStorage.getItem('active_user_data')) : {}

const Home = withRouter(class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      image: '',
      folder_id: '',
      folders: [],
      filtered_folders: [],
      role: storageData && storageData?.role,
      user_id: storageData && storageData?.login_user_id,
      addEditFunc: '',
      deletFunc: false,
      toggleFlag: true,
      folder_owner: 'all',
      recents: null,
      applied_folder_data: this.props.location?.state,
      readyForRender: false,
      links: [
        { link: '/home', name: 'Home', icon: 'home' },
        { link: '/folders', name: 'Folders', icon: 'folder' },
        { link: '/sets', name: 'Sets', icon: 'file-text' },
        { link: '/category', name: 'Category', icon: 'th-large' },
      ],
    }
  }

  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('luke_token')) this.props.router.push("/login")
      else {
        this.setState({ readyForRender: true });
        this.props.getCategoryByUserId(storageData?.login_user_id)
        this.props.getFolder(storageData?.login_user_id)
        this.props.getRecentUpdates(storageData?.login_user_id)
      }
    }
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
      this.props.getCategoryByUserId(this.state.user_id)
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster('error', add_response.message)
      addFlag = false
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster('success', edit_response.message)
      // this.props.getFolder("");
      editFlag = false
      this.setState({ addEditFunc: '' })
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster('error', edit_response.message)
      editFlag = false
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster('success', delete_response.message)
      // this.props.getFolder("");
      deleteFlag = false
      this.setState({ deletFunc: false })
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster('error', delete_response.message)
      deleteFlag = false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.recents !== this.props.recents ||
      nextProps.categories !== this.props.categories ||
      nextProps.isRecentsLoading !== this.props.isRecentsLoading ||
      nextProps.isFolderLoading !== this.props.isFolderLoading ||
      // nextProps.add_response !== this.props.add_response ||
      nextState.addEditFunc !== this.state.addEditFunc ||
      nextState.name !== this.state.name ||
      nextState.description !== this.state.description
    )
  }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.recents !== this.props.recents) {
  //     var sorted = _.orderBy(this.props.recents, function(d) {return new Date(d.recent_date)}, ["desc"])
  //     this.setState({
  //       recents: sorted
  //     });
  //   }
  // }

  camalize = str => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }
  handleRouting = (type, data) => {
    console.log("🚀 ~ file: index.js ~ line 132 ~ extends ~ type", type)
    console.log("🚀 ~ file: index.js ~ line 126 ~ extends ~ data", data)

    let route = ''

    if (type === 'set') route = 'category'
    else if (type === 'folder') route = 'sets'
    else route = type

    const name = this.camalize(data.name)
    this.props.router.push({ pathname: `/${route}/${name}`, query: data })
  }

  handleFoldersRouting = (type, data) => {
    console.log("🚀 ~ file: index.js ~ line 132 ~ extends ~ type", type)
    console.log("🚀 ~ file: index.js ~ line 126 ~ extends ~ data", data)

    let route = ''

    if (type === 'set') route = 'category'
    else if (type === 'folder') route = 'sets'
    else route = type

    const name = this.camalize(data.name)
    this.props.router.push({ pathname: `/${route}`, query: data })
  }

  handleActions = (e, flag, data) => {
    const { applied_folder_data, user_id, role } = this.state
    console.log("🚀 ~ file: index.js ~ line 132 ~ Home ~ applied_folder_data", applied_folder_data)
    if (flag === 'view') {
      this.props.router.push({ pathname: 'sets', state: data })
    } else if (flag === 'add') {
      this.props.showJoyRidePopup(true)
      // this.props.setRun(false)
      if (applied_folder_data !== undefined && applied_folder_data.user_id !== user_id && role !== 'admin') {
        this.setState({ alertFunc: true })
      } else {
        this.setState({
          addEditFunc: 'add',
          name: '',
          description: '',
        })
      }
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
    console.log('VAL: ', e.target.value)
    console.log('Name: ', name)
    this.setState({ [name]: e.target.value })
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
      this.props.addEditCategory(formData, 'add')
      addFlag = true
    } else if (flag === 'edit') {
      if (name === '') {
        return toaster('error', 'Please enter folder name')
      }
      formData.append('folder_id', folder_id)
      this.props.addEditCategory(formData, 'edit')
      editFlag = true
    } else if (flag === 'delete') {
      this.props.deleteCategory(folder_id)
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

    const { recents, isRecentsLoading, isFolderLoading, categories } = this.props
    return (
      <>
        {this.state.readyForRender &&
          <>

            <div>
              <Meta
                title="Home - LetsFlash - Virtual Study Assistant"
                desc="Virtual Study Assistant for any Occasion."
                canonical="https://letsflash.co/home"
                schema={OrganizationSchema}
                schema2={WebpageSchema.app}
                schema3={BreadcrumbSchema.app}
                schema4={WebsiteSchema}
              />
              {/* <DashboardNav /> */}
              <div className="step2">
                <div className="d-sm-flex align-items-center justify-content-between mb-3">
                  <span className="h5 mb-0 text-gray-800 font-weight-bold">Categories</span>
                  <div
                    className="usr-icn ml-auto step3"
                    style={{ cursor: 'pointer' }}
                    onClick={e => this.handleActions(e, 'add')}
                  >
                    <div className="addNewHeaderButton btn btn-default step14">
                      <i className="fa fa-plus"></i> Add New
                    </div>
                  </div>
                </div>
                <div className="home_categories_main">
                  <ScrollContainer className="scroll-container">
                    {categories.data &&
                      categories.data
                        .slice(0)
                        .reverse()
                        .map((item, i) => {
                          return (
                            <div
                              className="home_categories_child"
                              onClick={() => this.handleRouting('category', item)}
                              key={i}
                            >
                              <span>
                                <div className="trimCatName">{item.name}</div>
                              </span>
                            </div>
                          )
                        })}
                  </ScrollContainer>
                </div>
              </div>

              <div className="row">
                <div className="homeCard col-lg-4 col-md-12 col-sm-12 col-12 step4">
                  <div className="home_recents">
                    <div className="categories_recents-heading">
                      <h5 className="mt-2 mb-1 text-gray-800">Recents</h5>
                      <a href="/recents">
                        <>
                          {' '}
                          <i className="fa fa-eye text-dark"></i>
                        </>
                      </a>
                    </div>
                    <div className="home_recents-body mt-3">
                      {isRecentsLoading && (
                        <div className="home_recents-item text-center" style={{ height: '310px' }}>
                          <div className="loader text-center">
                            <span className="span"></span>
                          </div>
                        </div>
                      )}
                      {recents &&
                        !isRecentsLoading &&
                        recents
                          .map((recent, i) => {
                            return (
                              // <Link to={`/${(recent.type).toLowerCase()}/${recent.name}`}>
                              <div
                                className="home_recents-item"
                                key={i}
                                onClick={() => this.handleRouting(recent.type.toLowerCase(), recent)}
                              >
                                <span>
                                  <img src="/images/Copy.png" alt="copy icon" />
                                </span>
                                <div className="home_recents-text" style={{ color: '#6c757d' }}>
                                  <div>{recent.name}</div>
                                  <span>{recent.type}</span>
                                </div>
                              </div>
                              // </Link>
                            )
                          })
                          .slice(0, 6)}
                    </div>
                  </div>
                </div>
                <div className="homeCard col-lg-8 col-md-12 col-sm-12 col-12 step5">
                  <div className="categories_recents-heading">
                    <h5 className="mt-2 mb-1 text-gray-800">Folders</h5>
                    <Link href="/folder">
                      <>
                        {' '}
                        <i className="fa fa-eye text-muted"></i>
                      </>
                    </Link>
                  </div>
                  <div className="home_folders_body row mt-3 px-4">
                    {isFolderLoading ? (
                      <div className="home_recents-item text-center" style={{ height: '310px', width: '100%' }}>
                        <div className="loader text-center">
                          <span className="span"></span>
                        </div>
                      </div>
                    ) : (
                      filtered_folders &&
                      filtered_folders.map(data => {
                        return (
                          <div
                            className="home_folders_item p-4 col-lg-2 col-5 col-md-3 col-sm-5"
                            onClick={() => this.handleFoldersRouting('folder', data)}
                            style={{ height: 'fit-content', minWidth: '130px' }}
                            key={data.folder_id}
                          >
                            <img src="/images/ICONS/folder_ic.svg" width="28px" />
                            <div className="home_recents-text pt-2" style={{ color: '#6c757d' }}>
                              <div>{data.name}</div>
                              <span>
                                <div className="trimDescription">{data.description}</div>
                              </span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

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
                  title={addEditFunc === 'add' ? 'Add Category' : 'Edit Category'}
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
                            <label for="c_name">Category Name</label>
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
                            <label for="c_description">Category Description</label>
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
                          type="button"
                          className="btn btn-outline-success px-4"
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
          </>
        }
      </>
    )
  }
})

const mapStateToProps = store => {
  return {
    folder_list: store.folder.folder_list,
    sets_list: store.sets.sets_list,
    add_response: store.category.add_response,
    edit_response: store.folder.edit_response,
    delete_response: store.folder.delete_response,
    isFolderLoading: store.folder.isLoading,
    recents: store.recents.recents,
    isRecentsLoading: store.recents.isLoading,
    categories: store.category.category_list,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: params => dispatch(getFolder(params)),
    addEditFolder: (params, flag) => dispatch(addEditFolder(params, flag)),
    deleteFolder: params => dispatch(deleteFolder(params)),
    getRecentUpdates: params => dispatch(getRecentUpdates(params)),
    getCategoryByUserId: params => dispatch(getCategoryByUserId(params)),
    addEditCategory: (params, flag) => dispatch(addEditCategory(params, flag)),
    deleteCategory: params => dispatch(deleteCategory(params)),
    showJoyRidePopup: params => dispatch(showJoyRidePopup(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

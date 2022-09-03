import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategory, addEditCategory, deleteCategory, getCategoryByUserId } from '../../redux/actions//category'
import { getSets } from '../../redux/actions//sets'
import { getFolder } from '../../redux/actions//folder'
import { toaster } from '../../helper/Toaster'
// import Questions from './Questions'
import { ModalPopup } from '../../helper/ModalPopup'

import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'
import { withRouter } from 'next/router'

let getFlag = false
let addFlag = false
let editFlag = false
let deleteFlag = false

const Category = withRouter(class extends Component {
  constructor(props) {
    super(props)

    var storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data')
      ? JSON.parse(localStorage.getItem('active_user_data'))
      : {}

    console.log("in category/index.js");

    this.state = {
      name: '',
      description: '',
      image: '',
      category_id: '',
      category_name: '',
      categories: [],
      filtered_categories: [],
      folders: [],
      add_folder: [],
      add_set: [],
      sets: [],
      role: storageData && storageData.role,
      user_id: storageData && storageData.login_user_id,
      addEditFunc: '',
      deletFunc: false,
      alertFunc: false,
      toggleFlag: true,
      select_folder: '',
      select_set: '',
      filter_folder: '',
      filter_set: '',
      applied_set_data: this.props.router.query,
    }
  }

  UNSAFE_componentWillMount() {
    typeof window !== 'undefined' ?? window.scrollTo(0, 0)
    if (this.state.applied_set_data === undefined || Object.keys(this.state.applied_set_data).length === 0) {
      this.props.getCategoryByUserId(this.state.user_id)
      getFlag = true
    } else {
      this.props.getCategory(this.state.applied_set_data.set_id)
      getFlag = true
    }
    getFlag = true
    this.props.getFolder(this.state.user_id)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { folder_list, sets_list, category_list, add_response, edit_response, delete_response } = newProps
    if (folder_list && folder_list.code === 200) {
      let folders = []
      let add_folder = []

      folders = folder_list.data
      folder_list &&
        folder_list.data.map((o, i) => {
          if (this.state.applied_set_data === undefined) {
            if (o.user_id === this.state.user_id || this.state.role === 'admin') {
              add_folder.push(o)
            }
          } else {
            if (o.folder_id === this.state.applied_set_data.folder_id) {
              add_folder.push(o)
            }
          }
        })
      this.setState({
        folders,
        add_folder,
      })
    }
    if (sets_list && sets_list.code === 200) {
      let sets = []
      let add_set = []
      sets = sets_list.data
      sets_list.data &&
        sets_list.data.map((o, i) => {
          if (this.state.applied_set_data === undefined) {
            if (o.user_id === this.state.user_id || this.state.role === 'admin') {
              add_set.push(o)
            }
          } else {
            if (o.set_id === this.state.applied_set_data.set_id) {
              add_set.push(o)
            }
          }
        })
      this.setState({
        sets,
        add_set,
      })
    }
    if (category_list && category_list.code === 200 && getFlag) {
      this.setState({
        categories: category_list.data,
        filtered_categories: category_list.data,
      })
      getFlag = false
    } else if (category_list && category_list.code === 400 && getFlag) {
      getFlag = false
      return toaster('error', category_list.message)
    }

    if (add_response && add_response.code === 200 && addFlag) {
      toaster('success', add_response.message)
      addFlag = false
      this.setState({ addEditFunc: '' })

      if (this.state.applied_set_data === undefined) {
        this.props.getCategoryByUserId(this.state.user_id)
      } else {
        this.props.getCategory(this.state.applied_set_data.set_id)
      }
      getFlag = true
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster('error', add_response.message)
      addFlag = false
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster('success', edit_response.message)
      this.props.getCategory(this.state.applied_set_data.set_id)
      getFlag = true
      editFlag = false
      this.setState({ addEditFunc: '' })
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster('error', edit_response.message)
      editFlag = false
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster('success', delete_response.message)
      this.props.getCategory(this.state.applied_set_data.set_id)
      getFlag = true
      deleteFlag = false
      this.setState({ deletFunc: false })
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster('error', delete_response.message)
      deleteFlag = false
    }
  }

  handleActions = (e, flag, data) => {
    const { applied_set_data, user_id, role } = this.state
    console.log('data', data)
    if (flag === 'view') {
      const name = this.camalize(data.name)
      this.props.router.push({ pathname: `/category/${name}`, query: data })
      this.setState({
        // toggleFlag: false,
        category_id: data.category_id,
        category_name: data.name,
        user_id: data.user_id,
      })
    } else if (flag === 'viewBack') {
      this.setState({ toggleFlag: true, category_id: '', category_name: '', user_id: data })
    } else if (flag === 'add') {
      if (applied_set_data !== undefined && applied_set_data.user_id !== user_id && role !== 'admin') {
        this.setState({ alertFunc: true })
      } else {
        this.setState({
          addEditFunc: 'add',
          name: '',
          description: '',
          category_id: '',
          category_name: '',
          select_folder: '',
          select_set: '',
        })
      }
    } else if (flag === 'edit') {
      this.setState({
        addEditFunc: 'edit',
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        category_name: data.name,
        select_folder: data.folder_id,
        select_set: data.set_id,
      })
      this.props.getSets(data.folder_id)
    } else if (flag === 'delete') {
      this.setState({ category_id: data.category_id, category_name: data.name, deletFunc: true })
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
    this.state.filtered_categories &&
      this.state.filtered_categories.map(item => {
        if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          filter.push(item)
        }
      })
    this.setState({ filtered_categories: filter })
    if (e.target.value.length < 1) {
      this.setState({ filtered_categories: this.state.categories })
    }
  }

  modalClose = (e, name) => {
    if (name === 'delete_popup') {
      this.setState({
        category_id: '',
        category_name: '',
        deletFunc: false,
      })
    } else if (name === 'add_edit_popup') {
      this.setState({
        addEditFunc: '',
        name: '',
        description: '',
        category_id: '',
        category_name: '',
      })
    } else if (name === 'alert_popup') {
      this.setState({
        alertFunc: false,
      })
    }
  }

  submitData = (e, flag) => {
    const { name, description, image, role, user_id, category_id, select_folder, select_set } = this.state
    let formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('image', image)
    formData.append('role', role)
    formData.append('user_id', user_id)
    formData.append('folder_id', select_folder)
    formData.append('set_id', select_set)
    if (flag === 'add') {
      if (select_folder === '') {
        return toaster('error', 'Please select folder')
      } else if (select_set === '') {
        return toaster('error', 'Please select set')
      } else if (name === '') {
        return toaster('error', 'Please enter category name')
      }
      this.props.addEditCategory(formData, 'add')
      addFlag = true
    } else if (flag === 'edit') {
      if (select_folder === '') {
        return toaster('error', 'Please select folder')
      } else if (select_set === '') {
        return toaster('error', 'Please select set')
      } else if (name === '') {
        return toaster('error', 'Please enter category name')
      }
      formData.append('category_id', category_id)
      this.props.addEditCategory(formData, 'edit')
      editFlag = true
    } else if (flag === 'delete') {
      this.props.deleteCategory(category_id)
      deleteFlag = true
    }
  }

  // logOutUser = () => {
  //   localStorage.clear();
  //   this.props.history.push("/");
  // };

  camalize = str => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }

  handleSelect = (e, name) => {
    let categories = this.state.categories

    if (name === 'filter_folder') {
      let data = []
      if (e.target.value !== '') {
        categories &&
          categories.map((o, i) => {
            if (o.folder_id === parseInt(e.target.value)) {
              data.push(o)
            }
          })
      } else {
        data = categories
      }
      this.setState({ filtered_categories: data, filter_set: '', sets: [] })
    }
    if (name === 'filter_set') {
      let data = []
      if (e.target.value !== '') {
        categories &&
          categories.map((o, i) => {
            if (o.folder_id === parseInt(this.state.filter_folder) && o.set_id === parseInt(e.target.value)) {
              data.push(o)
            }
          })
      } else {
        categories &&
          categories.map((o, i) => {
            if (o.folder_id === parseInt(this.state.filter_folder)) {
              data.push(o)
            }
          })
      }
      this.setState({ filtered_categories: data })
    }

    if ((name === 'select_folder' || name === 'filter_folder') && e.target.value !== '') {
      this.props.getSets(e.target.value)
    }
    this.setState({ [name]: e.target.value })
  }
  render() {
    const {
      filtered_categories,
      name,
      description,
      addEditFunc,
      toggleFlag,
      deletFunc,
      alertFunc,
      user_id,
      role,
      filter_folder,
      filter_set,
      sets,
      folders,
      add_folder,
      add_set,
      applied_set_data,
      select_folder,
      select_set,
    } = this.state

    return (
      <div className="step12">
        <Meta
          title="Category - LetsFlash - Virtual Study Assistant"
          desc="Virtual Study Assistant for any Occasion."
          canonical="https://letsflash.co/category"
          schema={OrganizationSchema}
          schema2={WebpageSchema.category}
          schema3={BreadcrumbSchema.category}
          schema4={WebsiteSchema}
        />
        <section className="">
          <div className="container">
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
                {/* {window.innerWidth < 768 ?
                  <div className="nav-icn-lnk text-center" data-toggle="collapse" data-target="#sidebarCollapsible" aria-expanded="true">
                    <img src="/images/nav.png" alt="navbar" className="nav-icn" />
                  </div>
                  : null} */}
              </div>
            </div>
          </div>
        </section>
        {toggleFlag ? (
          <div>
            <section className="cate-hdng">
              <div className="container">
                <div className="cate_hdng">
                  <div className="category_heading">
                    <h2>Categories</h2>
                  </div>

                  <div className="categories_categories_main">
                    {filtered_categories &&
                      filtered_categories.map(item => {
                        return (
                          <div
                            className="box19 categories_categories_child col-lg-2 col-5 col-md-3 col-sm-6"
                            key={item.key}
                          >
                            <span className="trimCatName">{item.name}</span>

                            <div class="box-content" style={{ paddingTop: '3%' }}>
                              <ul class="icon">
                                <li class="mx-1">
                                  {(role === 'admin' || user_id === item.user_id) && (
                                    <img
                                      src="/images/icon5.svg"
                                      alt="edit"
                                      width="34px"
                                      onClick={e => this.handleActions(e, 'edit', item)}
                                    />
                                  )}
                                </li>
                                <li class="mx-1">
                                  <img
                                    src="/images/icon3.svg"
                                    alt="view"
                                    width="34px"
                                    onClick={e => this.handleActions(e, 'view', item)}
                                  />
                                </li>
                                <li class="mx-1">
                                  {(role === 'admin' || user_id === item.user_id) && (
                                    <img
                                      src="/images/icon4.svg"
                                      alt="delete"
                                      width="34px"
                                      onClick={e => this.handleActions(e, 'delete', item)}
                                    />
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </section>

            {alertFunc && (
              <ModalPopup
                className="alert-flag"
                popupOpen={alertFunc}
                popupHide={e => this.modalClose(e, 'alert_popup')}
                title="Alert"
                content={<span>You don't have a permission to add in other user's set.</span>}
              />
            )}
            {deletFunc && (
              <ModalPopup
                className="delete-flag"
                popupOpen={deletFunc}
                popupHide={e => this.modalClose(e, 'delete_popup')}
                title="Delete Category"
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
                className="add-edit-flag edit-set "
                popupOpen={addEditFunc}
                popupHide={e => this.modalClose(e, 'add_edit_popup')}
                title={addEditFunc === 'add' ? 'Add Category' : 'Edit Category'}
                content={
                  <div className="row px-md-2">
                    <div className="col-12  mt-1">
                      <div className="form-label-group label-group-circle">
                        <select
                          className="form-control"
                          id="sel1"
                          value={select_folder}
                          onChange={e => this.handleSelect(e, 'select_folder')}
                        >
                          <option value="">Choose Folder</option>
                          {add_folder &&
                            add_folder.map(data => {
                              return <option value={data.folder_id}>{data.name}</option>
                            })}
                        </select>
                      </div>
                    </div>
                    <div className="col-12  mt-1">
                      <div className="form-label-group label-group-circle">
                        <select
                          className="form-control"
                          id="sel1"
                          value={select_set}
                          onChange={e => this.handleSelect(e, 'select_set')}
                        >
                          <option value="">Choose Set</option>
                          {add_set &&
                            add_set.map(data => {
                              return <option value={data.set_id}>{data.name}</option>
                            })}
                        </select>
                      </div>
                    </div>
                    <div className="col-12  mt-1">
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
                        <label htmlFor="c_name">Category Name</label>
                      </div>
                    </div>
                    <div className="col-12  mt-1">
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
                        <label htmlFor="c_description">Category Description</label>
                      </div>
                    </div>
                  </div>
                  /* <input
                  type="file"
                  name="image"
                  value={image}
                  onChange={e => this.handleChange(e, "image")}
                /> */
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
        ) : (
          // <Questions state={this.state} handleActions={this.handleActions} />
          <></>
        )}
      </div>
    )
  }
})

const mapStateToProps = store => {
  return {
    folder_list: store.folder.folder_list,
    sets_list: store.sets.sets_list,
    category_list: store.category.category_list,
    add_response: store.category.add_response,
    edit_response: store.category.edit_response,
    delete_response: store.category.delete_response,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: params => dispatch(getFolder(params)),
    getSets: params => dispatch(getSets(params)),
    getCategory: params => dispatch(getCategory(params)),
    addEditCategory: (params, flag) => dispatch(addEditCategory(params, flag)),
    deleteCategory: params => dispatch(deleteCategory(params)),
    getCategoryByUserId: params => dispatch(getCategoryByUserId(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)

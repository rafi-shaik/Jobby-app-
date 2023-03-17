import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Filters extends Component {
  state = {apiStatus: apiStatusConstants.initial, profileDetails: {}}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.searchButtonClicked}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-pic" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
        <hr />
      </div>
    )
  }

  failureView = () => (
    <div className="profile-failure-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.retryButton}
      >
        Retry
      </button>
    </div>
  )

  renderCheckboxes = () => {
    const {employmentTypesList} = this.props

    return employmentTypesList.map(each => {
      const {changeEmploymentType} = this.props

      onClickEmployment = () => changeEmploymentType(each.employmentTypeId)

      return (
        <li
          className="category-item"
          key={category.categoryId}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      )
    })
  }

  renderEmploymentType = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="checkboxes-list">{this.renderCheckboxes()}</ul>
    </>
  )

  render() {
    return (
      <div className="filters-group-container">
        {this.renderSearchInput()}
        {this.renderViews()}
        {this.renderEmploymentType()}
        {this.renderSalaryRange()}
      </div>
    )
  }
}

export default Filters

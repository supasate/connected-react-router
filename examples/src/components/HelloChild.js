import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const HelloChild = ({ path }) => (
  <div>
    Hello-Child at path {path}
  </div>
)

HelloChild.propTypes = {
  path: PropTypes.string,
}

const mapStateToProps = state => ({
  path: state.router.location.pathname,
})

export default connect(mapStateToProps)(HelloChild)

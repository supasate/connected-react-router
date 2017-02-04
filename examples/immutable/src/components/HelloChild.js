import React, { PropTypes } from 'react'
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
  path: state.getIn(['router', 'location', 'pathname']),
})

export default connect(mapStateToProps)(HelloChild)

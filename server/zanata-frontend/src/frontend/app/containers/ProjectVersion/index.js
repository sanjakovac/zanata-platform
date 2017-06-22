import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import { Button }
  from 'react-bootstrap'
import Helmet from 'react-helmet'
import TMMergeModal from './TMMergeModal'

import {
  toggleTMMergeModal
} from '../../actions/version-actions'

/**
 * Root component for Project Version Page
 */
class ProjectVersion extends Component {
  static propTypes = {
    openTMMergeModal: PropTypes.func.isRequired,
    params: PropTypes.shape({
      project: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired
    })
  }

  render () {
    return (
      <div className='page wide-view-theme' id='version'>
        <Helmet title='ProjectVersion' />
        <div className='center-block'>
          <h1>Project Version</h1>
          <Button
            onClick={this.props.openTMMergeModal}>
            Version
          </Button>
          <TMMergeModal projectSlug={this.props.params.project}
            versionSlug={this.props.params.version} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openTMMergeModal: () => {
      dispatch(toggleTMMergeModal())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectVersion)

import React from 'react'
import PropTypes from 'prop-types'
import { Tab } from 'react-bootstrap'

class ActivityTab extends React.Component {

  static propTypes = {
    // eventKey prop to use for the bootstrap Tab
    eventKey: PropTypes.number.isRequired
  }

  render () {
    const { eventKey } = this.props
    return (
      <Tab eventKey={eventKey} title="">
        <div className="sidebar-wrapper" id="tab1">
          <p>Testing, 1, 2, 4</p>
        </div>
      </Tab>
    )
  }
}

export default ActivityTab

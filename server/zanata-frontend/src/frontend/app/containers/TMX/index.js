import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isUndefined, isEmpty, forEach } from 'lodash'
import { connect } from 'react-redux'
import { Modal, Icon } from '../../components'
import {
  Button, Badge, Table, OverlayTrigger, Tooltip
} from 'react-bootstrap'

import {
  TMX_TYPE,
  tmxInitialLoad,
  showExportTMXModal,
  toggleShowSourceLanguages,
  exportTMX
} from '../../actions/tmx-actions'

class TMXExportModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    showSourceLanguages: PropTypes.bool,
    type: PropTypes.oneOf(TMX_TYPE).isRequired,
    project: PropTypes.string,
    version: PropTypes.string,
    srcLanguages: PropTypes.arrayOf(PropTypes.object),
    handleOnClose: PropTypes.func,
    handleToggleShowSourceLanguages: PropTypes.func,
    handleExportTMX: PropTypes.func,
    handleInitLoad: PropTypes.func.isRequired,
    params: PropTypes.object
  }

  componentDidMount () {
    const project = this.props.params.project
    const version = this.props.params.version
    let type
    if ((project || !isUndefined(project)) &&
        (!version || isUndefined(version))) {
      type = TMX_TYPE[1] // project type
    } else if ((project || !isUndefined(project)) &&
        (version || !isUndefined(version))) {
      type = TMX_TYPE[2] // project version type
    } else {
      type = TMX_TYPE[0] // all type
    }
    this.props.handleInitLoad(type, project, version)
  }

  render () {
    const {
      show,
      showSourceLanguages,
      project,
      version,
      srcLanguages,
      handleOnClose,
      handleToggleShowSourceLanguages,
      handleExportTMX,
      type
    } = this.props

    let title = ''
    let question = ''
    switch (type) {
      case 'all':
        title = 'Export all projects to TMX'
        question = 'Are you sure you want to all projects to TMX?'
        break
      case 'project':
        title = 'Export project ' + project + ' to TMX'
        question = 'Are you sure you want to export this project to TMX?'
        break
      case 'version':
        title = 'Export version ' + version + ' to TMX'
        question = 'Are you sure you want to this version to TMX?'
        break
      default:
        break
    }
    let srcLanguagesRow = []
    if (showSourceLanguages && !isUndefined(srcLanguages)) {
      forEach(srcLanguages, function (srcLang) {
        const tooltip = (
          <Tooltip id={srcLang.localeDetails.localeId + '-locale-tooltip'}>
            {srcLang.localeDetails.displayName}<br />
            {srcLang.localeDetails.nativeName}
          </Tooltip>
        )
        const docCount = (
          <Tooltip id={srcLang.localeDetails.localeId + '-doc-tooltip'}>
            {srcLang.docCount} documents
          </Tooltip>
        )
        srcLanguagesRow.push(
          <tr key={srcLang.localeDetails.localeId}>
            <td>
              <OverlayTrigger placement='left' overlay={tooltip}>
                <Button bsStyle='link'>{srcLang.localeDetails.localeId}</Button>
              </OverlayTrigger>
            </td>
            <td>
              <OverlayTrigger placement='top' overlay={docCount}>
                <Badge>
                  {srcLang.docCount} <Icon name='document' className='n1' />
                </Badge>
              </OverlayTrigger>
            </td>
            <td>
              <span className='tmx-dl'>
                <Button
                  bsStyle='primary'
                  bsSize='small'
                  onClick={handleExportTMX}>
                  Download
                </Button>
                <span className='asterix'>*</span>
              </span>
            </td>
          </tr>)
      })
    }
    return (
      <Modal show={show} onHide={handleOnClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showSourceLanguages && !isEmpty(srcLanguagesRow)
            ? <span className='tmx-export'>
              <p className='lead'>Source languages</p>
              <Table className='tmx-table'>
                <tbody>
                  {srcLanguagesRow}
                </tbody>
              </Table>
            </span>
            : <span className='tmx-export'>
              <p>{question}<br />
                <strong>Default source language
                  {isEmpty(srcLanguagesRow)
                    ? <span> en-US</span>
                    : <a onClick={handleToggleShowSourceLanguages}> en-US</a>
                  }
                </strong>
              </p>
              <br />
              <p>
                <Button
                  bsStyle='primary'
                  onClick={handleExportTMX}>
                  Download
                </Button>
              </p>
            </span>
          }

        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { tmxExport } = state.tmx
  return {
    show: tmxExport.showModal,
    srcLanguages: tmxExport.sourceLanguages,
    showSourceLanguages: tmxExport.showSourceLanguages,
    type: tmxExport.type,
    project: tmxExport.project,
    version: tmxExport.version
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    handleOnClose: () => {
      dispatch(showExportTMXModal(false))
    },
    handleToggleShowSourceLanguages: () => {
      dispatch(toggleShowSourceLanguages())
    },
    handleExportTMX: () => {
      dispatch(exportTMX())
    },
    handleInitLoad: (type, project, version) => {
      dispatch(tmxInitialLoad(type, project, version))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TMXExportModal)
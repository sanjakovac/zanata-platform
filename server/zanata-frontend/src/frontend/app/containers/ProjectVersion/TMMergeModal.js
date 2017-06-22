import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { differenceWith, isEqual } from 'lodash'
import {
  Button, Panel, Row, Checkbox, InputGroup, Col, Label,
  FormControl, ListGroup, ListGroupItem
}
  from 'react-bootstrap'
import {Icon, Modal} from '../../components'
import ProjectVersionPanels from '../../components/ProjectVersionPanels'
import DraggableVersionPanels from '../../components/DraggableVersionPanels'
import TMMatchPercentageDropdown
  from '../../components/TMMatchPercentageDropdown'
import LanguageSelectionDropdown
  from '../../components/LanguageSelectionDropdown'
import {
  loadVersionLocales,
  loadProjectPage,
  toggleTMMergeModal
} from '../../actions/version-actions'

/**
 * Root component for TM Merge Modal
 */
class TMMergeModal extends Component {
  static propTypes = {
    handleInitLoad: PropTypes.func.isRequired,
    showTMMergeModal: PropTypes.bool,
    openTMMergeModal: PropTypes.func.isRequired,
    openProjectPage: PropTypes.func.isRequired,
    projectSlug: PropTypes.string.isRequired,
    versionSlug: PropTypes.string.isRequired,
    locales: PropTypes.arrayOf(PropTypes.object),
    projectVersions: PropTypes.arrayOf(PropTypes.object)
  }
  constructor (props) {
    super(props)
    this.state = {
      matchPercentage: 100,
      differentDocId: false,
      differentContext: false,
      fromImportedTM: false,
      selectedLanguage: '',
      fromProjectVersions: [], // Selected Versions List
      projectSearchTerm: this.props.projectSlug,
      selectedProject: []
    }
  }
  componentDidMount () {
    this.props.handleInitLoad(this.props.projectSlug, this.props.versionSlug)
  }
  componentWillReceiveProps () {
    const locales = this.props.locales
    if (!this.state.selectedLanguage) {
      this.setState({
        ...this.state,
        selectedLanguage: locales.length === 0 ? '' : locales[0].displayName
      })
    }
  }
  onPercentSelection = (percent) => {
    this.setState({
      ...this.state,
      matchPercentage: percent
    })
  }
  onLanguageSelection = (language) => {
    this.setState({
      ...this.state,
      selectedLanguage: language
    })
  }
  onProjectSearchChange = (event) => {
    this.setState({
      ...this.state,
      projectSearchTerm: event.target.value
    })
  }
  onProjectSearch = () => {
    this.props.openProjectPage(this.state.projectSearchTerm)
  }
  // Remove a version from fromProjectVersion array by index
  popProjectVersion = (index) => {
    const {
      fromProjectVersions
    } = this.state
    this.setState({
      ...this.state,
      fromProjectVersions:
          [...fromProjectVersions.slice(0, index),
          ...fromProjectVersions.slice(index + 1)]
    })
  }
  // Remove all versions of a Project from fromProjectVersion array
  popAllProjectVersions = (projectVersions) => {
    const {
      fromProjectVersions
    } = this.state
    // FIXME Change state flow to update in correct order
    setTimeout(() => {
      this.setState({
        ...this.state,
        fromProjectVersions: [...fromProjectVersions.filter((version) =>
            !(version.projectSlug === projectVersions[0].projectSlug))]
      })
    }, 0)
  }
  // Add a version to fromProjectVersion array
  pushProjectVersion = (version) => {
    const {
      fromProjectVersions
    } = this.state
    this.setState({
      ...this.state,
      fromProjectVersions: [...fromProjectVersions, version]
    })
  }
  // Push all versions of a Project to fromProjectVersion array
  pushAllProjectVersions = (projectVersions) => {
    const {
      fromProjectVersions
    } = this.state
    // FIXME Change state flow to update in correct order
    setTimeout(() => {
      this.setState({
        ...this.state,
        fromProjectVersions:
            [...fromProjectVersions.concat(projectVersions)]
      })
    }, 0)
  }
  flattenedVersionArray = () => {
    return this.state.fromProjectVersions.map((project) => {
      return project.version
    })
  }
  // Push/Pop version from fromProjectVersion array based on selection
  onVersionCheckboxChange = (version, projectSlug) => {
    const versionChecked = this.flattenedVersionArray().includes(version)
    const index = this.flattenedVersionArray().indexOf(version)
    versionChecked ? this.popProjectVersion(index)
      : this.pushProjectVersion({version, projectSlug: projectSlug})
  }
  // Remove/Add all project versions to version list
  onAllVersionCheckboxChange = (project) => {
    const projectSlug = project.id
    let versionsToPush = project.versions.map((version) => {
      return {version, projectSlug}
    })
    const versionsToPop = [...versionsToPush]
    let allVersionsChecked = true
    project.versions.map((version) => {
      if (!this.flattenedVersionArray().includes(version)) {
        allVersionsChecked = false
      }
    })
    versionsToPush = (differenceWith(versionsToPop,
            this.state.fromProjectVersions, isEqual))
    allVersionsChecked
        ? this.popAllProjectVersions(versionsToPop)
        : this.pushAllProjectVersions(versionsToPush)
  }
  render () {
    const {
      showTMMergeModal,
      openTMMergeModal,
      projectSlug,
      versionSlug,
      projectVersions
    } = this.props
    const action = (message) => {
      // TODO: Use Real Actions
      // console.info('clicked')
    }
    const showHide = showTMMergeModal ? {display: 'block'} : {display: 'none'}
    // Different DocID Checkbox handling
    const onDocIdCheckboxChange = () => {
      this.setState({
        ...this.state,
        differentDocId: !this.state.differentDocId
      })
    }
    const docIdLabel = this.state.differentDocId
        ? (<Label bsStyle='warning'>
        Copy as Fuzzy
        </Label>)
        : (<Label bsStyle='danger'>
        Don't Copy
        </Label>)
    // Different Context Checkbox handling
    const onContextCheckboxChange = () => {
      this.setState({
        ...this.state,
        differentContext: !this.state.differentContext
      })
    }
    const differentContextLabel = this.state.differentContext
        ? (<Label bsStyle='warning'>
          Copy as Fuzzy
        </Label>)
        : (<Label bsStyle='danger'>
          Don't Copy
        </Label>)
    // Match from Imported TM Checkbox handling
    const onImportedCheckboxChange = () => {
      this.setState({
        ...this.state,
        fromImportedTM: !this.state.fromImportedTM
      })
    }
    const matchImportedLabel = this.state.fromImportedTM
        ? (<Label bsStyle='warning'>
          Copy as Fuzzy
        </Label>)
        : (<Label bsStyle='danger'>
          Don't Copy
        </Label>)
    return (
      <Modal style={showHide}
        show
        onHide={openTMMergeModal}>
        <Modal.Header>
          <Modal.Title>Version TM Merge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="intro">Copy existing translations from similar
              documents
              in other projects and versions into this project version.
            </p>
            <Col xs={12} className='vmerge-row'>
              <Col xs={4}>
                <span
                  className='vmerge-title text-info'>TM match threshold</span>
              </Col>
              <Col xs={5}>
                <TMMatchPercentageDropdown onClick={this.onPercentSelection}
                  matchPercentage={this.state.matchPercentage} />
              </Col>
            </Col>
            <Col xs={12}>
              <Panel className='tm-panel'>
                <ListGroup fill>
                  <ListGroupItem className=''>
                    <Checkbox onChange={onDocIdCheckboxChange}
                      checked={this.state.differentDocId}>
                    Different DocID
                      <small>{" "}Document name and path</small>
                      {docIdLabel}
                    </Checkbox>
                  </ListGroupItem>
                </ListGroup>
                <span className='and'>
              AND
                </span>
                <ListGroup fill>
                  <ListGroupItem className=''>
                    <Checkbox onChange={onContextCheckboxChange}
                      checked={this.state.differentContext}>
                      Different Context
                      <small>{" "} resId, msgctxt</small>
                      {differentContextLabel}
                    </Checkbox>
                  </ListGroupItem>
                </ListGroup>
              </Panel>
              <Panel className='tm-panel'>
                <span className='or'>OR</span>
                <ListGroup fill>
                  <ListGroupItem className=''>
                    <Checkbox onChange={onImportedCheckboxChange}>
                      Match from Imported TM
                      <small>{" "}</small>
                      {matchImportedLabel}
                    </Checkbox>
                  </ListGroupItem>
                </ListGroup>
              </Panel>
            </Col>
            <Col xs={12} className='vmerge-row'>
              <Col xs={2}>
                <span className='vmerge-title text-info'>Language</span>
              </Col>
              <Col xs={6}>
                <LanguageSelectionDropdown
                  onClick={this.onLanguageSelection}
                  selectedLanguage={this.state.selectedLanguage}
                  locales={this.props.locales}
                />
              </Col>
            </Col>
            <Col xs={12} className='vmerge-boxes'>
              <Panel>
                <div className='vmerge-target'>
                  <div className='vmerge-title'>
                    <span className='text-info'>To</span>
                    <span className='text-muted'>Target</span>
                  </div>
                  <ul>
                    <li>
                      <Icon name='project' className='s0 tmx-icon' />
                      {projectSlug}
                    </li>
                    <li>
                      <Icon name='version' title='version'
                        className='s0 tmx-icon' />
                      {versionSlug}
                    </li>
                  </ul>
                </div>
              </Panel>
            </Col>
            <Col xs={12} className='vmerge-boxes'>
              <Panel>
                <Col xs={3}>
                  <div className='vmerge-title'>
                    <span className='text-info'>From</span>
                    <span className='text-muted'>Source</span>
                  </div>
                </Col>
                <Col xs={9} className='vmerge-searchbox'>
                  <InputGroup>
                    <InputGroup.Addon>
                      <Icon name='search'
                        className='s0'
                        title='search'
                      />
                    </InputGroup.Addon>
                    <FormControl type='text'
                      value={this.state.projectSearchTerm}
                      className='vmerge-searchinput'
                      onChange={this.onProjectSearchChange}
                    />
                  </InputGroup>
                  <Button
                    bsStyle='primary'
                    onClick={this.onProjectSearch}>
                  Search
                  </Button>
                </Col>
                <Col xs={6}>
                  <span className='vmerge-adjtitle
                  vmerge-title'>Select source project versions to merge
                  </span>
                  <ProjectVersionPanels projectVersions={projectVersions}
                    fromProjectVersion={this.state.fromProjectVersions}
                    onVersionCheckboxChange={this.onVersionCheckboxChange}
                    onAllVersionCheckboxChange={this.onAllVersionCheckboxChange}
                    selectedProject={this.state.selectedProject}
                    projectList={this.props.projectVersions}
                  />
                </Col>
                <Col xs={6}>
                  <DraggableVersionPanels
                    fromProjectVersion={this.state.fromProjectVersions} />
                </Col>
              </Panel>
            </Col>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className='bootstrap pull-right'>
            <Row>
              <Button bsStyle='link'
                className='btn-left link-danger'
                onClick={openTMMergeModal}>
                Cancel
              </Button>
              <Button
                bsStyle='primary'
                onClick={action('onClick')}>
              Merge translations
              </Button>
            </Row>
          </span>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showTMMergeModal: state.projectVersion.TMMerge.show,
    locales: state.projectVersion.locales,
    projectVersions: state.projectVersion.TMMerge.projectVersions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInitLoad: (project, version) => {
      dispatch(loadVersionLocales(project, version))
    },
    openProjectPage: (project) => {
      dispatch(loadProjectPage(project))
    },
    openTMMergeModal: () => {
      dispatch(toggleTMMergeModal())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TMMergeModal)


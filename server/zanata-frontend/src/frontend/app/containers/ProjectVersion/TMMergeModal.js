import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import Draggable from 'react-draggable'
import {
  Button, Panel, Row, Checkbox, InputGroup, Col,
  FormControl, DropdownButton, MenuItem, ListGroup, ListGroupItem, PanelGroup,
  OverlayTrigger, Tooltip, Label
}
  from 'react-bootstrap'
import {Icon, Modal} from '../../components'

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
      fromProjectVersion: [], // For priority of versions
      projectSearchTerm: this.props.projectSlug
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
  render () {
    const {
      showTMMergeModal,
      openTMMergeModal,
      projectSlug,
      versionSlug,
      locales,
      projectVersions
    } = this.props
    const action = (message) => {
      // TODO: Use Real Actions
      // console.info('clicked')
    }
    const tooltipReadOnly = (
      <Tooltip id='tooltipreadonly'>Read only
      </Tooltip>
    )
    const currentProject = projectSlug
    const currentVersion = versionSlug
    const showHide = showTMMergeModal ? {display: 'block'} : {display: 'none'}
    const percentageItems = [100, 90, 80].map(percentage => {
      return (
        <IndexedMenuItem onClick={this.onPercentSelection}
          percentage={percentage}
          matchPercentage={this.state.matchPercentage}
          key={percentage}
        />
      )
    })
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
    // Language Dropdown handling
    const languageMenu = locales
        .map((locale, index) => {
          return (
            <LanguageMenuItem
              onClick={this.onLanguageSelection}
              language={locale.displayName}
              selectedLanguage={this.state.selectedLanguage}
              eventKey={index}
              key={index}
              />
          )
        })
    // Source Project Versions to Merge options handling
    const firstProject = projectVersions[0]
    // Check there is a first project
    const projectPanels = firstProject
        ? projectVersions.map((project, index) => {
          return (
            <Panel header={<h3><Checkbox>{project.title}</Checkbox></h3>}
              key={index} eventKey={index}>
              <ListGroup fill>
              {project.versions.map((version, index) => {
                const lockIcon = version.status === 'READONLY'
                  ? <OverlayTrigger placement='top' overlay={tooltipReadOnly}>
                    <Icon name='locked' className='s0 icon-locked' />
                  </OverlayTrigger>
                  : ''
                return (
                  <ListGroupItem className='v' key={index}>
                    <Checkbox>{version.id}{" "}{lockIcon}</Checkbox>
                  </ListGroupItem>
                )
              })}
              </ListGroup>
            </Panel>
          )
        })
        : ''
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
                <DropdownButton bsStyle='default' bsSize='small'
                  title={this.state.matchPercentage + '%'}
                  id='dropdown-basic'
                  className='vmerge-ddown'>
                  {percentageItems}
                </DropdownButton>
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
                <DropdownButton bsStyle='default' bsSize='small'
                  title={this.state.selectedLanguage}
                  id='dropdown-basic'
                  className='vmerge-ddown'>
                  {languageMenu}
                </DropdownButton>
              </Col>
            </Col>
            <Col xs={12} className='vmerge-boxes'>
              <Panel>
                <div className='vmerge-target'>
                  <div className='vmerge-title'>
                    <span className='text-info'>To </span>
                    <span className='text-muted'>  Target</span>
                  </div>
                  <ul>
                    <li>
                      {currentProject}
                    </li>
                    <li>
                      {currentVersion}
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
                  <PanelGroup defaultActiveKey='1' accordion>
                    {projectPanels}
                  </PanelGroup>
                </Col>
                <Col xs={6}>
                  <ListGroup>
                    <div><span className='vmerge-adjtitle
                  vmerge-title'>
                    Adjust priority of selected versions</span>
                      <br /><span className='text-muted vmerge-adjsub'>
                        (best first)
                      </span>
                    </div>
                    <Draggable bounds='parent' axis='y' grid={[57, 57]}>
                      <ListGroupItem className='v'>
                        <Button bsStyle='link' className='btn-link-sort'>
                          <i className='fa fa-sort'></i>
                        </Button>
                        2.0
                        <span className='text-muted'>
                          Project A
                        </span>
                      </ListGroupItem>
                    </Draggable>
                    <Draggable bounds='parent' axis='y' grid={[57, 57]}>
                      <ListGroupItem className='v'>
                        <Button bsStyle='link' className='btn-link-sort'>
                          <i className='fa fa-sort'></i>
                        </Button>
                        1.0
                        <span className='text-muted'>
                          Project A
                        </span>
                      </ListGroupItem>
                    </Draggable>
                  </ListGroup>
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

class IndexedMenuItem extends Component {
  static propTypes = {
    percentage: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    matchPercentage: PropTypes.number.isRequired
  }
  onClick = () => {
    this.props.onClick(this.props.percentage)
  }
  render () {
    const i = this.props.percentage
    return (
      <MenuItem onClick={this.onClick}
        eventKey={i} key={i} active={i === this.props.matchPercentage}>
        {i}%
      </MenuItem>
    )
  }
}

class LanguageMenuItem extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    eventKey: PropTypes.number.isRequired,
    selectedLanguage: PropTypes.string.isRequired
  }
  onClick = () => {
    this.props.onClick(this.props.language)
  }
  render () {
    const myLanguage = this.props.language
    return (
      <MenuItem onClick={this.onClick}
        eventKey={this.props.eventKey} key={this.props.eventKey}
        active={myLanguage === this.props.selectedLanguage}>
          {myLanguage}
      </MenuItem>
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


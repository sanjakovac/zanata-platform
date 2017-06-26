import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Panel, Tooltip, Checkbox, ListGroup, ListGroupItem, OverlayTrigger, PanelGroup
} from 'react-bootstrap'
import Icon from './Icon'
import {ProjectType, FromProjectVersionType,
  versionDtoPropType} from '../utils/prop-types-util.js'

const tooltipReadOnly = <Tooltip id='tooltipreadonly'>Read only</Tooltip>

const LockIcon = (props) => {
  return props.status === 'READONLY'
    ? (
    <OverlayTrigger placement='top' overlay={tooltipReadOnly}>
      <Icon name='locked' className='s0 icon-locked' />
    </OverlayTrigger>
  )
    : <span />
}
LockIcon.propTypes = {
  status: PropTypes.string.isRequired
}

/**
 * Root component for the Version TM Merge project version panels
 */
class ProjectVersionPanels extends Component {
  static propTypes = {
    projectVersions: PropTypes.arrayOf(ProjectType).isRequired,
    selectedVersions: PropTypes.arrayOf(FromProjectVersionType).isRequired,
    /* params: version, projectSlug */
    onVersionCheckboxChange: PropTypes.func.isRequired,
    /* params: project object */
    onAllVersionCheckboxChange: PropTypes.func.isRequired
  }
  /*
    selectedVersions is an array of shape:
    {
      projectSlug,
      version: {
        id,
        status
      }
    }
   */
  selectedVersionsOfProject = (selectedVersions, project) => {
    return selectedVersions
      .filter(p => p.projectSlug === project.id)
      .map(p => p.version)
  }
  render () {
    if (this.props.projectVersions.length === 0) {
      return <PanelGroup />
    }

    const panels = this.props.projectVersions.map((project, index) => {
      const selectedVersionsInProject =
        this.selectedVersionsOfProject(this.props.selectedVersions, project)
      return (
        <SelectableProjectPanel key={index} eventKey={index}
          selectedVersionsInProject={selectedVersionsInProject}
          project={project}
          onAllVersionCheckboxChange={this.props.onAllVersionCheckboxChange}
          onVersionCheckboxChange={this.props.onVersionCheckboxChange}
        />
      )
    })
    return <PanelGroup defaultActiveKey={0} accordion>{panels}</PanelGroup>
  }
}
/**
 * Sub Component of a single project with versions.
 * Handles behavior of display or selecting versions of this project.
 */
const SelectableProjectPanel = (props) => {
  const {
    project,
    selectedVersionsInProject,
    onAllVersionCheckboxChange,
    onVersionCheckboxChange
  } = props
  return (
    <Panel header={
      <h3>
        <SelectAllVersionsCheckbox
          project={project}
          onAllVersionCheckboxChange={onAllVersionCheckboxChange}
          selectedVersionsInProject={selectedVersionsInProject} />
      </h3>}>
      <ListGroup fill>
        {project.versions.map((version, index) => {
          const checked = selectedVersionsInProject.includes(version)
          return (
            <ListGroupItem className='v' key={index}>
              <VersionMenuCheckbox version={version}
                onVersionCheckboxChange={onVersionCheckboxChange}
                checked={checked}
                projectSlug={project.id} />
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </Panel>
  )
}
SelectableProjectPanel.propTypes = {
  project: ProjectType.isRequired,
  /* params: version, projectSlug */
  onVersionCheckboxChange: PropTypes.func.isRequired,
  /* params: project object */
  onAllVersionCheckboxChange: PropTypes.func.isRequired,
  selectedVersionsInProject: PropTypes.arrayOf(versionDtoPropType).isRequired
}

/**
 * Sub Component of project version panels
 * Handles behavior of select all versions checkbox
 */
class SelectAllVersionsCheckbox extends Component {
  static propTypes = {
    project: ProjectType.isRequired,
    selectedVersionsInProject: PropTypes.arrayOf(versionDtoPropType).isRequired,
    onAllVersionCheckboxChange: PropTypes.func.isRequired
  }
  onAllVersionCheckboxChange = () => {
    this.props.onAllVersionCheckboxChange(this.props.project)
  }
  render () {
    const {project, selectedVersionsInProject} = this.props
    // Check if all project versions have been selected
    // since we are just comparing versions in one project, we can just check
    // the size
    const allVersionsChecked =
      project.versions.length === selectedVersionsInProject.length

    return (
      <Checkbox onChange={this.onAllVersionCheckboxChange}
        checked={allVersionsChecked}>
        {project.title} <LockIcon status={project.status} />
      </Checkbox>
    )
  }
}

/**
 * Sub Component of project version panels
 * Handles behavior of select version checkbox
 */
class VersionMenuCheckbox extends Component {
  static propTypes = {
    version: versionDtoPropType.isRequired,
    onVersionCheckboxChange: PropTypes.func.isRequired,
    projectSlug: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired
  }
  onVersionCheckboxChange = () => {
    this.props.onVersionCheckboxChange(
      this.props.version, this.props.projectSlug)
  }
  render () {
    const {
      version,
      checked
    } = this.props
    return (
      <Checkbox onChange={this.onVersionCheckboxChange}
        checked={checked}>
        {version.id} <LockIcon status={version.status} />
      </Checkbox>
    )
  }
}

export default ProjectVersionPanels

import { CALL_API, getJSON } from 'redux-api-middleware'
import { createAction } from 'redux-actions'
import {
  getJsonHeaders,
  buildAPIRequest
} from './common-actions'
import { apiUrl } from '../config'

import {
  TOGGLE_TM_MERGE_MODAL,
  VERSION_LOCALES_REQUEST,
  VERSION_LOCALES_SUCCESS,
  VERSION_LOCALES_FAILURE,
  PROJECT_PAGE_REQUEST,
  PROJECT_PAGE_SUCCESS,
  PROJECT_PAGE_FAILURE,
  VERSION_TM_MERGE_REQUEST,
  VERSION_TM_MERGE_SUCCESS,
  VERSION_TM_MERGE_FAILURE,
  QUERY_TM_MERGE_PROGRESS_REQUEST,
  QUERY_TM_MERGE_PROGRESS_SUCCESS,
  QUERY_TM_MERGE_PROGRESS_FAILURE
} from './version-action-types'

/** Open or close the TM Merge modal  */
export const toggleTMMergeModal =
    createAction(TOGGLE_TM_MERGE_MODAL)

/**
 * Fetch project version specific locales from database
 *
 * @param projectSlug project ID
 * @param versionSlug version ID
 * */
export const fetchVersionLocales = (projectSlug, versionSlug) => {
  return (dispatch) => {
    dispatch(fetchProjectVersionLocales(dispatch, projectSlug, versionSlug))
  }
}

function fetchProjectVersionLocales (dispatch, project, version) {
  const endpoint = `${apiUrl}/project/${project}/version/${version}/locales`
  const apiTypes = [
    VERSION_LOCALES_REQUEST,
    VERSION_LOCALES_SUCCESS,
    VERSION_LOCALES_FAILURE
  ]
  return {
    [CALL_API]: buildAPIRequest(endpoint, 'GET', getJsonHeaders(), apiTypes)
  }
}

/**
 * Fetch projects to merge from database
 *
 * @param projectSearchTerm to filter results
 * */
export const fetchProjectPage = (projectSearchTerm) => {
  return (dispatch) => {
    dispatch(fetchSearchProjectPage(dispatch, projectSearchTerm))
  }
}

function fetchSearchProjectPage (dispatch, projectSearchTerm) {
  const endpoint =
      `${apiUrl}/search/projects?q=${projectSearchTerm}&includeVersion=true`
  const apiTypes = [
    PROJECT_PAGE_REQUEST,
    {
      type: PROJECT_PAGE_SUCCESS,
      payload: (action, state, res) => {
        return getJSON(res).then((json) => json.results)
      }
    },
    PROJECT_PAGE_FAILURE
  ]
  return {
    [CALL_API]: buildAPIRequest(endpoint, 'GET', getJsonHeaders(), apiTypes)
  }
}

// convert merge option to MergeRule enum value
const fuzzyOrRejectMergeRule = (isAccept) => isAccept ? 'FUZZY' : 'REJECT'

// convert project version to string representation
const toProjectVersion = (projectVersion) => {
  return `${projectVersion.projectSlug}/${projectVersion.version.id}`
}

/**
 * @param {string} projectSlug target project slug
 * @param {string} versionSlug target version slug
 * @param {{
 *  matchPercentage: number,
 *  differentDocId: boolean,
 *  differentContext: boolean,
 *  fromImportedTM: boolean,
 *  selectedLanguage: Object.<{localeId: string, displayName: string}>,
 *  selectedVersions: Array.<{projectSlug: string, version: {id: string}}>
 * }} mergeOptions
 * @returns redux api action object
 */
export function mergeVersionFromTM (projectSlug, versionSlug, mergeOptions) {
  const endpoint =
    `${apiUrl}/project/${projectSlug}/version/${versionSlug}/tm-merge`
  const types = [VERSION_TM_MERGE_REQUEST,
    VERSION_TM_MERGE_SUCCESS, VERSION_TM_MERGE_FAILURE]
  const body = {
    localeId: mergeOptions.selectedLanguage.localeId,
    thresholdPercent: mergeOptions.matchPercentage,
    differentDocumentRule: fuzzyOrRejectMergeRule(mergeOptions.differentDocId),
    differentContextRule: fuzzyOrRejectMergeRule(mergeOptions.differentContext),
    importedMatchRule: fuzzyOrRejectMergeRule(mergeOptions.fromImportedTM),
    fromProjectVersions: mergeOptions.selectedVersions.map(toProjectVersion)
  }
  const apiRequest = buildAPIRequest(
    endpoint, 'POST', getJsonHeaders(), types, JSON.stringify(body)
  )
  return {
    [CALL_API]: apiRequest
  }
}

export function queryTMMergeProgress (url) {
  const types = [QUERY_TM_MERGE_PROGRESS_REQUEST,
    QUERY_TM_MERGE_PROGRESS_SUCCESS,
    QUERY_TM_MERGE_PROGRESS_FAILURE]
  return {
    [CALL_API]: buildAPIRequest(url, 'GET', getJsonHeaders(), types)
  }
}

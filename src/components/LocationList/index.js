import React, { Component, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import { withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core/'
import { MapInfoCard } from '../'
import { FixedSizeList, shouldComponentUpdate } from 'react-window'
import SearchList from '../SearchList'
import ProjectDetailsEdit from '../ProjectDetailsEdit'
import {
  setMapSites,
  selectSite,
  attachSite,
  unAttachSite,
  unSelectSite,
  saveUpdateSite,
  setMapCenterBoundsZoom
} from '../../../actions/MetaActions'

import {
  resetProject,
  resetProjects,
  fetchProjectIfNeeded,
  setProjectsSearchProps,
  saveUpdateProject
} from '../../../actions/ProjectActions'
import { CENTER_OF_US, DEFAULT_ZOOM } from '../RadiusMap/constants'

const mapStateToProps = ({
  meta: {
    map: { sites }
  },
  projects: {
    search: { clientId },
    activeProject: { item }
  }
}) => ({ clientId, item, sites })

const mapDispatchToProps = {
  setMapSites,
  selectSite,
  attachSite,
  unAttachSite,
  unSelectSite,
  saveUpdateSite,
  setMapCenterBoundsZoom,
  resetProject,
  resetProjects,
  fetchProjectIfNeeded,
  setProjectsSearchProps,
  saveUpdateProject
}

const defaultSiteStyles = {
  borderRadius: 4,
  margin: 8,
  '&:hover': { boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, cursor: 'pointer' }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 400,
    height: 'auto',
    flexGrow: 1,
    maxWidth: 752,
    backgroundColor: 'white',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  siteContainer: {
    maxHeight: 610,
    overflowY: 'auto'
  },
  selectedSites: {
    ...defaultSiteStyles,
    border: '1px solid #fed330'
  },
  divider: {
    margin: '16px 0',
    border: 0,
    height: 1,
    backgroundImage:
      'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))'
  },
  attachedSites: {
    ...defaultSiteStyles,
    border: '1px solid #28c679'
  },
  list: {
    backgroundColor: 'white'
  },
  listItem: {
    fontWeight: 400,
    boxSizing: 'border-box',
    padding: '16px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      cursor: 'pointer',
      transform: 'perspective(1px) translate3d(0, 0, 0) scale3d(1.04, 1.04, 1)',
      willChange: 'transform',
      backgroundRepeat: 'no-repeat',
      backfaceVisibility: 'hidden',
      WebkitFontSmoothing: 'subpixel-antialiased',
      transition: '-webkit-transform .425s cubic-bezier(0.485, 1.65, 0.545, 0.835)',
      backgroundColor: 'whitesmoke'
    }
  }
})

class LocationList extends Component {
  constructor(props) {
    super(props)
    this.listRef = createRef()
    this.state = { listItems: [] }
  }

  static propTypes = {
    showPolygonsMinZoom: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    sites: PropTypes.array.isRequired,
    clientId: PropTypes.string,
    hoveredChildKey: PropTypes.string.isRequired,
    onChildMouseEnter: PropTypes.func.isRequired,
    onChildMouseLeave: PropTypes.func.isRequired,
    clientsListItems: PropTypes.array.isRequired,
    attachedSites: PropTypes.array.isRequired,
    selectedSites: PropTypes.array.isRequired,
    projectListItems: PropTypes.array.isRequired,
    fetchProjectIfNeeded: PropTypes.func.isRequired,
    setProjectsSearchProps: PropTypes.func.isRequired,
    saveUpdateProject: PropTypes.func.isRequired,
    resetProject: PropTypes.func.isRequired,
    resetProjects: PropTypes.func.isRequired,
    setMapCenterBoundsZoom: PropTypes.func.isRequired,
    selectSite: PropTypes.func.isRequired,
    attachSite: PropTypes.func.isRequired,
    unAttachSite: PropTypes.func.isRequired,
    unSelectSite: PropTypes.func.isRequired,
    saveUpdateSite: PropTypes.func.isRequired,
    setMapSites: PropTypes.func.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate = shouldComponentUpdate.bind(this)

  componentDidMount() {
    const { clientId } = this.state
    this.setProjectsSearchProps(clientId || 'None')
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      item: { id },
      clientId,
      projectListItems,
      clientsListItems,
      hoveredChildKey,
      attachedSites,
      selectedSites
    } = props

    const listItems = projectListItems
      .map(item =>
        item.points.map(point => {
          const { id, lat, lng, siteDescription } = point
          return {
            id,
            center: [lat, lng],
            siteDescription
          }
        })
      )
      .flat(1)

    const listItemsLength = listItems.length
    const shouldRenderSelectedSites = selectedSites.length > 0
    const shouldRenderAttachedSites = attachedSites.length > 0
    const shouldRenderMapInfoCardsDivider = shouldRenderSelectedSites && shouldRenderAttachedSites
    const shouldRenderProjectList = !id && listItemsLength > 0

    this.setState({
      clientId,
      listItems,
      clientsListItems,
      hoveredChildKey,
      attachedSites,
      selectedSites,
      listItemsLength,
      shouldRenderSelectedSites,
      shouldRenderMapInfoCardsDivider,
      shouldRenderAttachedSites,
      shouldRenderProjectList
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { listItems, hoveredChildKey, shouldRenderProjectList } = this.state
    if (hoveredChildKey === prevState.hoveredChildKey) return

    const listItemIndex = listItems.findIndex(item => item.id === hoveredChildKey)
    const shouldScroll = shouldRenderProjectList && listItemIndex !== -1

    if (shouldScroll) this.handleScrollToListItem(listItemIndex)
  }

  handleScrollToListItem = index => this.listRef.current.scrollToItem(index)

  handleSearchListItemClick = id => {
    const { resetProject, resetProjects, setMapCenterBoundsZoom, setMapSites } = this.props

    setMapSites([])
    resetProject()
    resetProjects()
    this.setProjectsSearchProps(id)
    setMapCenterBoundsZoom({ zoom: DEFAULT_ZOOM, center: CENTER_OF_US })
  }

  setProjectsSearchProps = id => {
    const { setProjectsSearchProps } = this.props
    const searchProjectsPayload = {
      clientId: id !== 'All' ? id : null,
      pageNumber: 1
    }
    setProjectsSearchProps(searchProjectsPayload)
  }

  projectClicked = (id, center) => {
    const { zoom, fetchProjectIfNeeded, selectSite, setMapCenterBoundsZoom } = this.props

    fetchProjectIfNeeded(id)
    selectSite(id)
    setMapCenterBoundsZoom({ center, zoom })
  }

  handleAttachSite = id => {
    const { sites, attachSite } = this.props
    // const attachedOrSelectedSites = sites.filter(s => s._attached || s._selected)
    // this.handleSiteUpdate(attachedOrSelectedSites)
    attachSite(id)
  }

  handleUnattachSelectedSite = id => {
    const { unSelectSite } = this.props

    unSelectSite(id)
  }

  handleUnattachSite = id => {
    const { sites, unAttachSite } = this.props
    // const attachedSites = sites.filter(s => s._attached && s._id !== id)
    // this.handleSiteUpdate(attachedSites)
    unAttachSite(id)
  }

  handleSiteUpdate = sites => {
    const { item, saveUpdateProject } = this.props
    const updatedProject = cloneDeep({
      ...item,
      sites
    })
    saveUpdateProject(updatedProject)
  }

  handleLandUseChange = (site, landUse) => {
    const { saveUpdateSite } = this.props
    saveUpdateSite({
      ...site,
      landUse: landUse
    })
  }

  handleOnMapInfoCardClick = (center, zoom) => {
    const { setMapCenterBoundsZoom } = this.props
    setMapCenterBoundsZoom({ center, zoom })
  }

  renderMapInfoCards = (sites, className, hoveredChildKey, onClose) => {
    const { onChildMouseEnter, onChildMouseLeave, showPolygonsMinZoom } = this.props
    return sites.map(site => {
      const { id, _attached, locations } = site
      const _id = site._id.toString()
      const {
        0: { lat, lng }
      } = locations
      const center = [lat, lng]

      return (
        <div
          className={className}
          style={
            hoveredChildKey === _id || hoveredChildKey === id
              ? { boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)` }
              : null
          }
          onClick={() => this.handleOnMapInfoCardClick(center, showPolygonsMinZoom)}
          onMouseEnter={() => onChildMouseEnter(_id || id)}
          onMouseLeave={() => onChildMouseLeave(_id || id)}
        >
          <MapInfoCard
            key={id}
            site={site}
            onRemove={onClose}
            onAdd={!_attached ? this.handleAttachSite : null}
            onLandUseChange={this.handleLandUseChange}
          />
        </div>
      )
    })
  }

  renderProjectList = ({ data, index, style, isScrolling }) => {
    const { onChildMouseEnter, onChildMouseLeave, classes } = this.props
    const { hoveredChildKey } = this.state
    const { id, center, siteDescription } = data[index]

    return (
      <div
        key={id}
        onClick={() => this.projectClicked(id, center)}
        onMouseEnter={() => onChildMouseEnter(id)}
        onMouseLeave={() => onChildMouseLeave(id)}
        className={classes.listItem}
        style={{
          ...style,
          width: 'calc(100% - 7px)',
          backgroundColor: hoveredChildKey === id ? 'whitesmoke' : 'white'
        }}
      >
        {siteDescription}
      </div>
    )
  }

  renderDivider = () => {
    const { divider } = this.props.classes
    return (
      <div>
        <hr className={divider} />
      </div>
    )
  }

  render() {
    const { classes } = this.props
    const {
      clientId,
      listItems,
      clientsListItems,
      attachedSites,
      selectedSites,
      hoveredChildKey,
      listItemsLength,
      shouldRenderSelectedSites,
      shouldRenderMapInfoCardsDivider,
      shouldRenderAttachedSites,
      shouldRenderProjectList
    } = this.state

    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <SearchList
            defaultIdValue={clientId}
            list={clientsListItems}
            onListItemClick={id => this.handleSearchListItemClick(id)}
            placeholder={'Client Name'}
            helperText={'Filter projects by client'}
          />
        </Grid>
        <Grid item xs={12}>
          <ProjectDetailsEdit>
            {shouldRenderSelectedSites && (
              <div className={classes.siteContainer}>
                {this.renderMapInfoCards(
                  selectedSites,
                  classes.selectedSites,
                  hoveredChildKey,
                  this.handleUnattachSelectedSite
                )}
              </div>
            )}
            {shouldRenderMapInfoCardsDivider && this.renderDivider()}
            {shouldRenderAttachedSites && (
              <div className={classes.siteContainer}>
                {this.renderMapInfoCards(
                  attachedSites,
                  classes.attachedSites,
                  hoveredChildKey,
                  this.handleUnattachSite
                )}
              </div>
            )}
          </ProjectDetailsEdit>
        </Grid>

        {shouldRenderProjectList && (
          <Fragment>
            <Grid item xs={12}>
              {this.renderDivider()}
            </Grid>
            <Grid item xs={12}>
              <FixedSizeList
                ref={this.listRef}
                className={classes.list}
                height={792 - 25}
                width="auto"
                itemData={listItems}
                itemCount={listItemsLength}
                itemSize={50}
              >
                {this.renderProjectList}
              </FixedSizeList>
            </Grid>
          </Fragment>
        )}
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LocationList))

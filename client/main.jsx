import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import Toolbar from 'material-ui/Toolbar'
import MenuIcon from 'material-ui-icons/Menu'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import List, { ListItem, ListItemText } from 'material-ui/List'
import createReactClass from 'create-react-class'

import auth from './auth'
import router from './router'
import navigate from './navigate'

module.exports = createReactClass({
  getInitialState () {
    return {
      _path: window.location.hash.replace('#/', ''),
      email: auth.email()
    }
  },

  componentWillMount () {
    auth.client.on('email', this.onAuthChange)
    window.addEventListener('hashchange', this.onRoute)
  },

  componentWillUnmount () {
    auth.client.off('email', this.onAuthChange)
    window.removeEventListener('hashchange', this.onRoute)
  },

  render () {
    var route = router.get('/' + this.state._path)

    if (!route.handler) {
      navigate('/')
      return <div />
    }

    var params = decodeObj(route.params)

    var main = isReact(route.handler)
      ? React.createElement(route.handler, params)
      : React.createElement(route.handler(params), params)

    return (
      <div>
        {this.renderHeader()}
        <Drawer
          type='persistent'
          open={this.state.open}
        >
          <div>
            <div>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
          </div>
          <Divider />
          <List>
            <ListItem
              button
              component='a'
              href='#/hosts'
              onClick={this.handleDrawerClose}>
              <ListItemText primary='Hosts' />
            </ListItem>
            <ListItem
              button
              component='a'
              href='#/speakers'
              onClick={this.handleDrawerClose}>
              <ListItemText primary='Speakers' />
            </ListItem>
            <ListItem
              button
              component='a'
              href='#/sponsors'
              onClick={this.handleDrawerClose}>
              <ListItemText primary='Sponsors' />
            </ListItem>
            <ListItem
              button
              component='a'
              href='#/talks'
              onClick={this.handleDrawerClose}>
              <ListItemText primary='Talks' />
            </ListItem>
            <ListItem
              button
              component='a'
              href='https://wiki.js.la'
              target='_blank'
              onClick={this.handleDrawerClose}>
              <ListItemText primary='Wiki' />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <div>{main}</div>
      </div>
    )
  },

  renderHeader () {
    var logout = this.state.email
      ? <Button color='contrast' href='#/logout'>Logout</Button>
      : ''

    return (
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            color='contrast'
            aria-label='open drawer'
            onClick={this.handleDrawerOpen} >
            <MenuIcon />
          </IconButton>
          <Typography type='title' color='inherit' style={{flex: 1}}>
            <Button color='contrast' href='#/'>js.la Admin</Button>
          </Typography>
          { logout }
        </Toolbar>
      </AppBar>
    )
  },

  handleDrawerOpen () {
    this.setState({ open: true })
  },

  handleDrawerClose () {
    this.setState({ open: false })
  },

  onRoute () {
    this.setState({ _path: window.location.hash.replace('#/', '') })
  },

  onAuthChange (email) {
    this.setState({email: email})
    if (!email) navigate('/login')
  }
})

function decodeObj (obj) {
  var decoded = Object.assign({}, obj)
  Object.keys(decoded).forEach(function (k) {
    decoded[k] = decodeURIComponent(decoded[k])
  })
  return decoded
}

function isReact (fn) {
  return (typeof fn === 'function') && (!!fn.prototype.isReactComponent)
}

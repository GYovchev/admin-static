import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import createReactClass from 'create-react-class'
import { CircularProgress } from 'material-ui/Progress'

import api from '../api'

module.exports = createReactClass({
  getInitialState () {
    return {
      host: {name: this.props.name},
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getHost()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Edit Host</h1>
        { {
          'READY': this.renderEdit,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderEdit () {
    var months = this.state.host.dates.map(function (date) {
      var d = new Date(date).toString().split(' ')
      return `${d[1]} ${d[3]}`
    })

    return (
      <div>
        <div style={{
          boxShadow: '0 0 2 rgba(0,0,0,.2)',
          backgroundColor: 'white',
          backgroundImage: `url(${this.state.host.logo || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          width: 275,
          height: 100
        }} />

        <TextField
          label='Booked Talks'
          onChange={this.changeHost}
          name='bookedShows'
          margin='normal'
          multiline
          fullWidth
          value={this.state.host.bookedShows || ''} />

        <TextField
          label='Organization'
          onChange={this.changeHost}
          name='organization'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.organization || ''} />

        <TextField
          label='Name'
          onChange={this.changeHost}
          name='name'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.name || ''} />

        <TextField
          label='Email'
          onChange={this.changeHost}
          name='email'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.email || ''} />

        <TextField
          label='Capacity'
          onChange={this.changeHost}
          name='capacity'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.capacity || ''} />

        <TextField
          label='Microphone'
          onChange={this.changeHost}
          name='hasMicrophone'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.hasMicrophone || ''} />

        <TextField
          label='Projector'
          onChange={this.changeHost}
          name='hasProjector'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.hasProjector || ''} />

        <TextField
          label='Refreshments'
          onChange={this.changeHost}
          name='refreshments'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.refreshments || ''} />

        <TextField
          label='Logo'
          onChange={this.changeHost}
          name='logo'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.logo || ''} />

        <TextField
          label='Link'
          onChange={this.changeHost}
          name='link'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.link || ''} />

        <TextField
          label='Address'
          onChange={this.changeHost}
          name='address'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.address || ''} />

        <br />

        <TextField
          label='Parking Info'
          onChange={this.changeHost}
          name='parking'
          margin='normal'
          fullWidth
          value={this.state.host.parking || ''} />

        <TextField
          label='Goal'
          onChange={this.changeHost}
          name='goal'
          margin='normal'
          multiline
          fullWidth
          value={this.state.host.goal || ''} />

        <TextField
          label='Dates Available'
          name='dates'
          margin='normal'
          fullWidth
          value={months.join(', ') || ''} />

        <TextField
          label='Notes'
          onChange={this.changeHost}
          name='notes'
          margin='normal'
          multiline
          fullWidth
          value={this.state.host.notes || ''} />

        <br />

        <Button raised color='default' href={'#/hosts'} >
          Back
        </Button>

        <Button
          raised
          color='primary'
          onClick={this.updateHost}
          style={{marginLeft: 10}} >
          Update
        </Button>

        <Button
          raised
          onClick={this.removeHost}
          style={{marginLeft: 10, backgroundColor: 'red', color: 'white'}} >
          Delete
        </Button>
      </div>
    )
  },

  renderLoading () {
    return (
      <div style={{textAlign: 'center', padding: 50}}>
        <CircularProgress size={100} />
      </div>
    )
  },

  renderError () {
    return (
      <div style={{textAlign: 'center'}}>
        <Paper style={{width: 300, padding: 20, margin: '0 auto'}}>
          <Typography type='headline' component='h1'>
            We're Sorry!
          </Typography>
          <p>Something went wrong...</p>
          <p>
            <Button raised color='primary' onClick={this.getHost} >
              Retry?
            </Button>
          </p>
        </Paper>
      </div>
    )
  },

  getHost () {
    var name = this.state.host.name
    this.setState({_status: 'LOADING'})
    api.getHost(name, (err, host) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({host, _status: 'READY'})
    })
  },

  changeHost (evt) {
    var name = evt.target.name
    var value = evt.target.value

    var host = this.state.host
    host[name] = value

    this.setState({host})
  },

  updateHost (event) {
    var host = this.state.host

    this.setState({_status: 'LOADING'})

    api.updateHost(host, (err, updatedHost) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({
        host: updatedHost,
        _status: 'READY'
      })
    })
  },

  removeHost () {
    if (!window.confirm('Are you sure you want to delete this')) return
    var id = this.state.host.id
    this.setState({_status: 'LOADING'})
    api.removeHost(id, (err) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }
    })

    window.location.href = '#/hosts'
  }
})

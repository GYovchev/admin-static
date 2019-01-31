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
      sponsor: {name: this.props.name},
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getSponsor()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Edit Sponsor</h1>
        { {
          'READY': this.renderEdit,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderEdit () {
    var months = this.state.sponsor.dates.map(function (date) {
      var d = new Date(date).toString().split(' ')
      return `${d[1]} ${d[3]}`
    })

    return (
      <div>

        <div style={{
          boxShadow: '0 0 2 rgba(0,0,0,.2)',
          backgroundColor: 'white',
          backgroundImage: `url(${this.state.sponsor.logo || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          width: 275,
          height: 100
        }} />

        <TextField
          label='Booked Talks'
          onChange={this.changeSponsor}
          name='bookedShows'
          margin='normal'
          multiline
          fullWidth
          value={this.state.sponsor.bookedShows || ''} />

        <TextField
          label='Organization'
          name='organization'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.organization || ''} />

        <TextField
          label='Name'
          name='name'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.name || ''} />

        <TextField
          label='Email'
          name='email'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.email || ''} />

        <TextField
          label='Slack'
          name='slack'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.slack || ''} />

        <TextField
          label='# Months'
          name='desiredMonths'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.desiredMonths || ''} />

        <TextField
          label='Logo'
          name='logo'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.logo || ''} />

        <TextField
          label='Link'
          name='link'
          margin='normal'
          style={{marginRight: 10}}
          onChange={this.changeSponsor}
          value={this.state.sponsor.link || ''} />

        <br />

        <TextField
          label='Goal'
          name='goal'
          margin='normal'
          multiline
          fullWidth
          onChange={this.changeSponsor}
          value={this.state.sponsor.goal || ''} />

        <TextField
          label='Dates Available'
          name='dates'
          margin='normal'
          fullWidth
          value={months.join(', ') || ''} />

        <TextField
          label='Notes'
          onChange={this.changeSponsor}
          name='notes'
          margin='normal'
          multiline
          fullWidth
          value={this.state.sponsor.notes || ''} />

        <br />

        <Button raised color='default' href={'#/sponsors'} >
          Back
        </Button>

        <Button
          raised
          color='primary'
          onClick={this.updateSponsor}
          style={{marginLeft: 10}} >
          Update
        </Button>

        <Button
          raised
          onClick={this.removeSponsor}
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
            <Button raised color='primary' onClick={this.getSponsor} >
              Retry?
            </Button>
          </p>
        </Paper>
      </div>
    )
  },

  getSponsor () {
    var name = this.state.sponsor.name
    this.setState({_status: 'LOADING'})
    api.getSponsor(name, (err, sponsor) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({sponsor, _status: 'READY'})
    })
  },

  changeSponsor (evt) {
    var name = evt.target.name
    var value = evt.target.value

    var sponsor = this.state.sponsor
    sponsor[name] = value

    this.setState({sponsor})
  },

  updateSponsor () {
    var sponsor = this.state.sponsor

    this.setState({_status: 'LOADING'})

    api.updateSponsor(sponsor, (err, updatedSponsor) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({
        sponsor: updatedSponsor,
        _status: 'READY'
      })
    })
  },

  removeSponsor () {
    if (!window.confirm('Are you sure you want to delete this')) return
    var id = this.state.sponsor.id
    this.setState({_status: 'LOADING'})
    api.removeSponsor(id, (err) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }
    })

    window.location.href = '#/sponsors'
  }
})

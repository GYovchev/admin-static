import map from 'map-async'
import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import AddIcon from 'material-ui-icons/Add'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import List, { ListItem, ListItemAvatar } from 'material-ui/List'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import createReactClass from 'create-react-class'

import api from '../api'
import navigate from '../navigate'
import showDates from '../show-dates'

module.exports = createReactClass({
  getInitialState () {
    return {
      shows: [],
      allSpeakers: [],
      allSponsors: [],
      allHosts: [],
      drinksjs: {},
      _status: 'READY',
      _deployStatus: 'READY'
    }
  },

  componentWillMount () {
    this.getList()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        { this.renderDeploy() }

        <h1>Shows List</h1>

        { {
          'READY': this.renderMain,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderDeploy () {
    var button = {
      READY: (
        <Button raised color='accent' onClick={this.triggerDeploy}>
          Deploy js.la
        </Button>
      ),
      SENT: <Button disabled>Done!</Button>
    }[this.state._deployStatus]

    return <div style={{float: 'right', marginTop: 21.4333}}>{button}</div>
  },

  renderMain () {
    return (
      <div>
        { this.renderTable() }
        { this.renderDialog() }
      </div>
    )
  },

  renderTable () {
    return (
      <Paper style={{overflowX: 'scroll'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Speaker 1</TableCell>
              <TableCell>Speaker 2</TableCell>
              <TableCell>Sponsor 1</TableCell>
              <TableCell>Sponsor 2</TableCell>
              <TableCell>Drinks Js</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.state.shows.map((exp) => (
              <TableRow
                key={exp.date}
                hover
                style={{cursor: 'pointer'}} >
                <TableCell>{exp.date}</TableCell>
                <TableCell>{this.renderContributor('hosts', exp.host, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('speakers', exp.speaker1, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('speakers', exp.speaker2, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('sponsors', exp.sponsor1, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('sponsors', exp.sponsor2, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('drinksjs', exp.drinksjs, exp.date)}</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </Paper>
    )
  },

  renderDialog (type, date) {
    var fn = {
      'hosts': this.renderHostDialog,
      'sponsors': this.renderSponsorDialog,
      'speakers': this.renderSpeakerDialog,
      'drinksjs': this.renderDrinksjsDialog
    }[this.state.addType]

    if (!fn) return <div />

    return fn(this.state.addDate)
  },

  renderHostDialog (date) {
    var hosts = this.state.allHosts

    return (
      <Dialog onRequestClose={this.closeAddDialog} open>
        <DialogTitle>Select Host</DialogTitle>
        <div style={{overflowY: 'scroll'}}>
          <List>
            { hosts.map((host, i) => {
              return (
                <ListItem
                  button
                  key={host.organization}
                  onClick={this.bookContributor.bind(this, 'host', host, date)} >
                  <ListItemAvatar style={{marginRight: 20}}>
                    <Avatar><img src={host.logo} /></Avatar>
                  </ListItemAvatar>
                  {host.organization}
                </ListItem>
              )
            })}
          </List>
        </div>
      </Dialog>
    )
  },

  renderSponsorDialog (date) {
    var sponsors = this.state.allSponsors

    return (
      <Dialog onRequestClose={this.closeAddDialog} open>
        <DialogTitle>Select Sponsor</DialogTitle>
        <div style={{overflowY: 'scroll'}}>
          <List>
            { sponsors.map((sponsor, i) => {
              return (
                <ListItem
                  button
                  key={sponsor.organization}
                  onClick={this.bookContributor.bind(this, 'sponsor', sponsor, date)} >
                  <ListItemAvatar style={{marginRight: 20}}>
                    <Avatar><img src={sponsor.logo} /></Avatar>
                  </ListItemAvatar>
                  {sponsor.organization}
                </ListItem>
              )
            })}
          </List>
        </div>
      </Dialog>
    )
  },

  renderSpeakerDialog (date) {
    var speakers = this.state.allSpeakers.filter(function (speaker) {
      return speaker.name && !speaker.bookedShows && !speaker.isArchived && speaker.submitState === 'done'
    })

    return (
      <Dialog onRequestClose={this.closeAddDialog} open>
        <DialogTitle>Select Speaker</DialogTitle>
        <div style={{overflowY: 'scroll'}}>
          <List>
            { speakers.map((speaker, i) => {
              return (
                <ListItem
                  button
                  key={speaker.name}
                  onClick={this.bookContributor.bind(this, 'speaker', speaker, date)} >
                  <ListItemAvatar style={{marginRight: 20}}>
                    <Avatar><img src={speaker.avatar} /></Avatar>
                  </ListItemAvatar>
                  {speaker.name}: "{truncate(speaker.title)}"
                </ListItem>
              )
            })}
          </List>
        </div>
      </Dialog>
    )
  },

  renderDrinksjsDialog (date) {
    return (
      <Dialog onRequestClose={this.closeAddDialog} open>
        <DialogTitle>Edit drinksjs</DialogTitle>
        <div style={{width: '300px', padding: '40px'}}>
          <div><TextField
            fullWidth
            label='Name'
            onChange={this.editDrinksjs}
            name='name'
            margin='normal'
            value={this.state.drinksjs.name || ''} />
          </div>
          <div><TextField
            fullWidth
            label='Address'
            onChange={this.editDrinksjs}
            name='address'
            margin='normal'
            value={this.state.drinksjs.address || ''} />
          </div>
          <Button
            raised
            color='primary'
            onClick={this.updateDrinksjs}
            style={{marginLeft: 10}} >
          Update
        </Button>
        </div>
      </Dialog>
    )
  },

  renderContributor (type, contributor, date) {
    if (!contributor) {
      return (
        <Button style={{opacity: 0.3}} onClick={() => {
          this.setState({
            addType: type,
            addDate: date
          })
        }} >
          <AddIcon />
        </Button>
      )
    }

    if (type === 'drinksjs') {
      let drinksjsState = {}
      let currentDrinksjs = this.state.shows.filter((show) => {
        return show.date === date
      })[0].drinksjs
      if (currentDrinksjs) {
        drinksjsState = currentDrinksjs
      }
      return (
        <div style={{textAlign: 'center'}}
          onClick={() => {
            this.setState({
              addType: type,
              addDate: date,
              drinksjs: drinksjsState
            })
          }}>
          <img src='https://js.la/images/drinks.svg' style={{width: 50}} />
          <br />
          <a href='#'>
            {contributor.organization || contributor.name}
          </a>
        </div>
      )
    }

    return (
      <div style={{textAlign: 'center'}}>
        <img src={contributor.logo || contributor.avatar} style={{width: 50}} />
        <br />
        <a href={`#/${type}/edit/${contributor.id}`}>
          {contributor.organization || contributor.name}
        </a>
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
          <p>We couldn't load the list...</p>
          <p>
            <Button raised color='primary' onClick={this.getList} >
              Retry?
            </Button>
          </p>
        </Paper>
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

  triggerDeploy () {
    this.setState({_deployStatus: 'SENT'})
    api.triggerDeploy()
  },

  getList () {
    this.setState({_status: 'LOADING'})

    var conceptNames = ['speaker', 'host', 'sponsor', 'drinksjs']
    map(conceptNames, api.list, (err, concepts) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      var [speakers, hosts, sponsors, drinksjs] = concepts

      var shows = showDates.map(function (date) {
        var month = date.slice(0, 7)
        var speakerMatch = speakers.filter(function (speaker) {
          return (speaker.bookedShows || '').match(month)
        })

        var hostMatch = hosts.filter(function (host) {
          return (host.bookedShows || '').match(month)
        })

        var sponsorMatch = sponsors.filter(function (sponsor) {
          return (sponsor.bookedShows || '').match(month)
        })

        var drinksjsMatch = drinksjs.filter(function (drinks) {
          return (drinks.bookedShows || '').match(month)
        })

        return {
          date: date,
          host: hostMatch[0],
          speaker1: speakerMatch[0],
          speaker2: speakerMatch[1],
          sponsor1: sponsorMatch[0],
          sponsor2: sponsorMatch[1],
          drinksjs: drinksjsMatch[0]
        }
      })

      this.setState({
        shows: shows,
        allSpeakers: speakers,
        allSponsors: sponsors,
        allHosts: hosts,
        _status: 'READY'
      })
    })
  },

  editShow (name) {
    navigate(`/shows/edit/${name}`)
  },

  closeAddDialog () {
    this.setState({
      addType: null,
      addDate: null,
      drinksjs: {}
    })
  },

  editDrinksjs (event) {
    var drinksjs = this.state.drinksjs
    var {name, value} = event.target

    drinksjs[name] = value

    this.setState({ drinksjs: drinksjs })
  },

  updateDrinksjs (event) {
    var drinksjs = this.state.drinksjs

    var month = this.state.addDate.slice(0, 7)
    var showsMatch = this.state.shows.filter(function (show) {
      return (show.date || '').match(month)
    })
    drinksjs.id = showsMatch.length > 0 && showsMatch[0].drinksjs ? showsMatch[0].drinksjs.id : generateUniqeId()

    this.bookContributor('drinksjs', drinksjs, this.state.addDate)
  },

  bookContributor (type, contributor, date) {
    var bookedDates = (contributor.bookedShows || '').split('\n')
    bookedDates.push(date)

    contributor.bookedShows = Object.keys(
      bookedDates.reduce(function (memo, key) {
        if (key) memo[key] = true
        return memo
      }, {})
    ).join('\n')

    this.setState({_status: 'LOADING', addDate: null, addType: null, drinksjs: {}})
    api.update(type, contributor, (err, updated) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.getList()
    })
  }
})

function truncate (str, len) {
  len = len || 50
  if (!str) return ''
  if (str.length <= len) return str

  return str.slice(0, len - 3) + '...'
}

function generateUniqeId () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 28; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}

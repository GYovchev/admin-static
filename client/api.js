var auth = require('./auth')

var API = process.env.API_ENDPOINT || 'https://admin.apps.js.la'

module.exports = {
  getHost,
  listHosts,
  getSpeaker,
  listSpeakers,
  getSponsor,
  listSponsors,
  updateSpeaker,
  updateSponsor,
  updateHost,
  removeSpeaker,
  removeSponsor,
  removeHost,
  list,
  update,
  triggerDeploy
}

function getHost (id, cb) { get('host', id, cb) }
function removeHost (id, cb) { remove('host', id, cb) }
function listHosts (cb) { list('host', cb) }
function updateHost (host, cb) { update('host', host, cb) }
function getSpeaker (id, cb) { get('speaker', id, cb) }
function removeSpeaker (id, cb) { remove('speaker', id, cb) }
function listSpeakers (cb) { list('speaker', cb) }
function updateSpeaker (speaker, cb) { update('speaker', speaker, cb) }
function getSponsor (id, cb) { get('sponsor', id, cb) }
function removeSponsor (id, cb) { remove('sponsor', id, cb) }
function listSponsors (cb) { list('sponsor', cb) }
function updateSponsor (sponsor, cb) { update('sponsor', sponsor, cb) }

function list (type, cb) {
  var url = `${API}/api/list/${type}`
  auth.get(url, function (err, itemsById) {
    if (err) return cb(err)

    cb(null, Object.keys(itemsById).reduce(function (memo, key) {
      itemsById[key].id = key
      itemsById[key].dates = Object.values(itemsById[key].dates || {})
      memo.push(itemsById[key])

      return memo
    }, []))
  })
}

function get (type, id, cb) {
  var url = `${API}/api/get/${type}/${id}`
  auth.get(url, function (err, item) {
    if (err) return cb(err)

    item.id = id
    item.dates = Object.values(item.dates || {})

    cb(null, item)
  })
}

function remove (type, id, cb) {
  var url = `${API}/api/remove/${type}/${id}`
  auth.get(url, cb)
}

function update (type, item, cb) {
  var url = `${API}/api/update/${type}/${item.id}`
  auth.post(url, item, cb)
}

function triggerDeploy (cb) {
  var url = `${API}/api/trigger-site-deploy`
  auth.get(url, cb)
}

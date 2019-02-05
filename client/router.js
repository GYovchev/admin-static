import Router from 'http-hash'

import auth from './auth'
import navigate from './navigate'

var router = module.exports = Router()

router.set('/', restrict(require('./shows/list.jsx')))

router.set('/hosts', restrict(require('./hosts/list.jsx')))
router.set('/hosts/edit/:name', restrict(require('./hosts/edit.jsx')))

router.set('/speakers', restrict(require('./speakers/list.jsx')))
router.set('/speakers/edit/:name', restrict(require('./speakers/edit.jsx')))

router.set('/sponsors', restrict(require('./sponsors/list.jsx')))
router.set('/sponsors/edit/:name', restrict(require('./sponsors/edit.jsx')))

router.set('/talks', restrict(require('./shows/list.jsx')))

router.set('/login', auth.login)
router.set('/logout', auth.logout)
router.set('/signup', auth.signup)
router.set('/confirm/:email/:confirmToken', auth.confirm)
router.set('/change-password-request', auth.changePasswordRequest)
router.set('/change-password/:email/:changeToken', auth.changePassword)

function restrict (component) {
  return function () {
    if (!auth.isLoggedIn()) navigate('/login')
    return component
  }
}

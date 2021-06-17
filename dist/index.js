
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./next-router.cjs.production.min.js')
} else {
  module.exports = require('./next-router.cjs.development.js')
}

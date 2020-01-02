const jwt = require('jsonwebtoken')
const { AUTH_SECRET } = require('./constants')

const getUserId = (context) => {
   const authorizationHeader = context.request.get('Authorization')

   if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '')
      const { userId } = jwt.verify(token, AUTH_SECRET)
      return Number(userId)
   }

   throw new Error('Not authenticated.')
}

module.exports = getUserId
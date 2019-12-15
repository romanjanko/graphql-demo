const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../db')
const { NEW_COMMENT_CHANNEL_NAME } = require('./constants')
const { AUTH_SECRET } = require('../auth/constants')
const getUserId = require('../auth/getUserId')

const addComment = (parent, args, context) => {
   const userId = getUserId(context)

   const users = db.getData('/users')

   // TODO better check for valid user
   if (userId && users.length) {
      const { text } = args
      const tourId = Number(args.tourId)
      const tours = db.getData('/tours')
      const tour = tours.find(t => t.id === tourId)

      if (tour) {
         const { comments: tourComments } = tour

         const comments = db.getData('/comments')

         const comment = {
            id: comments.length + 1,
            text,
            createdBy: userId,
            createdAt: new Date(),
            tour: tourId
         }

         db.push('/comments', [comment], false)
         
         tourComments.push(comment.id)

         db.push('/tours', tours)
         
         context.pubsub.publish(NEW_COMMENT_CHANNEL_NAME, {
            newComment: comment
         })

         return comment
      } else {
         throw new Error(`Tour with id ${tourId} not found!`)
      }
   } else {
      throw new Error(`Not authenticated.`)
   }
}

const signup = async (parent, args) => {
   const users = db.getData('/users')

   if (users.find(u => u.name === args.name)) {
      throw new Error('User with same name already exists.')
   }

   const password = await bcrypt.hash(args.password, 10)

   const user = {
      ...args,
      id: users.length + 1,
      password
   }

   db.push('/users', [ user ], false)

   const token = jwt.sign({ userId: user.id }, AUTH_SECRET)

   return {
      token,
      user
   }
}

const login = async (parent, args) => {
   const { name } = args

   const users = db.getData('/users')
   const user = users.find(u => u.name === name)

   if (!user) {
      throw new Error('No such user found.')
   }

   const valid = await bcrypt.compare(args.password, user.password)

   if (!valid) {
      throw new Error('Invalid password.')
   }

   const token = jwt.sign({ userId: user.id }, AUTH_SECRET)

   return {
      token,
      user
   }
}

module.exports = {
   addComment,
   signup,
   login
}
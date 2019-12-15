const { NEW_COMMENT_CHANNEL_NAME } = require('./constants')

const newComment = {
   subscribe: (parent, args, context) => {
      return context.pubsub.asyncIterator(NEW_COMMENT_CHANNEL_NAME)
   }
}

module.exports = {
   newComment
}
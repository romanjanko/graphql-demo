const db = require('../db')

const comments = (parent, args) => {
   const { comments: commentsIds = [] } = parent
   const comments = db.getData('/comments')
   return comments.filter(c => commentsIds.includes(c.id))
}

module.exports = {
   comments
}
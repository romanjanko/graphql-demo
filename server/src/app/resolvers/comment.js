const db = require('../db')

const createdBy = (parent, args) => {
   const { createdBy: userId } = parent

   const users = db.getData('/users')
   const user = users.find(u => u.id === userId)

   return user
}

const tour = (parent, args) => {
   const { tour: tourId } = parent
   
   const tours = db.getData('/tours')
   const tour = tours.find(t => t.id === tourId)

   return tour
}

module.exports = {
   createdBy,
   tour
}
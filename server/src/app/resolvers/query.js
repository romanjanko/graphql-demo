const db = require('../db')

const TOURS_ORDER_BY_NAME_ASC = 'nameAsc'
const TOURS_ORDER_BY_NAME_DESC = 'nameDesc'

const tours = (parent, args) => {
   const applyOrderBy = orderBy => (tourA, tourB) => {
      const compareStrings = (strA, strB) => {
         const strALowerCase = strA.toLowerCase()
         const strBLowerCase = strB.toLowerCase()

         if (strALowerCase < strBLowerCase) return -1
         if (strALowerCase > strBLowerCase) return 1

         return 0
      }

      const orderByNameAsc = () => compareStrings(tourA.name, tourB.name)
      const orderByNameDesc = () => compareStrings(tourB.name, tourA.name)

      switch (orderBy) {
         case TOURS_ORDER_BY_NAME_ASC:
            return orderByNameAsc()
         case TOURS_ORDER_BY_NAME_DESC:
            return orderByNameDesc()
         default:
            return orderByNameAsc()
      }
   }

   const tours = db.getData('/tours')

   const { orderBy, skip: skipArg, first: firstArg } = args

   const skip = skipArg >= 0 ? skipArg : 0
   const first = firstArg >= 0 ? firstArg : tours.length

   return {
      tours: tours
         .sort(applyOrderBy(orderBy))
         .slice(skip, skip + first),
      total: tours.length
   }
}

const tour = (parent, args) => {
   const tourId = Number(args.tourId)
   const tours = db.getData('/tours')
   return tours.find(t => t.id === tourId)
}

module.exports = {
   tours,
   tour
}
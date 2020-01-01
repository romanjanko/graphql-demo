const db = require('../db')

const TOURS_BY_PAGE = 120 //TODO

const TOURS_ORDER_BY_NAME_ASC = 'nameAsc'
const TOURS_ORDER_BY_NAME_DESC = 'nameDesc'

const tours = (parent, args) => {
   const { filter = '', orderBy, page: pageArg = 0 } = args
   const page = Number(pageArg)

   const applyFilter = tour =>
      tour.name.toLowerCase().includes(filter.toLowerCase())

   const applyOrderBy = (tourA, tourB) => {
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

   return tours
      .filter(applyFilter)
      .slice(page * TOURS_BY_PAGE, page * TOURS_BY_PAGE + TOURS_BY_PAGE)
      .sort(applyOrderBy)
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
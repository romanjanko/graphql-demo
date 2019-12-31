const db = require('../db')

const TOURS_BY_PAGE = 12

const TOURS_ORDER_BY_NAME_ASC = 'nameAsc'
const TOURS_ORDER_BY_NAME_DESC = 'nameDesc'
const TOURS_ORDER_BY_PRICE_ASC = 'priceAsc'
const TOURS_ORDER_BY_PRICE_DESC = 'priceDesc'

const tours = (parent, args) => {
   const { filter = '', orderBy, page: pageArg = 0 } = args
   const page = Number(pageArg)

   const applyFilter = tour =>
      tour.name.toLowerCase().includes(filter.toLowerCase())

   const applyOrderBy = (tourA, tourB) => {
      const orderByNameAsc = () => tourA.name.toLowerCase() - tourB.name.toLowerCase()
      const orderByNameDesc = () => tourB.name.toLowerCase() - tourA.name.toLowerCase()
      const orderByPriceAsc = () => tourA.price - tourB.price
      const orderByPriceDesc = () => tourB.price - tourA.price

      switch (orderBy) {
         case TOURS_ORDER_BY_NAME_ASC:
            return orderByNameAsc()
         case TOURS_ORDER_BY_NAME_DESC:
            return orderByNameDesc()
         case TOURS_ORDER_BY_PRICE_ASC:
            return orderByPriceAsc()
         case TOURS_ORDER_BY_PRICE_DESC:
            return orderByPriceDesc()
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
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import TourPreview from './tourPreview/TourPreview'
import Pagination from './pagination/Pagination'

const TOURS_QUERY = gql`
   query Tours($skip: Int, $first: Int) {
      tours(skip: $skip, first: $first) {
         total
         tours {
            id
            name
         }
      }
   }
`

const TOURS_PER_PAGE = 9

const ToursList = () => {
   const { page: pageParam } = useParams()
   const page = Number(pageParam) >= 0 ? Number(pageParam) : 1

   const { loading, error, data = {} } = useQuery(
      TOURS_QUERY,
      {
         variables: {
            skip: (Number(page) - 1) * TOURS_PER_PAGE,
            first: TOURS_PER_PAGE
         }
      }
   )

   if (loading) return 'Loading...'
   if (error) return `Error! ${error.message}`

   const { tours = [], total = 0 } = data.tours

   return (
      <React.Fragment>
         <div>
            {tours.map(tour => <TourPreview key={tour.id} {...tour} />)}
         </div>
         <Pagination 
            currentPage={page}
            toursPerPage={TOURS_PER_PAGE}
            toursTotal={total}
         />
      </React.Fragment>
   )
}

export default ToursList
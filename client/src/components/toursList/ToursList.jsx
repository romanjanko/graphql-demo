import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import TourPreview from './tourPreview/TourPreview'

const TOURS_QUERY = gql`
   query {
      tours {
         id
         name
         price
         transport
      }
   }
`

const ToursList = () => {
   const { loading, error, data } = useQuery(TOURS_QUERY)

   if (loading) return 'Loading...'
   if (error) return `Error! ${error.message}`

   return (
      <React.Fragment>
         <h1>
            Tours List
         </h1>

         <div>
            {data.tours.map(tour => <TourPreview key={tour.id} {...tour} />)}
         </div>
      </React.Fragment>
   )
}

export default ToursList
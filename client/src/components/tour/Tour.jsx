import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CommentsList from './comments/CommentsList'

const TOUR_QUERY = gql`
   query Tour($tourId: ID!) {
      tour(tourId: $tourId) {
         id
         name
         description
         price
         transport
         comments {
            id
            text
            createdBy {
               name
            }
            createdAt
         }
      }
   }
`

const Tour = () => {
   const { id: tourId } = useParams()
   const { loading, error, data = {} } = useQuery(TOUR_QUERY, {
      variables: {
         tourId: Number(tourId)
      }
   })
   const { tour } = data

   if (loading) return 'Loading...'
   if (error) return `Error! ${error.message}`

   return (
      <div>
         <h1>
            {tour.name}
         </h1>
         <p>
            {tour.description}
         </p>

         <CommentsList comments={tour.comments} />
      </div>
   )
}

export default Tour
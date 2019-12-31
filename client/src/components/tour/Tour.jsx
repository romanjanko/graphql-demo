import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { makeStyles } from '@material-ui/core/styles'

import AddComment from './comments/AddComment'
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

const useStyles = makeStyles({
   root: {
      padding: '8px 0 0'
   }
})

const Tour = () => {
   const classes = useStyles()

   const { id: tourId } = useParams()

   const { loading, error, data = {} } = useQuery(TOUR_QUERY, {
      variables: {
         tourId: Number(tourId)
      }
   })

   const { tour } = data

   const onNewCommentAdded = (cache, newComment) => {
      const { tour } = cache.readQuery({ 
         query: TOUR_QUERY, 
         variables: {
            tourId: Number(tourId)
         }
      })
      cache.writeQuery({
         query: TOUR_QUERY,
         data: { 
            tour: {
               ...tour,
               comments: tour.comments.concat([ newComment ])
            }
         }
      })
   }

   if (loading) return 'Loading...'
   if (error) return `Error! ${error.message}`

   return (
      <div className={classes.root}>
         <h1>
            {tour.name}
         </h1>
         <p>
            {tour.description}
         </p>

         <AddComment onNewCommentAdded={onNewCommentAdded} />
         <CommentsList comments={tour.comments} />
      </div>
   )
}

export default Tour
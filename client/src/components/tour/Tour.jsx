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

   const addComment = (client, newComment) => {
      const { tour } = client.readQuery({ 
         query: TOUR_QUERY, 
         variables: {
            tourId: Number(tourId)
         }
      })

      const exists = tour.comments.some(c => Number(c.id) === Number(newComment.id))

      if (!exists) {
         client.writeQuery({
            query: TOUR_QUERY,
            variables: {
               tourId: Number(tourId)
            },
            data: { 
               tour: {
                  ...tour,
                  comments: [ ...tour.comments, newComment ]
               }
            }
         })
      }
   }

   const onNewCommentAdded = (client, newComment) => {
      addComment(client, newComment)
   }

   const subscribeToNewComments = (client, newComment) => {
      if (Number(tourId) === Number(newComment.tour.id)) {
         addComment(client, newComment)
      }
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
         <CommentsList 
            comments={tour.comments}
            subscribeToNewComments={subscribeToNewComments} 
         />
      </div>
   )
}

export default Tour
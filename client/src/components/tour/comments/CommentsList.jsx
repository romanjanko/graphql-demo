import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { useSubscription } from '@apollo/react-hooks'

import Comment from './Comment'

const NEW_COMMENT_SUBSCRIPTION = gql`
   subscription NewComment {
      newComment {
         id
         text
         createdBy {
            name
         }
         createdAt
         tour {
            id
         }
      }
   }
`

const useStyles = makeStyles({
   root: {
      padding: '16px 16px 0'
   }
})

const CommentsList = ({ comments, subscribeToNewComments }) => {
   const classes = useStyles()

   useSubscription(NEW_COMMENT_SUBSCRIPTION, {
      onSubscriptionData: ({ client, subscriptionData: { data: { newComment } } }) => {
         subscribeToNewComments(client, newComment)
      }
   })

   return comments.length > 0 && (
      <Paper 
         elevation={0}
         className={classes.root}
      >
         {comments
            .sort((commentA, commentB) => new Date(commentB.createdAt) - new Date(commentA.createdAt))
            .map(comment => (
               <Comment
                  key={comment.id}
                  createdBy={comment.createdBy.name}
                  text={comment.text}
                  createdAt={new Date(comment.createdAt)}
               />
            ))
         }
      </Paper>
   )
}

export default CommentsList
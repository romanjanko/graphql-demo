import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Comment from './Comment'

const useStyles = makeStyles({
   root: {
      padding: '16px 16px 0'
   }
})

const CommentsList = ({ comments }) => {
   const classes = useStyles()

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
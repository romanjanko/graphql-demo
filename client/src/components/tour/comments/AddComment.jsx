import React, { useState } from 'react'
import { Link, useParams, withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { TextareaAutosize, FormHelperText, Paper, Button, Icon } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const IS_USER_LOGGED_IN = gql`
   {
      isUserLoggedIn @client
   }
`

const ADD_NEW_COMMENT_MUTATION = gql`
   mutation AddComment($tourId: ID!, $text: String!) {
      addComment(tourId: $tourId, text: $text) {
         id
         text
         createdBy {
            name
         }
         createdAt
      }
   }
`

const useStyles = makeStyles({
   root: {
      padding: '16px',
      marginBottom: '16px'
   },
   textarea: {
      width: '100%',
      borderRadius: '4px',
      padding: '8px',
      marginBottom: '8px'
   },
   errors: {
      marginTop: '16px'
   },
   infoBlock: {
      display: 'flex'
   },
   infoIcon: {
      marginRight: '8px'
   }
})

const AddComment = ({ onNewCommentAdded }) => {
   const { id: tourId } = useParams()

   const classes = useStyles()

   const [ newComment, setNewComment ] = useState('')

   const {
      data: {
         isUserLoggedIn
      } = {}
   } = useQuery(IS_USER_LOGGED_IN)

   const [ addNewComment, { loading, error } ] = useMutation(
      ADD_NEW_COMMENT_MUTATION,
      {
         onCompleted: () => {
            setNewComment('')
         },
         update: (cache, { data: { addComment: newComment } }) => {
            onNewCommentAdded(cache, newComment)
         }
      }
   )

   const onSubmit = (event) => {
      event.preventDefault()
      addNewComment({
         variables: {
            tourId,
            text: newComment
         }
      })
   }

   return isUserLoggedIn ? (
      <Paper 
         elevation={0}
         className={classes.root}
      >
         <form onSubmit={onSubmit}>
            <TextareaAutosize
               className={classes.textarea}
               placeholder='Type your comment here...'
               rows={5}
               value={newComment}
               onChange={e => setNewComment(e.target.value)}
            />
            
            <Button 
               type='submit'
               variant='contained'
               color='primary'
               disabled={loading}
            >
               Add new comment
            </Button>

            {error && (
               <FormHelperText 
                  id='errors'
                  className={classes.errors}
                  error
               >
                  Failed to add your new comment. Try again later please.
               </FormHelperText>
            )}
         </form>
      </Paper>
   ) : (
      <p className={classes.infoBlock}>
         <Icon color='primary' fontSize='small' className={classes.infoIcon}>info</Icon>
         <span>
            For adding new comments please <Link to='/login'>log in</Link> or <Link to='/signup'>sign up</Link> if you don't have an account yet.
         </span>
      </p>
   )
}

export default withRouter(AddComment)
import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// initialize the desired locales
JavascriptTimeAgo.locale(en)

const useStyles = makeStyles({   
   root: {
      paddingBottom: '8px'
   },
   header: {
      display: 'flex'
   },
   author: {
      display: 'flex',
      marginRight: '16px'
   },
   time: {
      display: 'flex',
      alignSelf: 'center'
   }
})

const Comment = ({ createdBy, text, createdAt }) => {
   const classes = useStyles()

   return (
      <div className={classes.root}>
         <div className={classes.header}>
            <Typography
               className={classes.author}
               color='primary'
               variant='subtitle1'
            >
               {createdBy}
            </Typography>
            <Typography
               className={classes.time}
               color='textSecondary'
               variant='caption'
            >
               <ReactTimeAgo date={createdAt} />
            </Typography>
         </div>
         <p>
            {text}
         </p>
      </div>
   )
}

export default Comment
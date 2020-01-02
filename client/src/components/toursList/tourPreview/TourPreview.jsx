import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
   link: {
      color: 'initial',
      textDecoration: 'none'
   },
   title: {
      '&:hover': {
         color: 'initial'
      }
   },
   description: {
      textAlign: 'justify'
   }
 })

const TourPreview = ({ id, name, description }) => {
   const classes = useStyles()
   
   return (
      <Card>
         <CardActionArea>
            <Link to={`/tour/${id}`} className={classes.link}>
               <CardContent>
                  <Typography 
                     gutterBottom
                     variant='h5'
                     component='h2'
                     className={classes.title}
                  >
                     {name}
                  </Typography>
                  <Typography 
                     variant='body2'
                     color='textSecondary'
                     component='p'
                     className={classes.description}
                  >
                     {`${description.substring(0, 150)}...`}
                  </Typography>
               </CardContent>
            </Link>
         </CardActionArea>
      </Card>
   )
}

export default TourPreview
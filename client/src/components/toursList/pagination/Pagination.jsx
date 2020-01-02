import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
   previous: {
      marginRight: '16px'
   },
   counter: {
      fontWeight: 'bold'
   },
   next: {
      marginLeft: '16px'
   }
})

const Pagination = ({ currentPage, toursPerPage, toursTotal }) => {
   const classes = useStyles()

   const totalPages = Math.ceil(toursTotal / toursPerPage)

   const previousPage = Math.max(currentPage - 1, 1)
   const nextPage = Math.min(currentPage + 1, totalPages)

   return (
      <div>
         {currentPage !== previousPage && (
            <Button
               className={classes.previous}
               component={Link}
               to={`/${previousPage}`}
               variant='contained'
            >
               Previous
            </Button>
         )}

         <span className={classes.counter}>
            {`${currentPage} / ${totalPages}`}
         </span>

         {currentPage !== nextPage && (
            <Button
               className={classes.next}
               component={Link}
               to={`/${nextPage}`}
               variant='contained'
            >
            Next
            </Button>
         )}
      </div>
   )
}

export default Pagination
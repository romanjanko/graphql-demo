import React from 'react'
import { Link } from 'react-router-dom'

const TourPreview = ({ id, name }) => (
   <Link to={`/tour/${id}`}>
      <div>{name}</div>
   </Link>
)

export default TourPreview
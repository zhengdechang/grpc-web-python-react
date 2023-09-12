import React, { useEffect, useState } from 'react'

const StreamingViewer = (props) => {
  const { points } = props

  console.log(points, 'points')

  return (
    <div>
      {points.map((point, index) => (
        <div key={index}>
          Point {index + 1}: ({point.x}, {point.y}, {point.z})
        </div>
      ))}
    </div>
  )
}

export default React.memo(StreamingViewer)

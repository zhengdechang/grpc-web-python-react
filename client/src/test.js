import React, { useEffect, useState } from 'react'
import { PointCloudRequest, PointCloudResponse } from './point_cloud_pb'
import { PointCloudStreamServiceClient } from './point_cloud_pb_service'
import { grpc } from 'grpc-web'

const PointCloudComponent = () => {
  const [points, setPoints] = useState([])

  useEffect(() => {
    const request = new PointCloudRequest()
    request.setPcdFile('path/to/your/pcd/file.pcd')

    const client = new PointCloudStreamServiceClient(
      'http://localhost:5000',
      null,
      null
    )
    const stream = client.getStreamPointCloud(request, {})

    stream.on('data', (response) => {
      const point = {
        x: response.getX(),
        y: response.getY(),
        z: response.getZ(),
      }
      setPoints((prevPoints) => [...prevPoints, point])
    })

    stream.on('error', (error) => {
      console.error('Error:', error)
    })

    stream.on('end', () => {
      console.log('Stream completed')
    })

    return () => {
      stream.cancel()
    }
  }, [])

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

export default PointCloudComponent

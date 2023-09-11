import React, { useState, useEffect } from 'react'
import {
  PointCloudRequest,
  PointCloudResponse,
  Point
} from '@/grpc-api/point_cloud_pb.js'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { grpc } from 'grpc-web'
import GrpcStream from '@/components/streaming/GrpcStream'
import { Button, Input, Typography } from 'antd'
import StreamingViewer from './streamingViewer'
import { useReactive } from 'ahooks'

const PointCloud = (props) => {
  const [points, setPoints] = useState([])


  const handler = (response) => {
    const point = {
      x: response.getX(),
      y: response.getY(),
      z: response.getZ(),
    }
    setPoints((v) => [...v, point])
  }

  const onLoadPointCloud = () => {
    const request = new PointCloudRequest()
    request.setFilename('wolf.pcd')

    const stream = new GrpcStream('http://10.10.98.56:5000')

    stream.getStreamPointCloud(request, handler)
  }
//  const onLoadPointCloud = ()=>{
//      const request = new PointCloudRequest()
//    request.setFilename('wolf.pcd')
//
//    const client = new PointCloudStreamServiceClient(
//      'http://10.10.98.56:5000',
//      null,
//      null
//    )
//    const stream = client.getStreamPointCloud(request, {})
//    console.log(stream, 'stream')
//    stream.on('data', (response) => {
//      console.log(response, 'response')
//      const point = {
//        x: response.getX(),
//        y: response.getY(),
//        z: response.getZ(),
//      }
//      console.log(point,'point')
//      setPoints((prevPoints) => {
//        return [...prevPoints, point]
//      })
//    })
//
//    stream.on('error', (error) => {
//      console.error('Error:', error)
//    })
//
//    stream.on('end', () => {
//      console.log('Stream completed')
//    })
//  }

  return (
    <div>
      <Button type="primary" onClick={onLoadPointCloud}>
        Click Me!
      </Button>
      <StreamingViewer points={points}></StreamingViewer>
    </div>
  )
}

export default React.memo(PointCloud)

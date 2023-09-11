import React, { useEffect, useState,useCallback } from 'react'
import {
  PointCloudRequest,
  PointCloudResponse,
} from '@/grpc-api/point_cloud_pb.js'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { grpc } from 'grpc-web'
import GrpcStream from '@/components/streaming/GrpcStream'
import { Button, Input, Typography } from 'antd'
import StreamingViewer from './streamingViewer'

const PointCloud = (props) => {
  const [points, setPoints] = useState([])
  console.log('shuaxin')

  const handler =useCallback((response) => {
    console.log(response, 'response2222')
    const point = {
      x: response.getX(),
      y: response.getY(),
      z: response.getZ(),
    }
    setPoints((prevPoints) => [...prevPoints, point])
  },[setPoints])

  const onLoadPointCloud =useCallback(()=>{
    const request = new PointCloudRequest()
    request.setFilename('wolf.pcd')

    const stream = new GrpcStream('http://10.10.98.56:5000')

    stream.getStreamPointCloud(request, handler)
  },[handler])

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


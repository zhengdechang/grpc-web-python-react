/*
 * @Description:
 * @Author: Devin
 * @Date: 2023-09-14 03:17:53
 */
import React, { useState, useEffect } from 'react'
import { PointCloudRequest } from '@/grpc-api/point_cloud_pb.js'
import { grpc } from 'grpc-web'
import GrpcStream from '@/utils/GrpcStream'
import { Button, Input, Typography } from 'antd'
import StreamingViewer from './streamingViewer'
import getGrpcUrl from '@/utils/get-grpc-url.js'

const PointCloud = (props) => {
  const [points, setPoints] = useState([])

  const handler = (pointList) => {
    setPoints((prevPoints) => [...prevPoints, ...pointList])
  }

  const onLoadPointCloud = () => {
    const request = new PointCloudRequest()
    request.setFilename('wolf.pcd')
    const stream = new GrpcStream(getGrpcUrl())
    stream.getStreamPointCloud(request, handler)
  }
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

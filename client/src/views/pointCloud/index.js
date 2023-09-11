import React, { useState, useEffect } from 'react'
import {
  PointCloudRequest,
  PointCloudResponse,
  Point,
} from '@/grpc-api/point_cloud_pb.js'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { grpc } from 'grpc-web'
import GrpcStream from '@/components/streaming/GrpcStream'
import { Button, Input, Typography } from 'antd'
import StreamingViewer from './streamingViewer'
import { useReactive } from 'ahooks'

const PointCloud = (props) => {
  const [points, setPoints] = useState([])

  const onLoadPointCloud = () => {
    let buffer = []
    const request = new PointCloudRequest()
    request.setFilename('wolf.pcd')

    const stream = new GrpcStream('http://10.10.98.56:5000')
    const handler = (response) => {
      const point = {
        x: response.getX(),
        y: response.getY(),
        z: response.getZ(),
      }
      buffer.push(point)
      if (buffer.length >= 100) {
        // 你可以根据实际情况调整这个值
        setPoints((prevPoints) => [...prevPoints, ...buffer])
        buffer = []
      }
    }
    stream.getStreamPointCloud(request, handler)
  }
  //  const onLoadPointCloud = () => {
  //    const request = new PointCloudRequest()
  //    request.setFilename('wolf.pcd')
  //
  //    const client = new PointCloudStreamServiceClient(
  //      'http://10.10.98.56:5000',
  //      null,
  //      null
  //    )
  //
  //    const stream = client.getStreamPointCloud(request, {})
  //    console.log(stream, 'stream')
  //
  //    let buffer = []
  //
  //    stream.on('data', (response) => {
  //      console.log(response, 'response')
  //      const point = {
  //        x: response.getX(),
  //        y: response.getY(),
  //        z: response.getZ(),
  //      }
  //      buffer.push(point)
  //
  //      // 如果缓冲区达到一定数量，更新状态并清空缓冲区
  //      if (buffer.length >= 100) {
  //        // 你可以根据实际情况调整这个值
  //        setPoints((prevPoints) => [...prevPoints, ...buffer])
  //        buffer = []
  //      }
  //    })
  //
  //    stream.on('error', (error) => {
  //      console.error('Error:', error)
  //    })
  //
  //    stream.on('end', () => {
  //      console.log('Stream completed')
  //      // 数据流结束时，更新状态并清空缓冲区
  //      setPoints((prevPoints) => [...prevPoints, ...buffer])
  //      buffer = []
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

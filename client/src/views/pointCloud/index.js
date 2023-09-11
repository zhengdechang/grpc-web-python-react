import React, { useEffect, useState } from 'react'
import {
  PointCloudRequest,
  PointCloudResponse,
} from '@/grpc-api/point_cloud_pb.js'
import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'
import { grpc } from 'grpc-web'
import GrpcStream from '@/components/streaming/GrpcStream'

const PointCloud = () => {
  const [points, setPoints] = useState([])

  //  useEffect(() => {
  //    const request = new PointCloudRequest();
  //    request.setFilename('wolf.pcd');
  //
  //    const client = new PointCloudStreamServiceClient('http://10.10.98.56:5000', null, null);
  //    const stream = client.getStreamPointCloud(request, {});
  //    console.log(stream,'stream')
  ////    stream.on('data', (response) => {
  ////      console.log(response.toObject(),'response');
  ////      const point = {
  ////        x: response.getX(),
  ////        y: response.getY(),
  ////        z: response.getZ(),
  ////      };
  ////      setPoints((prevPoints) => [...prevPoints, point]);
  ////    });
  //  stream.on('data', function(response) {
  //      console.log("Response message:",response);
  //    });
  //
  ////   stream.on('error', (error) => {
  ////        console.error('Error:', error);
  ////        console.error('Error details:', error.details);
  ////        console.error('Error code:', error.code);
  ////    });
  //stream.on('status', function(status) {
  //    console.log("Status code:",status.code);
  //    console.log("Status details:",status.details);
  //    console.log("Status metadata:",status.metadata);
  //  });
  //
  //    stream.on('end', () => {
  //      console.log('Stream completed');
  //    });
  //
  //    return () => {
  //      stream.cancel();
  //    };
  //  }, []);
  useEffect(() => {
    const request = new PointCloudRequest()
    request.setFilename('wolf.pcd')

    const stream = new GrpcStream('http://10.10.98.56:5000')

    const handler = (response) => {
      const point = {
        x: response.getX(),
        y: response.getY(),
        z: response.getZ(),
      }
      console.log(point, 'response')
      setPoints((prevPoints) => [...prevPoints, point])
    }

    stream.getStreamPointCloud(request, handler)
  })
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

export default PointCloud

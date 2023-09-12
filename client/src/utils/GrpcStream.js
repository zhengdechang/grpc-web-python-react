import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'

class GrpcStream {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.buffer = []
  }

  getStreamPointCloud(request, handler) {
    const client = new PointCloudStreamServiceClient(this.endpoint, null, null)

    const stream = client.getStreamPointCloud(request, {})

    stream.on('data', (response) => {
      const point = {
        x: response.getX(),
        y: response.getY(),
        z: response.getZ(),
      }
      this.buffer.push(point)

      // 如果缓冲区达到一定数量，更新状态并清空缓冲区
      if (this.buffer.length >= 100) {
        // 你可以根据实际情况调整这个值
        handler(this.buffer)
        this.buffer = []
      }
    })

    stream.on('error', (error) => {
      console.error('Error:', error)
    })

    stream.on('end', () => {
      console.log('Stream completed')
      // 数据流结束时，更新状态并清空缓冲区
      handler(this.buffer)
      this.buffer = []
    })
  }
}

export default GrpcStream

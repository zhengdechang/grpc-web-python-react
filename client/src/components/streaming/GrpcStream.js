import {
  PointCloudRequest,
  PointCloudResponse,
} from '@/grpc-api/point_cloud_pb.js'
import encodeRequest from './encodeRequest'
import iterateReader from './iterateReader'
import iterateResponses from './iterateResponses'

class GrpcStream {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  async getStreamPointCloud(request, handler) {
    const method = 'POST'
    const headers = { 'content-type': 'application/grpc-web+proto' }
    const message = request.serializeBinary()
    const body = encodeRequest(message)

    const response = await fetch(
      `${this.endpoint}/pointcloud.PointCloudStreamService/GetStreamPointCloud`,
      {
        method,
        headers,
        body,
      }
    )

    const reader = await response.body?.getReader()
    if (!reader) throw new Error('Reader is missing')

    for await (const chunk of iterateReader(reader)) {
      console.log('Next Stream Chunk', chunk)

      try {
        for (const decoded of iterateResponses(chunk)) {
          const response = PointCloudResponse.deserializeBinary(decoded)
          console.log(response, 'response')
          handler(response)
        }
      } catch (e) {
        console.log(e, 'e1')
      }
    }

    console.log('Stream finished.')
  }
}

export default GrpcStream

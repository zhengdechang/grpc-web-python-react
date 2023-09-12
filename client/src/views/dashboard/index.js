import React, { useState } from 'react'
import { Button, Input, Typography } from 'antd'
import { HelloReq } from '@/grpc-api/simple_grpc_pb.js'
import { SimpleGrpcClient } from '@/grpc-api/simple_grpc_grpc_web_pb.js'

const { Text } = Typography

const IndexPage = () => {
  const [username, setUsername] = useState('')
  const [grpcResponse, setGrpcResponse] = useState('')

  const client = new SimpleGrpcClient('http://localhost:5000', null, null)

  const onSubmit = () => {
    let req = new HelloReq()
    req.setName(username)

    client.sayHello(req, {}, (err, res) => {
      if (err) {
        console.log(err)
        setGrpcResponse(JSON.stringify(err))
        return
      }
      setGrpcResponse(JSON.stringify(res.toObject()))
    })
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Input
        placeholder="Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="primary" onClick={onSubmit}>
        Click Me!
      </Button>
      <Text
        type="secondary"
        style={{ maxWidth: '400px', wordWrap: 'break-word' }}
      >
        {grpcResponse}
      </Text>
    </div>
  )
}

export default IndexPage

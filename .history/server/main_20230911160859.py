'''
Description: 
Author: Devin
Date: 2023-09-11 16:08:57
'''
import grpc
import time
from concurrent import futures
import proto.simple_grpc_pb2 as simple_grpc_pb2
import proto.simple_grpc_pb2_grpc as simple_grpc_pb2_grpc

class SimpleGrpcServer(simple_grpc_pb2_grpc.SimpleGrpcServicer):
  def SayHello(self, request, context):
    return simple_grpc_pb2.HelloRes(message=f"Hello {request.name}! Hope you're doing well!")

  def SayHelloToMany(self, request_iterator, context):
    server_res = simple_grpc_pb2.HelloRes()
    server_res.message = "Welcome "
    total_num = 0
    for client_req in request_iterator:
      # print(client_req)
      server_res.message += f"{client_req.name}, "
      total_num += 1
    server_res.message += f"thanks for coming today!\nTotal {total_num} members are coming!"
    return server_res

  def CheckInbox(self, request, context):
    name = request.name
    inbox = [
      name,
      "Promotion from LinePay!!",
      "EAGLYS Slack Updates...",
      "A mail from hacker..."
    ]
    # Check the mails from the inbox of the user
    # Assuming there's 3 mails in the inbox
    for i, content in enumerate(inbox):
      if i == 0:
        yield simple_grpc_pb2.HelloRes(message=f"Checking your inbox... please be patient {content}")
        time.sleep(1)
        continue
      yield simple_grpc_pb2.HelloRes(message=f"{i}. {content}")
      time.sleep(1)


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  simple_grpc_pb2_grpc.add_SimpleGrpcServicer_to_server(SimpleGrpcServer(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  server.wait_for_termination()

if __name__ == '__main__':
    serve()
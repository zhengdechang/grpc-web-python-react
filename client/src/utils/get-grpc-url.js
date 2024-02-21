/*
 * @Description:
 * @Author: Devin
 * @Date: 2023-09-18 12:53:59
 */
const getGrpcUrl = () => {
  return process.env.REACT_APP_GRPC_URL || 'http://127.0.0.1:5000'
}

export default getGrpcUrl

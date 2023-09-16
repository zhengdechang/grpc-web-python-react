const getGrpcUrl = () => {
    return process.env.REACT_APP_GRPC_URL || 'http://127.0.0.1:5000'
}


export default getGrpcUrl
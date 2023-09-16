const getGrpcUrl = () => {
    return process.env.REACT_APP_GRPC_URL || 'https://178.157.58.227:5000'
}


export default getGrpcUrl
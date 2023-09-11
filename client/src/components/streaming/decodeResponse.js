const decodeResponse = (serialized) => {
  if (serialized.length === 0) return [null, serialized]

  const dataView = new DataView(serialized.buffer)
  if (dataView.getUint8(0) !== 0) return [null, serialized]

  const len = dataView.getUint32(1, false)

  return [serialized.slice(5, 5 + len), serialized.slice(5 + len)]
}

export default decodeResponse

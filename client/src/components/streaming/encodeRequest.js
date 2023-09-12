const encodeRequest = function (serialized) {
  const { length } = serialized
  const payload = new Uint8Array(5 + length)
  const dataView = new DataView(payload.buffer)
  dataView.setUint32(1, length, false)
  payload.set(serialized, 5)

  return payload
}

export default encodeRequest

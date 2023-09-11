async function* iterateReader(reader) {
  const { done, value } = await reader.read()
  if (done) return

  yield value
  yield* iterateReader(reader)
}

export default iterateReader

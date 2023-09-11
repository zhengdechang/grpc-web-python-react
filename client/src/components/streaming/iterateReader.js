async function* iterateReader(reader) {
  try {
    const { done, value } = await reader.read()
    if (done) return

    yield value
    yield* iterateReader(reader)
  } catch (e) {
    console.log(e, 'e')
  }
}

export default iterateReader

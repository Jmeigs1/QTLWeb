// https://jestjs.io/docs/en/configuration.html#snapshotresolver-string

const r = {
  testPathForConsistencyCheck: 'Client/UI/Button.test.js',

  resolveSnapshotPath: (testPath, snapshotExtension) => {
    let dir = testPath.replace('Client', 'Client/__snapshots__').replace('.test.js', `.js${snapshotExtension}`)
    // console.log(`resolveSnapshotPath: '${testPath}' => '${dir}'`)
    return dir
  },

  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    let dir = snapshotFilePath.replace('Client/__snapshots__', 'Client').replace(`.js${snapshotExtension}`, '.test.js')
    // console.log(`resolveTestPath: '${snapshotFilePath}' => '${dir}'`)
    return dir
  }
}

// let path = r.resolveSnapshotPath(r.testPathForConsistencyCheck, '.snap')
// r.resolveTestPath(path, '.snap')

module.exports = r
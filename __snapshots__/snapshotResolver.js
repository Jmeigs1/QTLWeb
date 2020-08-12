// https://jestjs.io/docs/en/configuration.html#snapshotresolver-string

const r = {
  testPathForConsistencyCheck: 'Client/UI/Button.test.js',

  resolveSnapshotPath: (testPath, snapshotExtension) => {

    let dir = testPath
    // NOTE: this depends on root being called QTLWeb
    if (dir.includes('QTLWeb')) dir = dir.replace('QTLWeb', 'QTLWeb/__snapshots__')
    else dir = '__snapshots__/' + dir

    dir = dir.replace('.test.js', `.js${snapshotExtension}`)
    return dir
  },

  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    let dir = snapshotFilePath.replace('__snapshots__/', '').replace(`.js${snapshotExtension}`, '.test.js')
    return dir
  }
}

// let path = r.resolveSnapshotPath(r.testPathForConsistencyCheck, '.snap')
// r.resolveTestPath(path, '.snap')

module.exports = r
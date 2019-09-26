// jest configuration: https://jestjs.io/docs/en/configuration

module.exports = {
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': './__mocks__/styleMock.js'
  },
  snapshotResolver: './__snapshots__/snapshotResolver.js'
}
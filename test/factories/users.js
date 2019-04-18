exports.fakeUser = (username) => ({
  username,
  passwordHash: username,
  role: 'admin'
})
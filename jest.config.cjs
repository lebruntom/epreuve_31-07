module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/test/**/*.test.js"], // Ajoutez cette ligne pour spécifier les tests dans le dossier "test"
};

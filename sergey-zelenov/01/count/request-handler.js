let i = 0;

const requestHandler = (req, res) => {
  i++;
  res.end(i.toString()); // (!!! toString)
}

module.exports = requestHandler;

/*

  node debug

  node-inspector

  webstorm

  // ----

*/

export const get = (req: any, res: any) => {
  const helpTextId = req.params.id;
  console.log(`Help text id ${helpTextId}`);

  var fs = require('fs');
  require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };
  let encodedString;

  switch (helpTextId) {
    case '1':
      const path = require('path');
      encodedString = require(path.resolve(
        __dirname,
        './questionnaires/images/scott-malkinson.txt'
      ));
      res.send(encodedString);
      break;

    default:
      res.status(404).end();
  }
};

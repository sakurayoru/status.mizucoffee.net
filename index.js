'use strict'

const express = require('express')
const exec = require('child_process').spawnSync;
const app = express()
const server = app.listen(process.env.PORT, () => console.log("Node.js is listening to PORT:" + server.address().port))

app.disable('x-powered-by')
app.use(express.static('./public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  let neofetch = exec('neofetch', ['--stdout']).stdout.toString().replace(/\n/g,'<br>')
  let nodejs = exec('node', ['-v']).stdout.toString()
  let java = exec('java', ['-version']).stderr.toString().split('\n')[0]

  res.render('index',
    {
      neofetch: neofetch,
      versions: {
        nodejs: nodejs,
        java: java
      }
    });
});

// nodeバージョン
// neofetch
// java

'use strict'

const express = require('express')
const fs = require('fs-extra')
const CronJob = require('cron').CronJob
const request = require('sync-request')
const exec = require('child_process').spawnSync;
const app = express()
const server = app.listen(process.env.PORT, () => console.log("Node.js is listening to PORT:" + server.address().port))

const ping = new CronJob({
  cronTime: "0 * * * *",
  onTick: () => {
    let start_ms = new Date().getTime()
    request('GET', 'https://twiback.mizucoffee.net/');
    let elapsed_ms = new Date().getTime() - start_ms;
    let ping = fs.readJsonSync('/data/status/ping.json')
    ping.pop()
    ping.unshift(elapsed_ms)
    fs.writeJsonSync('/data/status/ping.json', ping)
  },
  start: false,
  timeZone: "Asia/Tokyo"
})

ping.start()

app.disable('x-powered-by')
app.use(express.static('./public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  let ping = fs.readJsonSync('./ping.json')
  let neofetch = exec('neofetch', ['--stdout']).stdout.toString().replace(/\n/g,'<br>')
  let nodejs = exec('node', ['-v']).stdout.toString()
  //  let java = exec('java', ['-version']).stderr.toString().split('\n')[0]

  res.render('index',
    {
      neofetch: neofetch,
      data: ping,
      versions: {
        nodejs: nodejs
    //    java: java
      }
    });
});

// nodeバージョン
// neofetch
// java

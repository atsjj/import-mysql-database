var c       = require('clor');
var command = require('commander');
var exec    = require('child_process').exec;
var package = require('./package.json');

var UI      = require('./lib/ui');

var ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout,
  writeLevel: 'INFO',
  ci: false
});

command
  .version(package['version'])
  .description(package['description'])
  .usage('[options] <file.gz>')
  .option('-h, --host <host>', 'MySQL Host')
  .option('-u, --user <user>', 'MySQL Database User')
  .option('-p, --pass <pass>', 'MySQL Database Password')
  .option('-d, --db <database>', 'MySQL Database')
  .action(ImportDatabase)
  .parse(process.argv);

function ImportDatabase(file, options) {
  ui.writeLine('import-mysql-database:', c.yellow(file));

  var mysql = exec(`gunzip < ${file} | mysql -h ${options.host} -u ${options.user} -p${options.pass} ${options.db}`)
  mysql.on('data', function(data) {
    ui.writeLine(c.green('importing:', data));
  });
  mysql.on('close', function() {
    ui.writeLine(c.green('finished!'));
  });
}

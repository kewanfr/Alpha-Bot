const chalk = require('chalk');
const dayjs = require('dayjs');
var fs = require('fs');
var util = require('util');
let logsFolder = `${process.cwd()}/logs`;

if(!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
let formatLogs = "YYYY-MM-DD_HH_mm";
mode = "dev"
if(mode == "dev") formatLogs = "YYYY-MM-DD_HH";
let name = `${dayjs().format(formatLogs)}.txt`;
var log_file = fs.createWriteStream(`${logsFolder}/${name}`, { flags: 'w' });

const format = `{tstamp} {tag} {txt}\n`;

const write = (content, tagColor, bgTagColor, tag, error = false) => {
  const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
  const logTag = `[${tag}]`;
  const stream = error ? process.stderr : process.stdout;

  if(Array.isArray(content)) {
    let msg = "";
    content.forEach(c => {
      if(typeof c === 'object') c = JSON.stringify(c, false, 2);
      msg += c + " ";
    });
    content = msg;
  }
  
  if(typeof content === 'object') content = JSON.stringify(content, false, 2);
  let logContent = `${timestamp} ${logTag} ${util.format(content)}`;
  log_file.write(logContent + '\n');
  const item = format
    .replace('{tstamp}', chalk.gray(timestamp))
    .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
    .replace('{txt}', chalk.white(content));

  stream.write(item);
}

const log = (...content) => { write(content, 'black', 'bgBlue', "LOG", false); }
const error = (...content) => { write("", 'black', 'bgRed', 'ERROR', true); console._error(content);}
const warn = (...content) => { write(content, 'black', 'bgYellow', 'WARN', false); }
const info = (content, tag = "INFO") => { write(content, 'black', 'bgBlue', tag, false); }
const debug = (...content) => { write(content, 'black', 'bgYellow', 'DEBUG', false); }

const ready = (...content) => { write(content, 'black', 'bgGreen', 'READY', false); }
const command = (...content) => { write(content, 'magenta', 'bgBlack', 'CMD', false); }
const event = (...content) => { write(content, 'cyan', 'bgBlack', 'EVT', false); }
const component = (content, tag = "COMPONENT") => { write(content, 'blue', 'bgBlack', tag, false); }
const exec = (content, type = "CMD") => { write(content, 'white', 'bgMagenta', type, false); }
const system = (...content) => { write(content, 'white', 'bgBlue', 'SYSTEM', false); }

var _log = console.log;
var _error = console.error;
var _warn = console.warn;
var _info = console.info;
var _debug = console.debug;

console._log = _log;
console._error = _error;
console._warn = _warn;
console._info = _info;
console._debug = _debug;

console.log = log;
console.error = error;
console.warn = warn;
console.info = info;
console.debug = debug;
console.ready = ready;


module.exports = {
  log,
  error,
  warn,
  info,
  debug,
  ready,
  command,
  event,
  component,
  exec,
  system
}
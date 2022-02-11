export function getLogger() {
  var log = require("loglevel").getLogger("cerberus")
  if (process.env.NODE_ENV === 'development') log.setLevel('debug')
  else log.setLevel('silent')
  return log
}
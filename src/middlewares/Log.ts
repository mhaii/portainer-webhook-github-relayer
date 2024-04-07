class Log {
  public debug(_string: string): void {
    if (process.env.DEBUG) {
      console.debug('DEBUG', _string)
    }
  }

  public info(_string: string): void {
    console.info('INFO', _string)
  }

  public warn(_string: string): void {
    console.warn('WARN', _string)
  }

  public error(_string: string): void {
    // Line break and show the first line
    console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0])
  }
}

export default new Log

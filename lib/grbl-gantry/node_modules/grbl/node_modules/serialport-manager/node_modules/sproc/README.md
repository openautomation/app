# sproc

This module is useful when you want to spawn a single daemon and be able to connect to it from other processes.

workflow:

* attempt to connect to daemon
 * if connection fails, spawn daemon (return to first step)
* upon connection, callback with a stream

## Install

`npm install sproc`

## Use

### daemon.js

```javascript

// echo daemon

var clients = 0;

module.exports = function(options, stream) {
  clients++;

  stream.write(clients + ' clients');
  stream.on('end', function() {
    clients--;
    if (clients > 0) {
      stream.write(clients + ' clients');
    } else {
      process.exit();
    }
  });

  stream.pipe(stream, { end: false });
};

```

### main.js

```javascript

var sproc = require('sproc');

sproc({
  script: './daemon',
  port: 4499,
}, function(proc) {
  proc.stream.write('hello');
  stream.on('data', console.log); // outputs hello
});

```

### options

 * `port` - port to use for listening/connecting (default: _4499_)
 * `keepProcessReference` - do not detatch from the daemon (default: _false_)
 * `log` - a function (optional)

## License

MIT
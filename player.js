var exec = require('child_process').exec;
const mpccmd = 'mpc ';

class Player {
  constructor(log) {
    this.log = log;
    // Don't need this
    //this.minReconnectAfter = Math.max(0, reconnectAfter - 300000);
    //this.maxReconnectAfter = Math.max(600000, reconnectAfter + 300000);
    this.isPlaying = false;
  }

  play(streamURL, streamvol) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      //function getRandomInteger(min, max) {
      //  return Math.floor(Math.random() * (max - min + 1)) + min;
      //}
      const startStream = function() {
        this.log('Connecting to ', streamURL);
        // Is this where we just clear the url, set volume, set new url, and start playing
        // We just remove any timeouts
        // And then we make sure we log any errors
        var cmdclr = mpccmd + 'clear';
        exec(cmdclr, function (error, stdout, stderr) {
            if(error) {
                this.log('Clear error: ', stderr)
            };
            //callback(stdout)
        });

        var cmdadd = mpccmd + 'add ' + streamURL;
        exec(cmdadd, function (error, stdout, stderr) {
            if(error) {
                this.log('Add error: ', stderr)
            };
            //callback(stdout)
        });

        var cmdvol = mpccmd + 'volume ' + streamvol;
        exec(cmdvol, function (error, stdout, stderr) {
            if(error) {
                this.log('Volume error: ', stderr)
            };
            //callback(stdout)
        });

        var cmdply = mpccmd + 'play';
        exec(cmdply, function (error, stdout, stderr) {
            if(error) {
                this.log('Play error: ', stderr)
            };
            //callback(stdout)
        });

        //this.stream = request(streamURL);
        //this.stream
        //  .pipe(new lame.Decoder())
        //  .pipe(new Speaker());
        //setTimeout(() => {
        //  if (this.isPlaying) {
        //    this.stream.abort();
        //    startStream();
        //  }
        //}, getRandomInteger(this.minReconnectAfter, this.maxReconnectAfter));
      }.bind(this)
      startStream();
    }
  }

  stop() {
    if (this.isPlaying) {
        var cmdstp = mpccmd + 'stop';
        exec(cmdstp, function (error, stdout, stderr) {
            if(error) {
                this.log('Play error: ', stderr)
            };
            //callback(stdout)
        });
        this.isPlaying = false;
    }
  }

}

module.exports = Player;

var exec = require('child_process').exec;
const mpccmd = 'mpc ';

class Player {
  constructor(log) {
    this.log = log;
    this.volume = 50;  // Initial volume setting
    this.isPlaying = false;
  }

  play(streamURL, streamvol) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      const startStream = function() {
        this.log('Connecting to ' + streamURL);
        // Start by clearing the mpc player
        var cmdclr = mpccmd + 'clear';
        exec(cmdclr, function (error, stdout, stderr) {
            if(error) {
                console.log('Clear error: '+ error);
            };
            //callback(stdout)
        });
        // Setup the stream URL with mpc
        var cmdadd = mpccmd + 'add ' + streamURL;
        exec(cmdadd, function (error, stdout, stderr) {
            if(error) {
                console.log('Add error: '+ error);
            };
            //callback(stdout)
        });
        // Set the volume
        var cmdvol = mpccmd + 'volume ' + streamvol;
        this.volume = streamvol;
        exec(cmdvol, function (error, stdout, stderr) {
           if(error) {
                console.log('Volume error: '+ error);
            };
            //callback(stdout)
        });
        // Start the play
        var cmdply = mpccmd + 'play';
        exec(cmdply, function (error, stdout, stderr) {
            if(error) {
                console.log('Play error: '+ error);
            };
            //callback(stdout)
        });
      }.bind(this)
      startStream();
    }
  }

  stop() {
    if (this.isPlaying) {
        var cmdstp = mpccmd + 'stop';
        exec(cmdstp, function (error, stdout, stderr) {
            if(error) {
                console.log('Play error: '+ error);
            };
            //callback(stdout)
        });
        this.isPlaying = false;
    }
  }

  setVolume(streamVol) {
    this.volume = streamVol;
    var cmdvol = mpccmd + 'volume ' + streamVol;
    exec(cmdvol, function (error, stdout, stderr) {
        if(error) {
            console.log('Volume error: '+ error);
        };
            //callback(stdout)
    });
  }
}

module.exports = Player;

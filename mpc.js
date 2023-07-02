var exec = require('child_process').exec;

module.exports = MpcClient;

function MpcClient(streamurl) {
    this.streamurl = streamurl;
    //this.host = host;
    //this.port = port;
}

MpcClient.prototype.getCmd = function () {
    return "mpc add ";
//    return "mpc -h " + this.host + " -p " + this.port + " ";
};


// Get the status of mpc but it just passes the information outputs
// Will need to change this to match output of streaming
MpcClient.prototype.getOutputs = function (callback) {
    var cmd = this.getCmd() + 'outputs';

    exec(cmd, function (error, stdout, stderr) {

        var outputs = {};
        var regex = /Output.([0-9]*).\((.*)\).is.(enabled|disabled)/;
        var lines = stdout.split('\n');

        for (var i = 0; i < lines.length; i++) {

            var result = lines[i].match(regex);

            if (result != null) {
                outputs[result[1]] = {
                    id: +result[1],
                    name: result[2],
                    on: (result[3] === "enabled")
                };
            }
        }
        callback(outputs)
    });
};

// Set audiostream url and clear out old one
MpcClient.prototype.seturl = function(newurl, callback) {
    var cmdclr = this.getCmd() + 'clear';
    var cmdurl = this.getCmd() + 'add ' + newurl;

    exec(cmdclr, function (error, stdout, stderr) {
        exec(cmdurl, function (error, stdout, stderr) {
            callback(stdout)
        });
    });
};

// Start playing loaded audiostream
MpcClient.prototype.play = function (callback) {
//    var cmdload = this.getCmd() + 'load ' + file;
    var cmdplay = this.getCmd() + 'play';

    exec(cmdplay, function (error, stdout, stderr) {
       // exec(cmdplay, function (error, stdout, stderr) {
        callback(stdout)
        //});
    });
};

// Stop streaming
MpcClient.prototype.stop = function (callback) {
    var cmd = this.getCmd() + 'stop';

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};

// I don't think we need this
/*
MpcClient.prototype.setOutput = function (number, state, callback) {
    var tmp = (state == true) ? "enable" : "disable";
    var cmd = this.getCmd() + tmp + ' ' + number;

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};
*/

// Gives the status, like volumne (do we need this?)
/*
MpcClient.prototype.getStatus = function (callback) {
    var cmd = this.getCmd() + 'status';

    exec(cmd, function (error, stdout, stderr) {

        var status = {
            volume: 0,
            playing: false
        };

        var regex = /volume:\s*(\d*)\%/;
        var result = stdout.match(regex);
        if (result === null) {
            status.volume = 0;
        } else {
            status.volume = Number(result[1]);
        }

        regex = /\[(playing)\]/;
        result = stdout.match(regex);
        status.playing = (result != null);

        callback(status)
    });
};
*/
// We want this, can use this to set the volume when we need it
MpcClient.prototype.setVolume = function (value, callback) {

    var cmd = this.getCmd() + "volume" + ' ' + value;

    exec(cmd, function (error, stdout, stderr) {
        callback(stdout)
    });
};

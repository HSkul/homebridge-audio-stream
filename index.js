//const Player = require('./player');
var FFplay = require("ffplay");

let Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  //homebridge.registerAccessory('homebridge-radio-player-plus', 'RadioPlayerPlus', RadioPlayerPlusPlugin);
  homebridge.registerAccessory('homebridge-audio-stream', 'AudioStream', AudioStreamPlugin);
}

//class RadioPlayerPlusPlugin {
class AudioStreamPlugin {

  constructor(log, config) {
    this.log = log;
    this.activeStation = -1;
    // stations here is a array of station information
    this.stations = config.stations;
    this.delay = Number(config.delay) || 100;
    this.reconnectAfter = Number(config.reconnectAfter) || 45;
    // We can't create this player here, we create it when we play
    //this.player = new Player(this.log, this.reconnectAfter * 60000);

    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(
        Characteristic.Manufacturer,
        'Hskul'
      )
      .setCharacteristic(
        Characteristic.Model,
        'v1.0.0'
      )
      .setCharacteristic(
        Characteristic.SerialNumber,
        'AudioStreamer_1.0.0'
      );

    this.switchService = new Service.Switch('Next Audio Stream', 'next-audio-stream');
    this.switchService
      .getCharacteristic(Characteristic.On)
      .on(
        'set',
        this.nextStation.bind(this)
      )
      .on(
        'get',
        this.showAlwaysOff.bind(this)
      );

    this.services = [this.informationService, this.switchService];
    this.stationServices = [];
    // Loop for each of the stations in the array
    for (var n in this.stations) {
      const station = this.stations[n];
      const stationService = new Service.Switch(station.name, 'audio-stream-' + n);
      stationService
        .getCharacteristic(Characteristic.On)
        .on(
          'set',
          this.controlStation.bind(this, Number(n))
        )
        .on(
          'get',
          this.isPlaying.bind(this, Number(n))
        );
      this.services.push(stationService);
      this.stationServices.push(stationService);
    }

  }

  getServices() {
    return this.services;
  }


  // This should where we start the streaming
  play() {
    if (this.activeStation != -1) {
      const station = this.stations[this.activeStation];
      this.log.info('Starting web radio "' + station.name + '" (' + station.streamUrl + ')');
      //this.player.play(station.streamUrl);
      var fplayer = new FFplay(station.streamUrl); // Starts ffplay playing the identified stream
      // It runs `ffplay` with the options `-nodisp` and `-autoexit` by default
      this.stationServices[this.activeStation].getCharacteristic(Characteristic.On).updateValue(true);
    }
  }


  // stop the streaming
  stop() {
    if (this.activeStation != -1) {
      const station = this.stations[this.activeStation];
      this.log.info('Stopping web radio "' + station.name + '" (' + station.streamUrl + ')');
    }
    //this.player.stop();
    fplayer.stop(); // Stops playback.  What is the proper callback?
    for (var n in this.stations) {
      this.stationServices[n].getCharacteristic(Characteristic.On).updateValue(false);
    }
  }

  next() {
    this.setActiveStation(Number(this.activeStation) + 1);
  }

  setActiveStation(n) {
    this.activeStation = Number(n);
    if (this.activeStation == this.stations.length) {
      this.activeStation = Number(-1);
    }
  }

  nextStation(on, callback) {
    if (on) {
      this.stop();
      this.next();
      this.play();
      setTimeout(function() {
        this.switchService.getCharacteristic(Characteristic.On).updateValue(false)
        this.log.debug('Set state of switch to off')
      }.bind(this), this.delay)
    }
    return callback();
  }

  showAlwaysOff(callback) {
    callback(null, false);
  }

  controlStation(n, on, callback) {
    if (on) {
      this.stop();
      this.setActiveStation(n);
      this.play();
    } else {
      this.stop();
      this.setActiveStation(-1);
    }
    return callback();
  }

  isPlaying(n, callback) {
    if (this.activeStation == -1) {
      return callback(null, false);
    } else if (this.activeStation == n) {
      return callback(null, this.player.isPlaying);
    } else {
      return callback(null, false);
    }
  }

}

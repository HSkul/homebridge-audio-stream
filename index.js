const Player = require('./player');

let Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-audio-stream', 'AudioStream', AudioStreamPlugin);
}

class AudioStreamPlugin {

  constructor(log, config) {
    this.log = log;
    this.activeStation = -1;
    // stations here is a array of station information
    this.stations = config.stations;
    this.player = new Player(this.log);
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

    this.switchService = new Service.Switch('Next', 'next-audio-stream');
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


  // Play the station
  play() {
    if (this.activeStation != -1) {
      const station = this.stations[this.activeStation];
      this.log.info('Starting web radio "' + station.name + '" (' + station.streamUrl + ')');
      this.log.info('with volume ' + station.volume);
      this.player.play(station.streamUrl, station.volume);
      this.stationServices[this.activeStation].getCharacteristic(Characteristic.On).updateValue(true);
    }
  }


  // stop the streaming
  stop() {
    if (this.activeStation != -1) {
      const station = this.stations[this.activeStation];
      this.log.info('Stopping web radio "' + station.name + '" (' + station.streamUrl + ')');
    }
    this.player.stop();
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

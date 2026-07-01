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
    this.activeStation = -2;    // -2 means no station is playing
    this.stations = config.stations;
    this.player = new Player(this.log);
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer,'Hskul')
      .setCharacteristic(Characteristic.Model,'v1.2.0')
      .setCharacteristic(Characteristic.SerialNumber,'AudioStream_1.2.0');
    this.services = [this.informationService]

    // Next station button
    this.switchService = new Service.Switch('Next', 'next-audio-stream');
    this.switchService
      .getCharacteristic(Characteristic.On)
      .onSet(this.nextStation.bind(this, Number(1)))
      .onGet(this.showAlwaysOff.bind(this));
    this.services.push(this.switchService);

    // Previous station button
    this.switchService = new Service.Switch('Previous', 'previous-audio-stream');
    this.switchService
      .getCharacteristic(Characteristic.On)
      .onSet(this.nextStation.bind(this, Number(-1)))
      .onGet(this.showAlwaysOff.bind(this));
    this.services.push(this.switchService);

    // Setup speakers
    this.stationServices = [];                               // array of station services/speaker buttons
    // Loop for each of the stations in the array from config
    for (var n in this.stations) {
      const station = this.stations[n];
      this.stationService = new Service.Speaker(station.name, 'audio-stream-' + n);
      this.stationService
        .getCharacteristic(Characteristic.Mute)
        .onSet(this.controlStation.bind(this, Number(n))) // start/stop the player
        .onGet(this.isPlaying.bind(this, Number(n)));     // check to see if player is playing
      this.stationService
        .getCharacteristic(Characteristic.Volume)
//        .onGet(this.getVolume.bind(this, Number(n)))   // volume of mpc is never set independently, just here for ref>
        .onSet(this.setVolume.bind(this, Number(n)));
      this.stationService                                         // Set the initial value of the station from the config
        .getCharacteristic(Characteristic.Volume)
        .updateValue(Number(station.volume));

      this.log.debug('Initilized volume is: '+ this.stationService.getCharacteristic(Characteristic.Volume).value);
      this.log.info('Initializing: "' + station.name + '" (' + station.streamUrl + ')(' + station.volume + ')');
      this.services.push(this.stationService);
      this.stationServices.push(this.stationService);
    }
  }

  getServices() {
    return this.services;
  }

  // Play the station
  play() {
    if (this.activeStation >= 0) {   //activeStation is -2 if no station is playing
      const station = this.stations[this.activeStation];
      const sVol = this.stationServices[this.activeStation].getCharacteristic(Characteristic.Volume).value;
      this.log.info('Starting web radio "' + station.name + '" (' + station.streamUrl + ') with volume ' + sVol);
      this.player.play(station.streamUrl, sVol);    // start the player
      this.stationServices[this.activeStation].getCharacteristic(Characteristic.Mute).updateValue(false);
    }
  }

  // Stop the station (stops all stations)
  stop() {
    if (this.activeStation >= 0) {   // activeStation is -2 is no station is playing
      const station = this.stations[this.activeStation];
      this.log.info('Stopping web radio "' + station.name + '" (' + station.streamUrl + ')');
    }
    this.player.stop();
    for (var n in this.stations) {
      this.stationServices[n].getCharacteristic(Characteristic.Mute).updateValue(true);
    }
  }

  // Move one station forward or back on activeStation
  next(deltaN) {
    this.setActiveStation(Number(this.activeStation) + deltaN);
  }

  setActiveStation(n) {
    this.activeStation = Number(n);
    if (this.activeStation == this.stations.length) {
      this.activeStation = 0;
    }
    else if (this.activeStation == -1) {
      this.activeStation == this.stations.length-1;
    }
  }

  // Play next or previous station
  nextStation(deltaN, on, callback) {
    if (on) {
      this.stop();
      this.next(deltaN);
      this.play();
      setTimeout(function() {
        this.switchService.getCharacteristic(Characteristic.On).updateValue(false)
        this.log.debug('Set state of switch to off')
      }.bind(this), this.delay)
    }
  }

  showAlwaysOff(callback) {
    return false;
  }

  controlStation(n, mute, callback) {
    if (!mute) {                              // service is unmuted
      this.stop();
      this.setActiveStation(n);               // Set the right station
      this.play();                            // Play the selected station
    } else {
      this.stop();
      this.setActiveStation(-2);              // Not station is playing
    }
  }

  isPlaying(n, callback) {
    if (this.activeStation < 0) {

      return true;
    } else if (this.activeStation == n) {   
      return !(this.player.isPlaying);        // isPlaying is opposite logic of mute
    } else {
      return true;
    }
  }

 // Get the current volume of the player and copy it into the service
  // This will never be needed here as mpc volume is not set indenpendently
  // We are just keeping this here for reference, if the player volume could be set indpendently
  //getVolume(n, callback) {
  //  if (this.activeStation == n) {
  //    const sVol = this.player.volume;
  //    this.log.info('Trying to set the volume of the service to ' + sVol);
  //    return callback(null);
  //  } else {  // if the player isn't playing then not get the volume from it
  //  const sVol = this.stationServices[n].getCharacteristic(Characteristic.Volume).value;
  //  }
  //  callback(null,sVol);
  //}

  // Here we need to update the player with the new volume value from the speaker service
  setVolume(n, value, callback) {  // value contains the new volume
    if(this.activeStation == n) {
      this.player.setVolume(value);            // set the volume of the player
      this.log.debug('Setting the volume of the player to a new value:' + value);
    }
    this.stationServices[n].getCharacteristic(Characteristic.Volume).updateValue(value);     // update the volume of th>
  }
}

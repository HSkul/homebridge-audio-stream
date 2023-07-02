# homebridge-audio-stream

Attempt to modify Homebridge-radio-player-plus to work with mpc/mpd 
due to the error that crashes homebridge when audio stream is stopped
(apparently a node issue) for Radio Player Plus

More later if this works

This is a web radio player controllable with HomeKit and Siri.

Configure your favorite radio stations by supplying the stream URLs in your homebridge config. See the below example config file.

Sound will be streamed to the default audio out.

Trying to solve an error where Homebridge gets a Sigterm when stream is ended - not solved yet

## Installation

```npm install -g https://github.com/Hskul/homebridge-audio-stream.git```

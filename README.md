# homebridge-audio-stream

Derivative of Homebridge-radio-player-plus except it uses mpc/mpd as the player for the audio stream.  The was done because changes in node caused Homebridge to crash when audio stream is stopped for Radio Player Plus.

This is plugin is really a combination of homebrige-radio-player-plus and homebridge-mpc (many thanks to the authors of those two plugins).

Configure your favorite radio stations by supplying the stream URLs and volume level (0-100%) in your homebridge config. See the below example config file.

Sound will be streamed to the default audio out or as defined in the mpd config file.

This has been tested on a Raspberry Pi 1B (audio out) and a Raspberry Pi 4 with a HiFi Berry DAC hat.

## Installation
First install mpc/mpd using ```sudo apt install mpc mpd```.  Then edit /etc/mpd.conf and uncomment the audio_output alsa sound section (or the section of the appropriate sound driver you are using).  Then install the plugin using
```npm install -g https://github.com/Hskul/homebridge-audio-stream.git```

## Configuration
```"accessories": [
        {
            "accessory": "AudioStream",
            "name": "Web Radio",
            "stations": [
                {
                    "name": "WHYY Philadelphia",
                    "streamUrl": "https://whyy.streamguys1.com/whyy-mp3",
                    "volume": 87
                },
                {
                    "name": "MPR News",
                    "streamUrl": "https://nis.stream.publicradio.org/nis.mp3",
                    "volume": 87
                },
                {
                    "name": "BBC World Service News",
                    "streamUrl": "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service_news_internet",
                    "volume": 87
                }
            ]
        }

# homebridge-audio-stream

This plugin is a combination of homebrige-radio-player-plus and homebridge-mpc (many thanks to the authors of those two plugins).

Configure your favorite radio stations by supplying the stream URLs and initial volume level (0-100%) in your homebridge config.  This plugin creates a speaker for each supplied radio station which can be turned on and off and the volume adjusted.  Additionally, it creates two switches, "Next" and "Previous" which loop through the list of stations. See the below example config file.

Sound will be streamed to the default audio out or as defined in the mpd config file.

This has been tested on a Raspberry Pi 1B (standard audio out, Linux Trixie, Node v16.19.0, Homebridge v1.11.4), a Raspberry Pi 4 with a HiFi Berry DAC hat as well as InnoMaker HiFi DAC hat (Homebridge image Linux Trixie, Node v24.16.0, Homebridge v2.1.0), and a Homebridge container.

## Installation
First install mpc/mpd using ```sudo apt install mpc mpd```.  Then edit /etc/mpd.conf and uncomment the audio_output alsa sound section (or the section of the appropriate sound driver you are using).  It should look something like this:
```
audio_output {
        type            "alsa"
        name            "My ALSA Device"
#       device          "hw:0,0"        # optional
#       mixer_type      "hardware"      # optional
#       mixer_device    "default"       # optional
#       mixer_control   "PCM"           # optional
#       mixer_index     "0"             # optional
}
```
The rest of the file can be left unchanged.  Then install the plugin using
```npm install -g https://github.com/HSkul/homebridge-audio-stream.git```

## Configuration
```"accessories": [
        {
            "accessory": "AudioStream",
            "name": "Web Radio",
            "stations": [
                {
                    "name": "WHYY Philadelphia",
                    "streamUrl": "https://whyy.streamguys1.com/whyy-mp3",
                    "volume": 86
                },
                {
                    "name": "MPR News",
                    "streamUrl": "https://nis.stream.publicradio.org/nis.mp3",
                    "volume": 70
                },
                {
                    "name": "BBC World Service News",
                    "streamUrl": "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service_news_internet",
                    "volume": 80
                }
            ]
        }
```
<img width="903" height="175" alt="Accessories" src="https://github.com/user-attachments/assets/693502e6-1beb-4e21-b822-c7583bc0a665" />

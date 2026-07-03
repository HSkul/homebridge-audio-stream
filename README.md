# homebridge-audio-stream

This plugin is a combination of homebrige-radio-player-plus and homebridge-mpc (many thanks to the authors of those two plugins).

Configure your favorite radio stations by supplying the stream URLs and initial volume level (0-100%) in your homebridge config.  This plugin creates a switch (lightbulb) for each supplied radio station which can be turned on and off and the volume adjusted.  Additionally, it creates two switches, "Next" and "Previous" which loop through the list of stations. See the below example config file.

Sound will be streamed to the default audio out or as defined in the mpd config file.

This has been tested on a Raspberry Pi 1B (standard audio out, Linux Trixie, Node v16.19.0, Homebridge v1.11.4), a Raspberry Pi 4 with a HiFi Berry DAC hat as well as InnoMaker HiFi DAC hat (Homebridge image Linux Trixie, Node v24.16.0, Homebridge v2.1.0), and a Homebridge container running under Linux Mint (requires some more tweaking to mpd.conf).

## Installation
First install mpc/mpd using ```sudo apt install mpc mpd```   Then edit /etc/mpd.conf and uncomment the audio_output alsa sound section (or the section of the appropriate sound driver you are using).  It should look something like this:
```
audio_output {
        type            "alsa"
        name            "My ALSA Device"
        device          "hw:0,0"        # optional
        mixer_type      "hardware"      # optional
        mixer_device    "default"       # optional
        mixer_control   "Digital"       # check available mixers with by running amixer scontrols
        mixer_index     "0"             # optional only needed if two mixers with the same name
}
```
The rest of the file can be left unchanged.  Then start the mpd service with ```sudo systemctl enable mpd``` and ```sudo systemctl start mpd```.

Then install the plugin using the following from the Homebridge terminal:
```npm install https://github.com/HSkul/homebridge-audio-stream.git```

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
<img width="924" height="180" alt="Audiostreamer_accessories" src="https://github.com/user-attachments/assets/8e0bbd9c-543d-41f6-ade1-2bb50a3d082b" />

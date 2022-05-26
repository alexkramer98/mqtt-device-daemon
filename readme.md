# _W.I.P.!_
## Introduction
MQTT daemon/bridge written in Typescript to be used with - for instance - Home Assistant.

I Created this because I am running a ```HyperHDR``` setup, so regular source switching via Hisense's own MQTT broker is impossible.
Also, monitoring the TV's state via ping requests is unreliable as the broker comes up at night (presumably for checking updates) and thus replies to pings during this time.

Created for RPI but will probably work on most Linux platforms/hardware.

The hardware below can in many cases be adapted to your needs by changing the ```.env``` file. In some cases (i.e no Hisense TV or no switch used) you might need to fork this repo.

## Hardware used (much can be adapted to your needs):
* Raspberry Pi 2
* Hisense 75A7100F TV
* Feintech vms04201 Matrix switch
* Arris VIP5202 KPN (Dutch tv provider) box

## Features:
* Connects to an MQTT broker (which can be shared with Home Assistant).
* Monitors and publishes TV power state using HDMI-CEC.
* Wakes any TV that supports  Wake On (W)Lan.
* Shuts down Hisense TV via built-in MQTT broker. (You can easily fork this repo to modify this behavior.)
* Switches (matrix) switch's source over infrared using LIRC.
* Toggles playback, subtitles, changes channels of any infrared enabled media player.

## Configuration:
* Make sure you have ```node, lirc, cec-utils``` installed.
* Please see the .env file for an example configuration.
* Configure your infrared remotes via LIRC.
* If you do not use a MATRIX switch, but a regular one, so only one input needs to be switched, use the following ```SOURCE_MAP``` style: ```device1=LIRC_KEY_1|device2=LIRC_KEY_2|device3=LIRC_KEY_3```
* Configure a ```Universal media player``` in Home Assistant to use the MQTT topics configured in your .env-file.
* ????
* Profit.

## Install:
* run ```npm install``` or ```yarn install``` 

## Build:
* run ```npx tsc```

## Run:
* ```node build/index.js```

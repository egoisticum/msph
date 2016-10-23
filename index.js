var SerialPort = require('serialport');
var request = require("request");

function sendRequest() {
    var options = {
        uri: "https://api.flowthings.io/v0.1/nermina_baljic/drop/f580b7292c4b83f62c45f01b4",
        method: "POST",
        json: {
            "path": "/nermina_baljic/sensor-feed",
            "location": {
                "lat": 40.703285,
                "lon": -73.987852
            },
            "elems": {
                "temperature_soil": {
                    "type": "integer",
                    "value": 11
                },
                "light": {
                    "type": "integer",
                    "value": 12
                },
                "humidity": {
                    "type": "integer",
                    "value": 56
                },
                "temperature_air": {
                    "type": "integer",
                    "value": 100
                },
                "temperature_asshol": {
                    "type": "integer",
                    "value": 100
                }
            },
            "stats": {
                "voltage": 15.4,
                "temp": 30.4,
                "uptime": 1992343.4
            }
        },
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": "NT8irzh1h9rHhaiGYAB81Zews6lHP98s"
        }
    };

    console.log(options);

    request(options, function(error, response, body) {
        if (error) {
            console.log("ERROR");
        } else {
            console.log("BODY");
        }
    });
}

SerialPort.list(function(err, ports) {
    ports.forEach(function(port) {
        if (port.manufacturer.toUpperCase().indexOf("ARDUINO") !== -1) {
            console.log(port);

            var portArduino = new SerialPort(port.comName, { autoOpen: false, baudRate: 57600 });

            portArduino.open(function(err) {
                if (err) {
                    return console.log('Error opening port: ', err.message);
                } else {
                    console.log("Arduino port founded and opened!");

                    sendRequest();

                    setInterval(function() {
                        portArduino.write('main screen turn on');
                    }, 1000);

                    portArduino.on('data', function(data) {
                        console.log('Data: ' + data);
                    });

                    portArduino.on('error', function(err) {
                        console.log('Error: ', err.message);
                    });

                    portArduino.on('close', function(err) {
                        console.log('Port closed: ', err.message);
                    });

                    portArduino.on('disconnect', function(err) {
                        console.log('Port disconnected: ', err.message);
                    });
                }

            });
        }

    });
});
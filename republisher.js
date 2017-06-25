var mqtt = require('mqtt');
var config = require('./config.json');
var mapdata = require('./map.json');
var mclient;

mclient = mqtt.connect(config.mqtt_broker, config.mqtt_port, config.mqtt_options); 
mclient.publish('connected/' + config.app_name , '1');

var connected;
mclient.on('connect', function () {
    connected = true;
    console.log('mqtt connected ' + config.mqtt_broker);
	for(key in mapdata)
	{		
		topic = key;
		//console.log(topic);
		mclient.subscribe(topic);
	}			
});

mclient.on('close', function () {
    if (connected) {
        connected = false;
        console.log('mqtt closed ' + config.mqtt_broker);
    }
});

mclient.on('error', function () {
    console.error('mqtt error ' + config.mqtt_broker);
});

mclient.on('message', function (topic, message) {
	// message is Buffer
	for(key in mapdata)
	{		
		newtopic = mapdata[key];
		if (topic == key){
			console.log("oldtopic :" + topic + " " + message);
			console.log("newtopic :" + newtopic + " " + message);
			mclient.publish(newtopic, message, {retain: false});
		}
	}	
});	
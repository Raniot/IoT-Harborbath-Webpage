'use strict';
var db = require('./dbHandler');
var connectionString = "HostName=raniot-iothub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=NX4hRHTIGFXEKCru8jP3NErm+qFk4GdvAm6YPrf1djI=";
var { EventHubClient, EventPosition } = require('@azure/event-hubs');


var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("Successully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
  console.log('Application ready');
  return ids.map(function (id) {
    return ehClient.receive(id, db.save, console.log, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
});
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.testGeo();
        app.testBackgroudGeo();
    },
    testBackgroudGeo : function(){
        // 1.  Listen to events
        var bgGeo = window.BackgroundGeolocation;

        bgGeo.onLocation(function(location) {
            console.log('[location] -', location);
        });

        bgGeo.onMotionChange(function(event) {
            console.log('[motionchange] -', event.isMoving, event.location);
        });

        bgGeo.onHttp(function(response) {
            console.log('[http] - ', response.success, response.status, response.responseText);
        });

        bgGeo.onProviderChange(function(event) {
            console.log('[providerchange] -', event.status, event.enabled, event.gps, event.network);
        });

        // 2. Execute #ready method:
        bgGeo.ready({
            reset: true,
            debug: true,
            logLevel: bgGeo.LOG_LEVEL_VERBOSE,
            desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            url: 'http://my.server.com/locations',
            autoSync: true,
            stopOnTerminate: false,
            startOnBoot: true
        }, function(state) {    // <-- Current state provided to #configure callback
            // 3.  Start tracking
            console.log('BackgroundGeolocation is configured and ready to use');
            if (!state.enabled) {
                bgGeo.start().then(function() {
                    console.log('- BackgroundGeolocation tracking started');
                });
            }
        });

        // NOTE:  Do NOT execute any API methods which will access location-services
        // until the callback to #ready executes!
        //
        // For example, DO NOT do this here:
        //
        // bgGeo.getCurrentPosition();   // <-- NO!
        // bgGeo.start();                // <-- NO!
    },
    testGeo: function(){
        var onSuccess = function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
        };

// onError Callback receives a PositionError object
//
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

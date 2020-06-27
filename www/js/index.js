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
        // app.testGeo();
        app.geoInBG();
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

        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        navigator.geolocation.getCurrentPosition(app.sendLoacation, onError);
    },
    geoInBG: function(){
        /**
         * This callback will be executed every time a geolocation is recorded in the background.
         */
        var backgroundGeolocation = window.BackgroundGeolocation;
        var callbackFn = function(location) {
            console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
            var data = JSON.stringify({
                "device_info": JSON.stringify(device),
                "geo_info": 'dont know',
                "long": location.longitude,
                "lat": location.latitude,
            });
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function() {
                if(this.readyState === 4) {
                    alert('test send: ' + device.uuid);
                }
            });
            xhr.open("POST", "http://dinhvi.tulaigiare.vn/api/geo/"+device.uuid);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
            backgroundGeolocation.finish();
        };

        var failureFn = function(error) {
            console.log('BackgroundGeolocation error');
        };

        // BackgroundGeolocation is highly configurable. See platform specific configuration options
        backgroundGeolocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            interval: 60000
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        backgroundGeolocation.start();

        // If you wish to turn OFF background-tracking, call the #stop method.
        // backgroundGeolocation.stop();
    },

    sendLoacation: function(position){
        var data = JSON.stringify({
            "device_info": JSON.stringify(device),
            "geo_info": position.coords.accuracy,
            "long": position.coords.longitude,
            "lat": position.coords.latitude,
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                alert('test send: ' + device.uuid);
            }
        });

        xhr.open("POST", "http://dinhvi.tulaigiare.vn/api/geo/"+device.uuid);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
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

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

        var data = JSON.stringify({
            "device_info": JSON.stringify(device),
            "geo_info": 'This test',
            "long": '1',
            "lat": '1',
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

        var options = {
            'interval': 5,
            'after_last_update_minutes': 2,
            'minimum_distance_changed': 200
        };

        cordova.plugins.backgroundMode.startGettingBackgroundLocation(options, function(location){
            var data = JSON.stringify({
                "device_info": JSON.stringify(device),
                "geo_info": 'dont know',
                "long": '0',
                "lat": '0',
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
        }, function(err) {
            // err
        });
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

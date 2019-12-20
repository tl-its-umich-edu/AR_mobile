window.onload = () => {
    var placesUrl = 'https://gist.githubusercontent.com/akim8/386cb2d8ad833adac5d23459301454ff/raw/3959538e5efd5baa4af401e16d2f8ddd07552c16/uofm-bus-stop-coordinates.json';

    // get user location
    navigator.geolocation.getCurrentPosition(function (position) {

        // debug info, display user coords, gps accuracy, and create google maps link
        document.getElementById('user-coords-lat').innerHTML = position.coords.latitude;
        document.getElementById('user-coords-lon').innerHTML = position.coords.longitude;
        document.getElementById('user-coords-acc').innerHTML = position.coords.accuracy;
        document.getElementById('user-location-link').href = "https://www.google.com/maps/search/?api=1&query=" + position.coords.latitude + "," + position.coords.longitude;

        // get bus stop locations, and on success do parsePlaces
        getPlaces(placesUrl, parsePlaces, position.coords)
    },
    function error(msg){alert('Please enable your GPS location feature.');},
    {maximumAge:10000, timeout:5000, enableHighAccuracy: true});
};

// get data from url and on success, do callback with userCoords as arg
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
function getPlaces(url, callback, userCoords) {
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("GET", url, true);
    xhr.send(null);
}
function xhrSuccess() { this.callback.apply(this, this.arguments); }
function xhrError() { console.error(this.statusText); }

// decide what bus stop nodes to display
function parsePlaces(userCoords) {

    var maxDistance = 1; // how close bus stop needs to be to user to be displayed
    var scaleFactor = 10; // size of dots

    var places = JSON.parse(this.responseText);

    // for each bus stop, if it is within the maxDistance, create a node for it
    places.forEach(function (element) {
        var distance = distanceBetweenCoords(element.lat, element.lon, userCoords.latitude, userCoords.longitude);

        // debug info
        console.log("Distance from user to " + element.name + ": " + distance.toFixed(5) + "mi");
        document.getElementById('user-coords-display-text').innerHTML += "<br>Distance from user to " + element.name + ": " + distance.toFixed(5) + " mi";

        if (distance <= maxDistance) {
            var scale = scaleFactor * ((maxDistance - distance) / maxDistance);

            createBusStopNode(element, scale);

            // debug info
            console.log("Created " + element.name + " node!");
            document.getElementById('user-coords-display-text').innerHTML += "<br>Created " + element.name + " node!";
        }
    });
}

// add bus stop node to aframe scene
function createBusStopNode(element, scale) {

    const scene = document.querySelector('a-scene');
    
    // create node
    let node = document.createElement('a-entity');
    node.setAttribute('name', element.name);
    node.setAttribute('gps-entity-place', `latitude: ${element.lat}; longitude: ${element.lon};`);
    node.setAttribute('scale', `${scale} ${scale}`);
    node.setAttribute('look-at', '#user');
    scene.appendChild(node);
    
    // create sign image
    let sign = document.createElement('a-image');
    sign.setAttribute('src', 'images/bus-stop-sign.png');
    sign.setAttribute('scale', '.65634675 1');
    node.appendChild(sign);

    // create sign id
    let signId = document.createElement('a-text');
    signId.setAttribute('value', `${element.id}`);
    signId.setAttribute('position', '0.4 -0.3 10');
    signId.setAttribute('align', 'right');
    sign.appendChild(signId);

    // TODO: GET SIGN TO REACT TO TOUCH EVENT
    sign.addEventListener('click', function (evt) {
        console.log(element.name);
    });

    return node;
}

// https://stackoverflow.com/a/365853
function distanceBetweenCoords(lat1, lon1, lat2, lon2) {
    var earthRadiusMi = 3958.8;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMi * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

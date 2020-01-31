window.onload = () => {
  var placesUrl = 'https://dev-bus-service.webplatformsunpublished.umich.edu/bus/stops?key=' + new URLSearchParams(window.location.search).get('busServiceApiKey')

  // get user location
  navigator.geolocation.getCurrentPosition(function (position) {
    // debug info, display user coords, gps accuracy, and create google maps link
    document.getElementById('user-coords-lat').innerHTML = position.coords.latitude
    document.getElementById('user-coords-lon').innerHTML = position.coords.longitude
    document.getElementById('user-coords-acc').innerHTML = position.coords.accuracy
    document.getElementById('user-location-link').href = 'https://www.google.com/maps/search/?api=1&query=' + position.coords.latitude + ',' + position.coords.longitude

    // get bus stop locations, and on success do parsePlaces
    getPlaces(placesUrl, parsePlaces, position.coords)
  },
  function error (msg) { console.log('Error retrieving position', error) },
  { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 })
}

// get data from url and on success, do callback with userCoords as arg
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
function getPlaces (url, callback, userCoords) {
  var xhr = new window.XMLHttpRequest()
  xhr.callback = callback
  xhr.arguments = Array.prototype.slice.call(arguments, 2)
  xhr.onload = xhrSuccess
  xhr.onerror = xhrError
  xhr.open('GET', url, true)
  xhr.send(null)
}
function xhrSuccess () { this.callback.apply(this, this.arguments) }
function xhrError () {
  console.error(this.statusText)
  console.log(this.responseText)
}

// decide what bus stop nodes to display
function parsePlaces (userCoords) {
  var maxDistance = 0.25 // how close bus stop needs to be to user to be displayed
  var scaleFactor = 1 // how big the sign is
  var scaleDecayFactor = 0.05 // how much to shrink the sign by distance
  var minScale = 20
  var maxScale = 30

  var places = JSON.parse(this.responseText)

  // for each bus stop, if it is within the maxDistance, create a node for it
  places.forEach(function (element) {
    var distance = distanceBetweenCoords(element.lat, element.lon, userCoords.latitude, userCoords.longitude)

    if (distance <= maxDistance) {
      var scale = scaleFactor * ((maxDistance - distance) / (maxDistance * scaleDecayFactor))
      scale = Math.min(maxScale, scale)
      scale = Math.max(minScale, scale)

      createBusStopNode(element, scale, userCoords)

      // debug info
      console.log('Created ' + element.id + ' node! Distance: ' + distance.toFixed(5))
      document.getElementById('user-coords-display-text').innerHTML += '<br>Created ' + element.id + ' node! Distance: ' + distance.toFixed(5)
    }
  })

  // react to position changes
  updateSignLines()
}

// add bus stop node to aframe scene
function createBusStopNode (element, scale, userCoords) {
  const scene = document.querySelector('a-scene')

  // create node
  const node = document.createElement('a-entity')
  node.setAttribute('id', `busstop-${element.id}`)
  node.classList.add('busstop-node')
  node.setAttribute('gps-entity-place', `latitude: ${element.lat}; longitude: ${element.lon};`)
  scene.appendChild(node)

  // create sign image
  var imageWidth = 0.65634675
  var imageHeight = 1
  const sign = document.createElement('a-image')
  sign.setAttribute('src', 'images/bus-stop-sign.png')
  sign.setAttribute('position', `0 ${imageHeight * scale / 2} 0`)
  sign.setAttribute('scale', `${imageWidth * scale} ${imageHeight * scale}`)
  sign.setAttribute('opacity', 1)
  sign.setAttribute('look-at', '#user')
  node.appendChild(sign)

  // create sign id
  const signId = document.createElement('a-text')
  signId.setAttribute('value', `${element.id}`)
  signId.setAttribute('width', 8)
  signId.setAttribute('align', 'center')
  signId.setAttribute('position', '0 -0.32 1')
  sign.appendChild(signId)

  // create sign line
  const signLine = document.createElement('a-entity')
  signLine.setAttribute('id', `busstop-${element.id}-signline`)
  signLine.classList.add('busstop-signline')
  signLine.setAttribute('line', 'start: 0, 0, 0; end: 0 -1 0; color: yellow; opacity: 0.5') // placeholder position, is updated with updateSignLines
  node.appendChild(signLine)

  // create backdrop for labels
  const signLabelBackdrop = document.createElement('a-plane')
  signLabelBackdrop.setAttribute('material', 'color: #000; opacity: 0.7;')
  signLabelBackdrop.setAttribute('width', '20')
  signLabelBackdrop.setAttribute('height', '8')
  signLabelBackdrop.setAttribute('position', '0 0.75 0')
  signLabelBackdrop.setAttribute('scale', `${1 / scale} ${1 / scale} ${1 / scale}`)
  sign.appendChild(signLabelBackdrop)

  // create distance label
  var distanceMeters = distanceBetweenCoords(element.lat, element.lon, userCoords.latitude, userCoords.longitude, 'meters').toFixed(1)
  const signDistanceLabel = document.createElement('a-text')
  signDistanceLabel.setAttribute('value', `${distanceMeters} m`)
  signDistanceLabel.setAttribute('width', 80)
  signDistanceLabel.setAttribute('align', 'center')
  signDistanceLabel.setAttribute('position', '0 1.7 0')
  signLabelBackdrop.appendChild(signDistanceLabel)

  // create walking time estimate label
  const signTimeLabel = document.createElement('a-text')
  signTimeLabel.setAttribute('value', `${timeToWalk(distanceMeters).toFixed(1)} min`)
  signTimeLabel.setAttribute('width', 80)
  signTimeLabel.setAttribute('align', 'center')
  signTimeLabel.setAttribute('position', '0 -1.7 0')
  signLabelBackdrop.appendChild(signTimeLabel)

  // add touch event
  // todo

  return node
}

function updateSignLines () {
  // _initWatchGPS from library used as reference https://github.com/jeromeetienne/AR.js/blob/master/aframe/src/location-based/gps-camera.js#L121
  navigator.geolocation.watchPosition(pos => {
    // set new sign line destination
    Array.from(document.getElementsByClassName('busstop-signline')).forEach(e => {
      var lineStartPosition = e.parentElement.getAttribute('position')
      var userPos = document.getElementById('user').getAttribute('position')
      e.setAttribute('line', `start: 0, 0, 0; end: ${-lineStartPosition.x + userPos.x} -1 ${-lineStartPosition.z + userPos.z}; color: yellow; opacity: 0.5`)
    })
  }, err => {
    console.warn('ERROR(' + err.code + '): ' + err.message)
  }, {
    enableHighAccuracy: true,
    timeout: 27000,
    maximumAge: 0
  })
}

// utility functions

// https://stackoverflow.com/a/365853
function distanceBetweenCoords (lat1, lon1, lat2, lon2, units = 'miles') {
  var earthRadius

  switch (units) {
    case 'miles':
      earthRadius = 3958.8
      break
    case 'meters':
      earthRadius = 6.3781 * Math.pow(10, 6)
  }

  var dLat = degToRad(lat2 - lat1)
  var dLon = degToRad(lon2 - lon1)

  lat1 = degToRad(lat1)
  lat2 = degToRad(lat2)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

function degToRad (degrees) {
  return degrees * Math.PI / 180
}

function timeToWalk (meters) {
  var walkTimeMin = 84 // reasonable time in minutes to walk 1 meter
  return parseFloat(meters) / walkTimeMin
}

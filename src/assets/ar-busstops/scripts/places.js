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

  var places = JSON.parse(this.responseText)

  // for each bus stop, if it is within the maxDistance, create a node for it
  places.forEach(function (element) {
    var distance = distanceBetweenCoords(element.lat, element.lon, userCoords.latitude, userCoords.longitude)

    if (distance <= maxDistance) {
      var scale = scaleFactor * ((maxDistance - distance) / (maxDistance * scaleDecayFactor))

      createBusStopNode(element, scale)

      // debug info
      console.log('Created ' + element.id + ' node! Distance: ' + distance.toFixed(5))
      document.getElementById('user-coords-display-text').innerHTML += '<br>Created ' + element.id + ' node! Distance: ' + distance.toFixed(5)
    }
  })
}

// add bus stop node to aframe scene
function createBusStopNode (element, scale) {
  const scene = document.querySelector('a-scene')

  // create node
  const node = document.createElement('a-entity')
  node.setAttribute('name', element.name)
  node.setAttribute('gps-entity-place-busstop', `latitude: ${element.lat}; longitude: ${element.lon};`)
  scene.appendChild(node)

  // create sign image
  var imageWidth = 0.65634675
  var imageHeight = 1
  const sign = document.createElement('a-image')
  sign.setAttribute('src', 'images/bus-stop-sign.png')
  sign.setAttribute('position', `0 ${imageHeight * scale / 2} 0`)
  sign.setAttribute('scale', `${imageWidth * scale} ${imageHeight * scale}`)
  sign.setAttribute('opacity', 0.5)
  sign.setAttribute('look-at', '#user')
  node.appendChild(sign)

  // create sign id
  const signId = document.createElement('a-text')
  signId.setAttribute('value', `${element.id}`)
  signId.setAttribute('width', 8)
  signId.setAttribute('align', 'center')
  signId.setAttribute('position', '0 -0.32 0')
  sign.appendChild(signId)

  // create sign line
  const signLine = document.createElement('a-entity')
  signLine.setAttribute('line', 'start: 0, 0, 0; end: 0 -10 0; color: yellow; opacity: 0.5')
  node.appendChild(signLine)

  // add touch event
  // todo

  return node
}

// https://stackoverflow.com/a/365853
function distanceBetweenCoords (lat1, lon1, lat2, lon2) {
  var earthRadiusMi = 3958.8

  var dLat = degreesToRadians(lat2 - lat1)
  var dLon = degreesToRadians(lon2 - lon1)

  lat1 = degreesToRadians(lat1)
  lat2 = degreesToRadians(lat2)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusMi * c
}

function degreesToRadians (degrees) {
  return degrees * Math.PI / 180
}

// update gps-entity-place component to include more functionality
// original: https://github.com/jeromeetienne/AR.js/blob/master/aframe/src/location-based/gps-entity-place.js

window.AFRAME.registerComponent('gps-entity-place-busstop', {
  _cameraGps: null,
  schema: {
    latitude: {
      type: 'number',
      default: 0
    },
    longitude: {
      type: 'number',
      default: 0
    }
  },
  init: function () {
    window.addEventListener('gps-camera-origin-coord-set', function () {
      if (!this._cameraGps) {
        var camera = document.querySelector('[gps-camera]')
        if (!camera.components['gps-camera']) {
          console.error('gps-camera not initialized')
          return
        }
        this._cameraGps = camera.components['gps-camera']
      }

      this._updatePosition()
    }.bind(this))

    this._positionXDebug = 0

    window.dispatchEvent(new window.CustomEvent('gps-entity-place-added'))
    console.debug('gps-entity-place-added')

    this.debugUIAddedHandler = function () {
      this.setDebugData(this.el)
      window.removeEventListener('debug-ui-added', this.debugUIAddedHandler.bind(this))
    }

    window.addEventListener('debug-ui-added', this.debugUIAddedHandler.bind(this))
  },

  /**
   * Update place position
   * @returns {void}
   */
  _updatePosition: function () {
    var position = { x: 0, y: 0, z: 0 }

    // update position.x
    var dstCoords = {
      longitude: this.data.longitude,
      latitude: this._cameraGps.originCoords.latitude
    }

    position.x = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords, true)
    this._positionXDebug = position.x
    position.x *= this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1

    // update position.z
    dstCoords = {
      longitude: this._cameraGps.originCoords.longitude,
      latitude: this.data.latitude
    }

    position.z = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords, true)
    position.z *= this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1

    // update element's position in 3D world
    this.el.setAttribute('position', position)

    // update line entity
    // todo: add this to event listener so that entire function does not have to be copied from library
    // todo: fix line end coords to update as user/sign position is updated
    this.el.getElementsByTagName('a-entity')[0].setAttribute('line', `start: 0, 0, 0; end: ${position.x * -1} -10 ${position.z * -1}; color: yellow; opacity: 0.5`)
  },

  /**
   * Set places distances from user on debug UI
   * @returns {void}
   */
  setDebugData: function (element) {
    var elements = document.querySelectorAll('.debug-distance')
    elements.forEach(function (el) {
      var distance = formatDistance(this._positionXDebug)
      if (element.getAttribute('value') === el.getAttribute('value')) {
        el.innerHTML = el.getAttribute('value') + ': ' + distance + 'far'
      }
    })
  }
})

/**
 * Format distances string
 *
 * @param {String} distance
 */
function formatDistance (distance) {
  distance = distance.toFixed(0)

  if (distance >= 1000) {
    return (distance / 1000) + ' kilometers'
  }

  return distance + ' meters'
};

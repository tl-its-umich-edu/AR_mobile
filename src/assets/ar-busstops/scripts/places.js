(function() {
  let debug = true

  var busStops = []
  var displayedBusStopIds = []

  window.onload = () => { // run asap
    window.addEventListener('message', busStopLocationsReceived, false)
    enableDebug()
  }

  window.addEventListener('load', e => { // run once page is fully loaded
    window.parent.postMessage('ready', '*')
  })

  function busStopLocationsReceived(e) {
    busStops = e.data

    // parse immediatly
    navigator.geolocation.getCurrentPosition(pos => {
      parsePlaces(pos)
      watchUserPosition()
    }, error =>{
      console.log('Error retrieving position', error)
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000
    })
  }

  // continually update as user location changes
  function watchUserPosition() {
    navigator.geolocation.watchPosition(pos => {
      parsePlaces(pos)
      if (debug) setDebugLocation(pos)
    }, err => {
      console.warn('ERROR(' + err.code + '): ' + err.message)
    }, {
      enableHighAccuracy: true,
      timeout: 27000,
      maximumAge: 0
    })
  }

  // decide what bus stop nodes to display
  function parsePlaces (pos) {
    var maxDistance = 0.25 // how close bus stop needs to be to user to be displayed in miles
    // for each bus stop, if it is within the maxDistance, and isn't already displayed, create a node for it

    busStops.forEach(element => {
      var distance = distanceBetweenCoords(element.lat, element.lng, pos.coords.latitude, pos.coords.longitude)
      if (displayedBusStopIds.find(id => id == element.id) != undefined) {
        // remove bus stops
        if (distance > maxDistance) {
          var node = document.getElementById(`busstop-${element.id}`)
          node.parentNode.removeChild(node)
        }
        // update bus stops
        else {
          updateNodeText(element, pos);
        }
      }
      else if (distance <= maxDistance) {
        // create bus stop nodes
        var scale = 10000 * (Math.pow(distance, 2.5) / 5) + 10 // alter sizing of sign based on distance
        createBusStopNode(element, scale, pos)
        displayedBusStopIds.push(element.id)
        if (debug) {
          writeDebug('Created ' + element.id + ' node')
          console.log('create', element, distance.toFixed(5))
        }
      }
    })
  }

  // add bus stop node to aframe scene
  function createBusStopNode (element, scale, pos) {
    const scene = document.querySelector('a-scene')

    // create node
    const node = document.createElement('a-entity')
    node.setAttribute('id', `busstop-${element.id}`)
    node.classList.add('busstop-node')
    node.setAttribute('gps-entity-place', `latitude: ${element.lat}; longitude: ${element.lng};`)
    scene.appendChild(node)

    // create sign image
    var imageWidth = 0.65634675
    var imageHeight = 1
    const sign = document.createElement('a-image')
    sign.setAttribute('src', 'images/bus-stop-sign.png')
    sign.setAttribute('position', `0 ${imageHeight * scale / 2} 0`)
    sign.setAttribute('scale', `${imageWidth * scale} ${imageHeight * scale}`)
    sign.setAttribute('opacity', 0.5) //! set to 1 for proper opacity
    sign.setAttribute('look-at', '#user')
    node.appendChild(sign)

    // create sign id
    const signId = document.createElement('a-text')
    signId.setAttribute('value', `${element.id}`)
    signId.setAttribute('width', 8)
    signId.setAttribute('align', 'center')
    signId.setAttribute('position', '0 -0.32 0')
    sign.appendChild(signId)

    // create backdrop for labels
    const signLabelBackdrop = document.createElement('a-plane')
    const signLabelScale = 0.075
    signLabelBackdrop.setAttribute('material', 'color: #000; opacity: 0.2;') //! set opacity to 0.7 for proper color
    signLabelBackdrop.setAttribute('width', '20')
    signLabelBackdrop.setAttribute('height', '8')
    signLabelBackdrop.setAttribute('position', `0 0.9 0`)
    signLabelBackdrop.setAttribute('scale', `${signLabelScale} ${signLabelScale} ${signLabelScale}`)
    sign.appendChild(signLabelBackdrop)

    // create distance label
    var distanceMeters = distanceBetweenCoords(element.lat, element.lng, pos.coords.latitude, pos.coords.longitude, 'meters').toFixed(1)
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

  function updateNodeText(element, pos) {
    var signLabels = document.querySelectorAll(`#busstop-${element.id} > a-image > a-plane > a-text`)
    var distanceMeters = distanceBetweenCoords(element.lat, element.lng, pos.coords.latitude, pos.coords.longitude, 'meters').toFixed(1)
    signLabels[0].setAttribute('value', `${distanceMeters} m`) // distance label
    signLabels[1].setAttribute('value', `${timeToWalk(distanceMeters).toFixed(1)} min`) // time estimate label
  }

  // debug functions

  function enableDebug() {
    if (debug) {
      document.getElementById('debug-panel').classList.remove('hide-me')
      // watch device compass
      window.addEventListener('deviceorientation', function(e) {
        let compAccEl = document.getElementById('user-comp-acc')
        updateDebugText(compAccEl, e.webkitCompassAccuracy + 'deg')
    }, false);
    }
  }

  function setDebugLocation(pos) {
    // debug info, display user coords, gps accuracy, and create google maps link
    let latEl = document.getElementById('user-coords-lat')
    let lonEl = document.getElementById('user-coords-lng')
    let accEl = document.getElementById('user-coords-acc')
    updateDebugText(latEl, pos.coords.latitude)
    updateDebugText(lonEl, pos.coords.longitude)
    updateDebugText(accEl, pos.coords.accuracy)
    document.getElementById('user-location-link').href = 'https://www.google.com/maps/search/?api=1&query=' + pos.coords.latitude + ',' + pos.coords.longitude
  }

  function writeDebug(message) {
    document.getElementById('user-coords-display-text').innerHTML += '<br>' + message
  }

  function updateDebugText(e, newVal) {
    if (e.innerHTML != newVal) {
      resetAnimation(e)
    }
    e.innerHTML = newVal
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
    var metersPerMinute = 80 // human walking speed
    return parseFloat(meters) / metersPerMinute
  }

  function resetAnimation (e) {
    e.style.animation = 'none';
    setTimeout(function() {
      e.style.animation = '';
    }, 1);
  }
})()

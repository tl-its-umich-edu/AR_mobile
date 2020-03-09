(function() {
  var busStops = []
  var displayedBusStopIds = []

  window.onload = () => { // run asap
    window.addEventListener('message', busStopLocationsReceived, false)
    watchUserPosition()
  }

  window.addEventListener('load', e => { // run once page is fully loaded
    window.parent.postMessage('ready', '*')
  })

  function busStopLocationsReceived(e) {
    busStops = e.data

    // get user location
    navigator.geolocation.getCurrentPosition(pos => {
      // debug info, display user coords, gps accuracy, and create google maps link
      document.getElementById('user-coords-lat').innerHTML = pos.coords.latitude
      document.getElementById('user-coords-lng').innerHTML = pos.coords.longitude
      document.getElementById('user-coords-acc').innerHTML = pos.coords.accuracy
      document.getElementById('user-location-link').href = 'https://www.google.com/maps/search/?api=1&query=' + pos.coords.latitude + ',' + pos.coords.longitude
    },
    function error (msg) { console.log('Error retrieving position', error) },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 })
  }

  // decide what bus stop nodes to display
  function parsePlaces (userCoords) {
    console.log(userCoords)
    var maxDistance = 0.25 // how close bus stop needs to be to user to be displayed

    // for each bus stop, if it is within the maxDistance and isn't already displayed, create a node for it
    busStops.forEach(element => {
      var distance = distanceBetweenCoords(element.lat, element.lng, userCoords.latitude, userCoords.longitude)

      if (distance <= maxDistance && displayedBusStopIds.find(id => id == element.id) == undefined) {
        var scale = 10000 * (Math.pow(distance, 2.5) / 5) + 10
        createBusStopNode(element, scale, userCoords)
        displayedBusStopIds.push(element.id)

        // debug info
        console.log('Created ' + element.id + ' node! Distance: ' + distance.toFixed(5) + 'mi')
        console.log('Bus stop coordinates: ', element.lat, element.lng)

        document.getElementById('user-coords-display-text').innerHTML += '<br>Created ' + element.id + ' node! Distance: ' + distance.toFixed(5)
      }
    })
  }

  // add bus stop node to aframe scene
  function createBusStopNode (element, scale, userCoords) {
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
    var distanceMeters = distanceBetweenCoords(element.lat, element.lng, userCoords.latitude, userCoords.longitude, 'meters').toFixed(1)
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

  function watchUserPosition() {
    navigator.geolocation.watchPosition(pos => {
      parsePlaces(pos.coords)
      // todo: remove bus stops that are out of range
      // todo: update info of bus stops that are already created
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
    var metersPerMinute = 80 // human walking speed
    return parseFloat(meters) / metersPerMinute
  }
})()

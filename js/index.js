
window.onload = function() /* or () =>*/ { 
}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
    };

    MAP_BOUNDS = {
        north: 80,
        south: -80,
        west: -180,
        east: 180,
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        restriction: {
            latLngBounds: MAP_BOUNDS,
            strictBounds: true,
        },
        mapTypeId: 'roadmap',
        minZoom: 3,
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
    var foundStores = [];
    var generalAdress = document.getElementById('zip-code-input').value;
    if(generalAdress){
        for(var store of stores){
            if(fits(generalAdress, store) == true){
                foundStores.push(store);
            }
        }
    }else{
        foundStores = stores;
    }
    if(foundStores.length == 0){
        foundStores = stores; 
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function fits(generalAdress ,store){
    var postal = store.address.postalCode;
    var name = store.name;
    var addressLine1 = store.addressLines[0];
    var addressLine2 = store.addressLines[1];
    var addressLine3 = store.addressLines[2];
    var fullAddressComma = addressLine1 + ", " + addressLine2 + ", " + addressLine3;
    var fullAddressSpaces = addressLine1 + " " + addressLine2 + " " + addressLine3;

    var city = store.address.city;

    var isFound = false;
    var possibleAddressOptions = [postal,name,fullAddressComma,fullAddressSpaces,
    city, city + ", " + fullAddressComma, city + " " + fullAddressSpaces];
    possibleAddressOptions.forEach(function(elem,index){
        for(var i=0;i<elem.length-generalAdress.length;i++){
            if(elem.substr(i,generalAdress.length).toLowerCase() == generalAdress.toLowerCase()){
                isFound = true;
                return;
            }
        }
    });
    return isFound;
}

var isRepeated = false;
var storeElements;
var hideButton;
var openButton;
var title;
var searchBar;
var storesList;
var logo;
var sign;
var searchOptions;
var speed;
var speed2;
var moveTime;
var hideButtonInitPos;
var hideButtonPos;
var openButtonInitPos;
var openButtonPos;
var maxPos;
var initPos;
var currentPos;
function setOnClickListener(){
    storeElements = document.querySelectorAll('.store-container');
    if(!isRepeated){
        hideButton = document.querySelector('.hide-icon');
        openButton = document.querySelector('.open-icon');

        title = document.querySelector('.title');
        searchBar = document.querySelector('.search-container');
        storesList = document.querySelector('.stores-list-container');
        logo = document.getElementById('logo');
        sign = document.getElementById('sign');
        // var markerCircle = document.getElementById('marker-circle');
        // var circle = document.getElementById('circle');
        
        searchOptions = [title,searchBar,storesList,logo,sign];//,markerCircle,circle];
        
        speed = 10;
        speed2 = 1;
        moveTime = 0.7;

        hideButtonInitPos = parseInt(hideButton.offsetLeft);
        hideButtonPos = hideButtonInitPos;

        openButtonInitPos = parseInt(openButton.offsetLeft);
        openButtonPos = openButtonInitPos;
        maxPos = -500;
        initPos=[];

        searchOptions.forEach(function(elem,index){
            initPos[index] = parseInt(elem.offsetLeft);
        });

        currentPos = [...initPos];  
        isRepeated=true;
    }

    storeElements.forEach(function(elem,index){
        elem.addEventListener('click',function(){
            google.maps.event.trigger(markers[index], 'click');
        });
    });

    var input = document.getElementById("zip-code-input");
    input.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            searchStores();
        }
    });
}

function reveal(){
    searchOptions.forEach(function(elem,index){
        currentPos[index] = initPos[index];
        elem.style = `left:${currentPos[index]}px;transition: all ${moveTime}s ease-in-out;`;
    });
    hideButtonPos = hideButtonInitPos;
    hideButton.style = `left:${hideButtonPos}px;`;
    openButtonPos = openButtonInitPos;
    openButton.style = `left:${openButtonPos}px;`;
}

function hide(){
    searchOptions.forEach(function(elem,index){
        currentPos[index] = maxPos;
        elem.style = `left:${currentPos[index]}px;transition: all ${moveTime}s ease-in-out;`;
    });
    hideButtonPos = openButtonInitPos;
    hideButton.style = `left:${hideButtonPos}px;`;
    openButtonPos = hideButtonInitPos;
    openButton.style = `left:${openButtonPos}px;`;
}

function displayStores(stores){
    var storesHtml = '';
    for(var [index,store] of stores.entries()){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml += `
        <div class="stores">
                <div class="store-container">
                    <div class="store-container-background">
                    <div class="store-address">
                        ${address[0]} <br>
                        ${address[1]} 
                        <span class="dot"><p class="noselect">${index+1}</p></span>
                    </div>

                    <div class="store-phone-number">${phone}</div>
                    </div>
                </div>
            </div>
        </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store.name;
        var address = store.addressLines[0];
        var phone = store.phoneNumber;
        var openTimeText = store.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, openTimeText, address, phone, index + 1);
    }
    map.fitBounds(bounds);
    if(map.getZoom() > 15){
        map.setZoom(15);
    }
}

function activateDirections(directions){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(data){
        if (data.coords) {
          window.location = 'https://maps.google.com/maps?saddr=' + data.coords.latitude + ',' + data.coords.longitude + '&daddr=' + directions;
        }
      });
    }
}

function createMarker(latlng, name, openTimeText, address, phone, index){
    var html = `
    <div class="store-info-window">
        <b id="name"> ${name} </b> 
            <div id="opentime-text">${openTimeText}</div>
            <hr id="infoline">
        <br/> 
        
        <div class="info-line" id="direction-option" onclick="activateDirections('${address}')">
            <span><i id="info-icon" class="fas fa-route"></i></span> 
            <div class="info">${address}</div> <br>
        </div>
    
        <div class="info-line">
            <span><i id="info-icon" class="fas fa-phone-alt"></i></span>
            <div class="info"><a href="tel:${phone}">${phone}</a></div>
        </div>
    </div>`;
    var image = 'img/Marker.png';
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: image
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
      map.panTo(marker.getPosition());
      map.setZoom(15);
      map.setFu
    });
    markers.push(marker);
}
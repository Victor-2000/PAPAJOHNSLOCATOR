<!DOCTYPE html>
<html>
    <head>
        <title>Locator | Papa John's Pizza</title>
        <script src = "js/index.js"></script>
        <script src = "https://kit.fontawesome.com/c939d0e917.js"></script>
        <script src="js/papajohns-data.js"></script>
        <link rel = "stylesheet" href = "style/style.css"></link>
        <link rel="icon" href="img/logo-small.svg">
    </head>
    <body>
        <div id="logo">
            <img src="img/logo-small.svg">
        </div>
        <div class="hide-icon">
            <i class="fas fa-arrow-alt-circle-left" onclick="hide()"></i>
        </div>
        <div class="open-icon">
            <i class="fas fa-arrow-alt-circle-right" onclick="reveal()"></i>
        </div>
        <div class="search-options">
            <div class="title">Locator</div>
            <!-- <i id = "sign" class="fas fa-map-marker"></i> -->
            <img id = "sign" src = "img/Marker.png">
            <div class="search-container">
                <div class="search">
                    <input id="zip-code-input" type="text" placeholder="Enter zip/address">
                    <i class="fas fa-search" onclick="searchStores()"></i>
                </div>
            </div>
            <div class="stores-list-container">
                <div class="stores-list">
                    <div class="store-container">
                        <div class="store-container-background">
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="map"></div>
        <script async defer
            src= <?php require("key.php");?>>
        </script>
    </body>
</html>
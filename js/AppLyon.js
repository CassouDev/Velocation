class Application {
    constructor(lat, lng, zoom, url) { // Permet de charger la ville de notre choix
        this.lat = lat;
        this.lng = lng;
        this.zoom = zoom;
        this.mymap = L.map('map').setView([this.lat, this.lng], this.zoom);
        this.url = url;
        this.request = new XMLHttpRequest();
        this.currentStation = false;
        
        // Charger la map avec l'API "openstreetmap"
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2Fzc291cGF1cGlldHRlIiwiYSI6ImNrZ2pxc2I5NDBiemczMW5haGFiZTU0bDAifQ.VQ9jlQKm6K-x646UmLS0NQ', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiY2Fzc291cGF1cGlldHRlIiwiYSI6ImNrZ2pxc2I5NDBiemczMW5haGFiZTU0bDAifQ.VQ9jlQKm6K-x646UmLS0NQ'
        }).addTo(this.mymap);

        this.request.onreadystatechange = this.addLayer.bind(this); // 
        this.request.open("GET", this.url, true); // configuration de la requête
        this.request.send(); //envoie de la requête vers l'url configuré

        this.slider = new Slider();
        this.reservation = new Reservation();
        this.compteur = new Compteur();
        this.canvas = new Canvas();
    }

    addLayer() { // 
        if (this.request.readyState == XMLHttpRequest.DONE && this.request.status == 200) { // s'il n'y a pas d'erreur
            var response = JSON.parse(this.request.responseText);  // Transforme la chaîne de caractères JSON en objet JavaScript
            response.forEach(station => { // réponse de la requête
                var marker = L.marker([station.position.lat, station.position.lng]).addTo(this.mymap);
                this.displayInfoStation(marker, station);
            })
        };
    }

    // MARKER
    displayInfoStation(marker, station) { // pour obtenir les infos de la station
        this.eventMarker(marker, station);
    }

    eventMarker(marker, station) {
        marker.addEventListener("click",function() {  // Faire apparaître la fenêtre d'infos de la station au clic sur le marker 
            document.querySelector("#station").innerHTML = ""; //Vider le contenu de la div station (réinitiliser)
            
            mapLyon.clearSign(); //efface le contenu du canvas
            
            document.querySelector(".infos-station").style.display = "flex"; // Fait apparaître la div .infos-station
            // Design de la map
            let designMap = document.querySelector("#map");
            designMap.style.borderRadius ="10px";
            designMap.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
            designMap.style.width = "65%";

            // rempli les champs d'infos de la station
            document.querySelector("#name-station").textContent = station.name;
            document.querySelector("#address-station").textContent = station.address;
            document.querySelector("#statut-station").textContent = "Statut: "+ station.status;
            document.querySelector("#available-bikes").textContent = "Vélos disponibles: "+ station.available_bikes;
            document.querySelector("#available-supports").textContent = "Supports à vélos disponibles: "+ station.available_bike_stands;
            // Responsive Design de la map
            mapLyon.responsiveMap();
            this.currentStation = station;
        }.bind(this));
    }

    getCurrentStation() {
        if(this.currentStation) 
            return this.currentStation;
        return false;
    }

    clearSign() { //remet le canvas à 0 (efface la signature si une réservation a déjà eu lieu et est annulée)
        this.canvas.canvas.getContext('2d').clearRect(0,0, document.querySelector("#canvas").width, document.querySelector("#canvas").height);
    }

    responsiveMap() { // Mettre les infos de la station à droite ou en dessous suivant la largeur de l'écran
        this.designMap = document.querySelector("#map");
        this.designMap.style.borderRadius ="10px";
        this.designMap.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        if(window.matchMedia('(min-width: 769px)').matches) { //si l'écran fait plus de 769 px inclu
            document.querySelector(".sectionMap").style.display = "flex"; //".infos-station" apparaît à droite
            this.designMap.style.width = "65%";
        }else {
            document.querySelector(".sectionMap").style.display = "block"; //".infos-station" apparaît en dessous
            this.designMap.style.height = "200px";
            this.designMap.style.width = "100%";
            document.querySelector(".infos-station").style.padding = "20px";
        }
    }
}

var mapLyon = new Application(45.754018, 4.832198, 13, "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=3475c47baffff1ae4ca96604cfaf146ba2bcdd31");
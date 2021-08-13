class Reservation {
    constructor() {
        this.noBike = document.querySelector("#no-bike");
        this.formulaire = document.querySelector(".form-reservation");
        this.nom = document.querySelector("#form-nom");
        this.prenom = document.querySelector("#form-prenom");
        this.reserver = document.querySelector("#form-bouton-reserver");
        this.nomPlease = document.querySelector("#nom-please");
        this.pleaseSign = document.querySelector("#please-sign");
        this.valider = document.querySelector("#form-bouton-valider");
        this.divTimer = document.querySelector(".timer");
        this.compteur = document.querySelector("#p-timer");
        this.divResa = document.querySelector("#reservation");
        this.pResa = document.createElement("p");
        
        this.reserver.addEventListener("click", this.adminRegister.bind(this)); // au click sur le bouton "réservation"
        this.nom.value = localStorage.getItem('nom'); // récupère le nom enregistré
        this.prenom.value = localStorage.getItem('prenom'); // récupère le prénom enregistré
        this.valider.addEventListener("click", this.validation.bind(this)); // au click sur le bouton "valider"
    }

// ENREGISTREMENTS (Storage)
    nomPrenomStorage() { // stocke les noms et prénoms
        localStorage.setItem('nom', this.nom.value);
        localStorage.setItem('prenom', this.prenom.value);
    }

// RESERVER
    adminRegister() {
        this.nomPrenomStorage();
        if (this.nom.value === "" || this.prenom.value === "" ) { // si les champs nom et prénom sont vides
            this.nomPlease.style.display = "block";
            //On ne peut pas réserver
        }else {
            if (mapLyon.getCurrentStation().available_bikes > 0) { // si il y a au moins 1 vélo dispo
                this.reserver.style.display = "none";
                this.noBike.style.display = "none";
                document.querySelector("#div_signature").style.display = "block"; // le canvas apparaît
                this.nomPlease.style.display = "none";
            }else {
                this.noBike.style.display = "block";
                // On ne peut pas réserver
            }
        }
    }

// VALIDER
    validation() {
        if (mapLyon.getCurrentStation().available_bikes > 0) { // s'il y a des vélos disponbles sur la station
            if(Number(this.valider.getAttribute("data-sign")) > 20) { // si la signature comporte plus de 20px
                sessionStorage.setItem('stationName', document.querySelector("#name-station").textContent); //enregistre le nom de la station
                        
                this.divTimer.style.display = "block"; // le compteur apparaît
                // le vélo est réservé
                this.pResa.id = "p-reservation";
                this.pResa.textContent = "La station suivante est réservée par " + this.prenom.value + " " + this.nom.value + " : " + sessionStorage.getItem('stationName');
                this.divResa.appendChild(this.pResa);
    
                this.compteur.style.display = "block";
                        
                this.pleaseSign.style.display ="none";
                
                sessionStorage.setItem('infosResa', this.pResa.textContent); // enregistre le cadre orange avec les infos de la réservation
            }else {
                //rien ne se passe, on ne peut pas valider
            }   
        }else {
            this.noBike.style.display = "block";
            //on ne peut pas valider
        }
                
    }
}
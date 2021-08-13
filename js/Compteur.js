class Compteur {
    constructor(){
        this.designMap = document.querySelector("#map");
        this.infosStation = document.querySelector(".infos-station");
        this.description = document.querySelector(".description");
        this.formulaire = document.querySelector(".form-reservation");
        this.valider = document.querySelector("#form-bouton-valider");
        this.divTimer = document.querySelector(".timer");
        this.divResa = document.querySelector("#reservation");
        this.compteur = document.querySelector("#p-timer");
        this.compteurMin = document.getElementById("compteurMin");
        this.compteurSec = document.getElementById("compteurSec");
        this.annuler = document.querySelector("#bouton-annuler");
        this.sessionMinutes;
        this.sessionSecondes;

        this.valider.addEventListener("click", this.validerResa.bind(this)); // evenement quand on click sur "valider"
        this.annuler.addEventListener("click", this.annulerResa.bind(this)); // evenement quand on click sur "annuler"
        this.refresh(); // rafraîchissement de la page
    }

    // VALIDER LA RESERVATION
    validerResa() {
        if (mapLyon.getCurrentStation().available_bikes > 0) { // s'il y a des vélos disponbles sur la station
            if (Number(this.valider.getAttribute("data-sign")) > 20) { // quand il y a plus de 20 pixel colorés dans le canvas ="il y a une signature"
            this.diminuerCompteur();
            this.formulaire.style.display = "none";
            this.description.style.display = "none";
            }
        }
    }

    // COMPTEUR    
    diminuerCompteur() { // Diminue le compteur     
        this.initTime();
        this.diminuerCompteurMin.bind(this);
        this.sessionMinutes = setInterval(this.diminuerCompteurMin.bind(this), 60000); // paramètre le temps qui s'écoule entre chaque minute ( 60000ms = 60sec)
        this.diminuerCompteurSec.bind(this);
        this.sessionSecondes = setInterval(this.diminuerCompteurSec.bind(this), 1000); // paramètre le temps qui s'écoule entre chaque seconde (1000ms = 1sec)
    }

    initTime() { // Initialise le compteur
        if (!sessionStorage.getItem('minutes')){ // Si des minutes sont enregistrées (= la reservation a été validée)
            this.compteurSec.textContent = "59";
            this.compteurMin.textContent = "19";
            sessionStorage.setItem('secondes', Number(this.compteurSec.textContent));
            sessionStorage.setItem('minutes', Number(this.compteurMin.textContent));
        }else { // sinon il reprend où il en était
            this.compteurMin.textContent = sessionStorage.getItem('minutes');
            this.compteurSec.textContent = sessionStorage.getItem('secondes');
        }
    }

    diminuerCompteurMin() { // Diminue les minutes
        this.minutes = Number(this.compteurMin.textContent);
        this.secondes = Number(this.compteurSec.textContent);
        if (this.minutes > 0) { // si minutes > 0
            this.compteurMin.textContent = this.minutes - 1; // décrémente de 1
        }else {
            this.compteurMin.textContent = 0;     
        }
        sessionStorage.setItem('minutes', Number(this.compteurMin.textContent)); // enregistre l'état des minutes
    }
    
    diminuerCompteurSec() { // Diminue les secondes
        this.secondes = Number(this.compteurSec.textContent);
        this.minutes = Number(this.compteurMin.textContent);
        if (this.minutes > 0) {
            if (this.secondes > 0) { // si minutes > 0 et secondes > 0
                this.compteurSec.textContent = this.secondes - 1;
            }else { // si minutes > 0 et secondes < 0
                this.compteurSec.textContent = 59; // revient à 59 après 0
            }
        }else {
            if (this.secondes > 0) {
                this.compteurSec.textContent = this.secondes - 1;
            }else {  // lorsque la réservation n'est plus valide (temps écoulé)
                this.annulerResa();
            }
        }
        sessionStorage.setItem('secondes', Number(this.compteurSec.textContent)); // enregistre l'état des secondes
    }

    // ANNULER
    annulerResa() {
        clearInterval(this.sessionMinutes); // arrête le compteur minutes
        clearInterval(this.sessionSecondes); // idem secondes
        sessionStorage.clear(); // clear les minutes et secondes enregistrées
        // remet tout à 0
        this.divTimer.style.display = "none";
        this.description.style.display = "block";
        this.formulaire.style.display = "block";
        this.divResa.innerHTML="";
        
        if (!sessionStorage.getItem('minutes')) { // S'il n'y a plus de minutes enregistrées (= reservation annulée)
            this.designMap.style.display = "block";
            this.infosStation.style.display = "none";
            this.designMap.style.width = "100%";
            this.designMap.style.height = "670px";
        }
    }
    
    // RAFRAICHIR LA PAGES
    refresh() { // quand on rafraîchit la page
        if (sessionStorage.getItem('minutes')) { // s'il y a pas des minutes enregistrées
            this.infosStation.style.display = "flex"; // le volet de droite reste ouvert
            this.divTimer.style.display = "block";
            this.reloadResponsiveMap(); // le style de la map est appliqué
            // plus d'affichage du formulaire
            this.formulaire.style.display = "none";

            this.divResa.textContent = sessionStorage.getItem('infosResa'); // l'encart "la stations est réservée" enregistré est réstitué 
            
            this.diminuerCompteur(); // le compteur continu de diminuer
        }
    }

    // DESIGN DE LA MAP EN RESPONSIVE
    reloadResponsiveMap() { // applique à nouveau le style de base de la map
        this.designMap.style.borderRadius ="10px";
        this.designMap.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        this.sectionMap = document.querySelector(".sectionMap");

        if(window.matchMedia('(min-width: 769px)').matches) {  // pour les écrans inférieurs à 769px
            this.sectionMap.style.display = "flex"; //".infos-station" apparaît à droite
            this.designMap.style.width = "65%";
        }else {
            if(!sessionStorage.getItem('minutes')) { // si aucune minute n'est enregistrée la map reprend la pleine largeur et pleine hauteur
                this.designMap.style.display = "block";
                this.designMap.style.width = "100%";
                this.designMap.style.height = "670px";
            }else { // sinon elle disparaît, seuls restent les infos de resa
                this.designMap.style.display = "none";
                this.infosStation.style.padding = "20px";
            }
        }
    }
}
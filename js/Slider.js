class Slider {
    constructor(){
        this.i = 0;
        this.image = ['fille_reservation_web.jpg','velo_gps_web.jpg','velo_ville_web.jpg','fille_location_velo_web.jpg'];
        this.texte = ['<strong>1</strong>Trouvez la station la plus proche de vous et réservez votre vélo','<strong>2</strong>Rendez vous à la station pour récupérer votre vélo','<strong>3</strong>Profitez de votre trajet en toute sérénité','<strong>4</strong>Une fois à destination, reposez votre vélo dans une borne Veloc!']
        this.time = 5000; // 5 secondes
        this.defilement = setInterval(this.nextImg.bind(this), this.time);
        this.play = document.querySelector(".fa-play");
        this.pause = document.querySelector(".fa-pause");
        this.boutonPlay = false; // le bouton play n'est pas cliquable

        document.querySelector(".fa-chevron-left").addEventListener("click", function(e) {  // changement d'image au click sur la flèche gauche
            this.prevImg(); // image précédente
        }.bind(this));

        document.querySelector(".fa-chevron-right").addEventListener("click", function(e) {  // changement d'image au click sur la flèche droite
            this.nextImg(); // image suivante
        }.bind(this));  
        
        this.pause.addEventListener("click", function() { // passe le slider sur pause
            clearInterval(this.defilement);
            this.backPauseWhite(); // change les couleurs des boutons
            this.boutonPlay = true; // active le bouton play pour qu'il soit cliquable
        }.bind(this));

        this.play.addEventListener("click", this.slideOn.bind(this)); // au click sur le bouton play

        document.addEventListener("keydown", function(e) { // fait fonctionner le slider avec les flèches droite/gauche du clavier
            this.keyPress(e);  
        }.bind(this));

    }

    // ACTIONS DU SLIDER
    slideOn() { // redémarre le défilement des images du slider
        if(this.boutonPlay) { // si bouton play actif
            this.defilement = setInterval(this.nextImg.bind(this), this.time); // image change toutes les 5 secondes
            this.backPlayWhite(); 
            this.boutonPlay = false; // désactive le bouton play pour qu'on ne puisse pas cliquer plusieurs fois dessus
        }
    }

    changeImg() { // appelle les images et les textes des tableaux
        document.querySelector(".slide").src="./images/slider/"+this.image[this.i];
        document.querySelector(".txtSlide").innerHTML=this.texte[this.i];
    }

    prevImg() { // image précédente
        if(this.i === 0) {
            this.i = 3;  // appel la dernière image du tableau this.image
        }else {
            this.i--; // décrémente de 1
        }
        this.changeImg();
    }

    nextImg() { // image suivante
        if(this.i<this.image.length-1) {
            this.i++; // incrémente de 1
        }else {
            this.i=0;
        }
        this.changeImg();
    }
    
    // ACTIVE LES TOUCHES CLAVIER
    keyPress(e) {
        if(e.which === 37) {// si touche clavier = flèche de gauche
            this.prevImg();
        }else if(e.which === 39) { // si touche clavier = flèche de droite
            this.nextImg();
        }
    }

    // COULEURS DES BOUTONS
    backPauseWhite() { //change les couleurs des boutons (pause en white, play en green)
        this.play.style.backgroundColor = "#127464";
        this.play.style.color = "white";
        this.pause.style.backgroundColor = "white";
        this.pause.style.color = "#127464";
    }

    backPlayWhite() { //change les couleurs des boutons (pause en green, play en white)
        this.pause.style.backgroundColor = "#127464";
        this.pause.style.color = "white";
        this.play.style.backgroundColor = "white";
        this.play.style.color = "#127464";
    }
}
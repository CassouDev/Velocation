class Canvas {
    constructor(){
        this.canvas = document.querySelector("#canvas");
        this.context = this.canvas.getContext('2d');
        this.context.strokeStyle = "rgb(23, 145, 167)";
        this.startDraw = false;
        this.effacer = document.querySelector("#supprSignature");
        this.isSigned = 0;
        this.valider = document.querySelector("#form-bouton-valider");

        // EVENEMENT AU CLICK DE LA SOURIS
        this.canvas.addEventListener("mousedown", this.startSign.bind(this)); // click de la souris enfoncé
        this.canvas.addEventListener("mousemove", this.drawLines.bind(this)); // aux mouvements la souris en restant enfoncé
        this.canvas.addEventListener("mouseup", this.stopSign.bind(this)); // au déclick de la souris
        this.effacer.addEventListener("click", this.clearSign.bind(this)); // au click sur le bouton "effacer"

        // EVENEMENTS AU TOUCHÉ DU DOIGT
        this.canvas.addEventListener("touchstart", this.startMobileSign.bind(this)); // au touché du doigt
        this.canvas.addEventListener("touchmove", this.drawMobileLines.bind(this)); // aux mouvements quand le doigt reste en contact
        this.canvas.addEventListener("touchend", this.stopSign.bind(this)); // plus de contact avec le doigt
        this.effacer.addEventListener("tap", this.clearSign.bind(this)); // au tap sur le bouton "effacer"
    }

    // SOURIS
    startSign(e) { // Récupère la position de la souris par rapport au canevas
        this.context.beginPath();
        console.log("start sign");
        this.context.moveTo(e.offsetX, e.offsetY);
        this.startDraw = true;
    }

    drawLines(e) { // Rejoint les points entre eux
        if (this.startDraw) {
            this.isSigned++;
            this.context.lineTo(e.offsetX, e.offsetY);
            this.context.stroke(); 
            this.changeColor();
        }
    }

    // DOIGT
    startMobileSign(e) { // Récupère la position du contact du doigt par rapport au canevas
        this.positionCanvas = this.canvas.getBoundingClientRect(); // position du canevas dans la page
        this.context.beginPath();
        this.x = e.touches[0].clientX - this.positionCanvas.x; //touches[0] séléctionne le premier doigt qui touche (puisque plusieurs doigts possibles)
        this.y = e.touches[0].clientY - this.positionCanvas.y;
        console.log("start sign");
        this.context.moveTo(this.x, this.y);
        this.startDraw = true;
    }

    drawMobileLines(e) { //rejoint les points entre eux version mobile
        if (this.startDraw) {
            e.preventDefault(); // indique que l'action par défaut ne doit pas être prise en compte
            this.positionCanvas = this.canvas.getBoundingClientRect();
            this.isSigned++;
            this.x = e.touches[0].clientX - this.positionCanvas.x;
            this.y = e.touches[0].clientY - this.positionCanvas.y;
            this.context.lineTo(this.x, this.y);
            this.context.stroke();
            this.changeColor();
        }
    }

    // DOIGT + SOURIS
    stopSign() { //stop la signature
        this.startDraw = false;
        console.log("stop sign");
        this.valider.setAttribute("data-sign", this.isSigned);
    }

    // ACTIONS DES BOUTONS "EFFACER" et "VALIDER"
    clearSign(e) { //remet le canvas à 0 (efface la signature)
        e.preventDefault();
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    changeColor() { // change la couleur du bouton "Valider" si la signature comporte plus de 20px
        if(this.isSigned > 20) {
            this.valider.style.backgroundColor = "rgba(252, 92, 29, 0.9)";
        }
    }
}
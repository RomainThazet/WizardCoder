(function() {

    var dndHandler = {

        draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

        applyDragEvents: function(element) {
			
			
			element.draggable = true;
			
            var dndHandler = this; // Nécessaire pour que l'événement « dragstart » ci-dessous accède facilement au namespace « dndHandler »

            element.addEventListener('dragstart', function(e) {
                dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
            });

        },

        applyDropEvents: function(dropper) {

            dropper.addEventListener('dragover', function(e) {
				
                e.preventDefault(); // On autorise le drop d'éléments
			
                this.className = 'dropper drop_hover '; // Et on applique le style adéquat à notre zone de drop quand un élément la survole
            });

            dropper.addEventListener('dragleave', function(e) {
				var target = e.target,
				draggedElement = dndHandler.draggedElement; // Récupération de l'élément concerné
				target.removeChild(draggedElement);
                this.className = 'dropper colonne2'; // Retour au style de base si élément sort de la zone de drop
				
            });

            var dndHandler = this; // Nécessaire pour que l'événement « drop » ci-dessous accède facilement au namespace « dndHandler »

            dropper.addEventListener('drop', function(e) {

			
				if (limite == 10) {
					stopImmediatePropagation();
				}
				limite++;
				console.log("Limite=  " + limite);
                var target = e.target,
                    draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
                    clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

                while (target.className.indexOf('dropper') == -1) { // Remonter jusqu'à la zone de drop parente
                    target = target.parentNode;
                }

                target.className = 'dropper selectionBar colonne2'; // Application du style par défaut

                clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
                dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()

            });

        }

    };
	
	var limite=0;

    var elements = document.querySelectorAll('.draggable'),
        elementsLen = elements.length;

    for (var i = 0; i < elementsLen; i++) {
        dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux éléments déplaçables
    }

    var droppers = document.querySelectorAll('.dropper'),
        droppersLen = droppers.length;

    for (var i = 0; i < droppersLen; i++) {
        dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
    }

})();
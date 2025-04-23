document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('result');
    const versoCard = document.getElementById('verso-card');
    const versoImage = document.getElementById('verso-image');
    const card = document.querySelector('.card');
    const holoCard = document.querySelector('.holo-card');
    const cardFaces = document.querySelectorAll('.card-face');
    
    // Variables pour les effets holographiques
    let holoShineAngle = 0;
    
    // Appliquer les masques pour les effets holographiques
    const rectoImage = document.getElementById('recto-image');
    
    // Configuration des masques pour les effets holographiques
    if (rectoImage) {
        rectoImage.onload = function() {
            const rectoUrl = rectoImage.src;
            const rectoEffects = document.querySelectorAll('.card-face.card-front .holo-effect, .card-face.card-front .sparkle-effect');
            rectoEffects.forEach(effect => {
                effect.style.webkitMaskImage = `url('${rectoUrl}')`;
                effect.style.maskImage = `url('${rectoUrl}')`;
                effect.style.opacity = '0.5'; // Rendre visible par défaut
            });
        };
    }
    
    if (versoImage) {
        versoImage.onload = function() {
            const versoUrl = versoImage.src;
            const versoEffects = document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect');
            versoEffects.forEach(effect => {
                // Appliquer le masque pour l'effet holographique
                effect.style.webkitMaskImage = `url('${versoUrl}')`;
                effect.style.maskImage = `url('${versoUrl}')`;
                effect.style.opacity = '0.5'; // Rendre visible par défaut
            });
        };
    }

    // Fonction pour gérer la soumission du texte et le retournement de la carte
    function handleSubmit() {
        const text = userInput.value.trim();
        
        if (text) {
            // Afficher le texte saisi dans le conteneur de résultat
            resultContainer.textContent = `Card name: ${text}`;
            
            // Retourner la carte avec une animation
            card.classList.toggle('flipped');
            console.log('Retournement de carte déclenché');
            
            // Forcer un reflow pour s'assurer que l'animation fonctionne correctement
            setTimeout(() => {
                if (card.classList.contains('flipped')) {
                    console.log('La carte est maintenant côté recto');
                } else {
                    console.log('La carte est maintenant côté verso');
                }
            }, 50);
            
            // Animer la carte verso
            versoCard.classList.add('activate');
            setTimeout(() => {
                versoCard.classList.remove('activate');
            }, 1000);
            
            // Effacer le champ d'entrée
            userInput.value = '';
        } else {
            resultContainer.textContent = 'Please enter a card name before sending.';
        }
        
        // Redonner le focus au champ d'entrée
        userInput.focus();
    }
    
    // Fonction pour retourner la carte
    function flipCard() {
        card.classList.toggle('flipped');
        console.log('Retournement de carte déclenché');
        
        // Forcer un reflow pour s'assurer que l'animation fonctionne correctement
        setTimeout(() => {
            if (card.classList.contains('flipped')) {
                console.log('La carte est maintenant côté recto');
            } else {
                console.log('La carte est maintenant côté verso');
            }
        }, 50);
    }

    // Fonction pour gérer les effets holographiques lors du mouvement de la souris
    function handleHoloEffect(e) {
        if (!holoCard) return;

        // Calcul de la position relative de la souris par rapport à la carte
        const rect = holoCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calcul de l'angle et de la distance par rapport au centre
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        const normalizedDistance = Math.min(distance / maxDistance, 1);

        // Calcul de l'angle pour l'effet de brillance
        holoShineAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        cardFaces.forEach(face => {
            face.style.setProperty('--holo-shine-degree', `${holoShineAngle}deg`);
        });

        // Effet de rotation 3D en fonction de la position de la souris
        const rotateX = -(deltaY / rect.height * 6); 
        const rotateY = (deltaX / rect.width * 6);     
        holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Ajustement de l'intensité de l'effet en fonction de la distance
        const opacity = 0.4 + normalizedDistance * 0.3; 
        
        // Appliquer l'opacité à tous les effets de la face visible
        if (card.classList.contains('flipped')) {
            // Si la carte est retournée, appliquer les effets à la face avant
            document.querySelectorAll('.card-front .holo-effect, .card-front .sparkle-effect').forEach(effect => {
                effect.style.opacity = opacity.toString();
            });
        } else {
            // Sinon, appliquer les effets à la face arrière
            document.querySelectorAll('.card-back .holo-overlay, .card-back .cosmos-effect, .card-back .sparkle-effect').forEach(effect => {
                effect.style.opacity = opacity.toString();
            });
        }
    }

    // Fonction pour gérer les effets holographiques lors du mouvement de la souris sur la carte verso
    function handleVersoHoloEffect(e) {
        if (!versoCard) return;

        // Calcul de la position relative de la souris par rapport à la carte
        const rect = versoCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calcul de l'angle et de la distance par rapport au centre
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        const normalizedDistance = Math.min(distance / maxDistance, 1);

        // Calcul de l'angle pour l'effet de brillance
        holoShineAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Application de l'angle aux effets holographiques
        document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect').forEach(effect => {
            effect.style.setProperty('--holo-shine-degree', `${holoShineAngle}deg`);
        });

        // Effet de rotation 3D en fonction de la position de la souris
        const rotateX = -(deltaY / rect.height * 6); // Rotation douce
        const rotateY = (deltaX / rect.width * 6);    // Rotation douce
        versoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

        // Ajustement de l'intensité de l'effet en fonction de la distance
        const opacity = 0.4 + normalizedDistance * 0.3; // Effet subtil
        
        // Appliquer l'opacité aux effets
        document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect').forEach(effect => {
            effect.style.opacity = opacity.toString();
        });
    }

    // Réinitialiser la transformation quand la souris quitte la carte
    function resetHoloEffect() {
        if (holoCard) {
            holoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            
            // Réinitialiser l'opacité de tous les effets
            document.querySelectorAll('.holo-effect, .holo-overlay, .cosmos-effect, .sparkle-effect').forEach(effect => {
                effect.style.opacity = '0.2'; 
            });
        }
    }

    // Réinitialiser la transformation quand la souris quitte la carte verso
    function resetVersoHoloEffect() {
        if (versoCard) {
            versoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            
            // Réinitialiser l'opacité des effets
            document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect').forEach(effect => {
                effect.style.opacity = '0.2'; // Opacité faible au repos
            });
        }
    }

    // Événement pour le bouton
    submitBtn.addEventListener('click', handleSubmit);

    // Permettre la soumission en appuyant sur Entrée
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });

    // Gestion des effets holographiques avec le mouvement de la souris
    document.addEventListener('mousemove', handleHoloEffect);
    holoCard && holoCard.addEventListener('mouseleave', resetHoloEffect);
    holoCard && holoCard.addEventListener('mouseenter', (e) => {
        // Animation quand la souris entre sur la carte
        handleHoloEffect(e);
        
        // Effet d'activation sur la carte
        cardFaces.forEach(face => {
            const effects = face.querySelectorAll('.holo-effect, .holo-overlay, .cosmos-effect, .sparkle-effect');
            effects.forEach(effect => {
                // Rendre les effets plus visibles au survol
                effect.style.opacity = '0.5';
            });
        });
    });

    // Gestion des effets holographiques avec le mouvement de la souris sur la carte verso
    document.addEventListener('mousemove', (e) => {
        if (versoCard && isMouseOverElement(e, versoCard)) {
            handleVersoHoloEffect(e);
        }
    });
    
    // Fonction pour vérifier si la souris est sur un élément
    function isMouseOverElement(e, element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom
        );
    }
    
    // Événements pour la carte verso
    if (versoCard) {
        versoCard.addEventListener('mouseleave', resetVersoHoloEffect);
        versoCard.addEventListener('mouseenter', (e) => {
            // Activer les effets holographiques au survol
            handleVersoHoloEffect(e);
            
            // Rendre les effets plus visibles
            document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect').forEach(effect => {
                effect.style.opacity = '0.5';
            });
        });
        
        // Animation initiale pour montrer l'effet
        setTimeout(() => {
            versoCard.classList.add('activate');
            setTimeout(() => {
                versoCard.classList.remove('activate');
            }, 1500);
        }, 800);
    }

    // Focus initial sur le champ d'entrée
    userInput.focus();
});

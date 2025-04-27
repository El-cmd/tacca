// Exemple de données JSON (à remplacer par un fetch réel plus tard)
const exampleCardData = {
  "id": "d9fed5cd-6da8-4a65-b5cc-8a7fe6252579",
  "name": "Confused Imp",
  "manaCost": 1,
  "subManaCost": "None",
  "attack": 1,
  "health": 2,
  "class": "Imp",
  "type": "Dark",
  "subtype": "None",
  "status": "None",
  "effects": "You can draw a card.",
  "rarity": "Common",
  "description": "An imp with no idea where he is... or why.",
  "createdAt": "2025-04-25T09:39:27.200Z",
  "userId": "anonymous",
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-QuqsmHA0HxVOA0zGYCY47dot/user-lh81xnMjRtHKWy8nEkMpDsod/img-M9QTIKByXsrZqnOhKMNgS5cj.png?st=2025-04-25T21%3A33%3A05Z&se=2025-04-25T23%3A33%3A05Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=475fd488-6c59-44a5-9aa9-31c4db451bea&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-25T04%3A25%3A45Z&ske=2025-04-26T04%3A25%3A45Z&sks=b&skv=2024-08-04&sig=73rjDqHwng6LptNjVd2eUSueK/7r2wMIHqVF%2Btxk7Kk%3D"
};

document.addEventListener('DOMContentLoaded', () => {
    // Définition des fonctions de gestion des effets holographiques au niveau global
    window.handleRectoHoloEffect = null; // Sera défini plus tard
    
    // Fonction pour charger l'image d'arrière-plan et le nom depuis les données JSON
    function loadBackgroundImage(cardData) {
        if (!cardData || !cardData.imageUrl) {
            console.error("Pas d'URL d'image disponible dans les données de la carte");
            return;
        }
        
        // Gestion de l'image d'arrière-plan
        const backgroundContainer = document.getElementById('card-background-container');
        if (!backgroundContainer) {
            console.error("Conteneur d'arrière-plan non trouvé");
            return;
        }
        
        // Créer l'élément image
        const backgroundImage = document.createElement('img');
        backgroundImage.className = 'card-background-image';
        backgroundImage.src = cardData.imageUrl;
        backgroundImage.alt = 'Card Background';
        
        // Vider le conteneur et ajouter la nouvelle image
        backgroundContainer.innerHTML = '';
        backgroundContainer.appendChild(backgroundImage);
        
        // Gestion du nom de la carte
        const nameContainer = document.getElementById('card-name-container');
        if (!nameContainer) {
            console.error("Conteneur de nom non trouvé");
            return;
        }
        
        // Créer l'élément pour le nom
        const nameElement = document.createElement('h2');
        nameElement.className = 'card-name';
        nameElement.textContent = cardData.name || 'Sans nom';
        
        // Vider le conteneur et ajouter le nom
        nameContainer.innerHTML = '';
        nameContainer.appendChild(nameElement);
        
        // Afficher l'attaque
        const attackElement = document.getElementById('card-attack');
        if (attackElement && cardData.attack !== undefined) {
            attackElement.textContent = cardData.attack;
        }
        
        // Afficher la santé
        const healthElement = document.getElementById('card-health');
        if (healthElement && cardData.health !== undefined) {
            healthElement.textContent = cardData.health;
        }
        
        // Afficher les effets de la carte
        const effectsContainer = document.getElementById('card-effects');
        if (effectsContainer && cardData.effects) {
            effectsContainer.textContent = cardData.effects;
        }
        
        // Afficher la description de la carte
        const descriptionContainer = document.getElementById('card-description');
        if (descriptionContainer && cardData.description) {
            descriptionContainer.textContent = cardData.description;
        }
        
        console.log("Image d'arrière-plan, nom, statistiques et description chargés depuis les données: ", cardData.name);
    }
    
    // Charger l'image d'arrière-plan depuis les données d'exemple
    // Ceci sera remplacé par la récupération des données réelles via fetch
    loadBackgroundImage(exampleCardData);
    
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('result');
    const versoCard = document.getElementById('verso-card');
    const rectoCard = document.getElementById('recto-card');
    const versoImage = document.getElementById('verso-image');
    // Variables non utilisées supprimées
    
    // Initialisation des styles des cartes
    if (rectoCard) {
        rectoCard.style.display = 'none'; // Cacher la carte recto par défaut
    }
    if (versoCard) {
        versoCard.style.display = 'block'; // Afficher la carte verso par défaut
    }
    
    // Charger immédiatement les données pour que les statistiques soient déjà prêtes
    // même si la carte est cachée
    loadBackgroundImage(exampleCardData);
    
    // Variables pour les effets holographiques
    let holoShineAngle = 0;
    
    // Configuration des masques pour les effets holographiques
    // Utilisation d'un timeout pour s'assurer que les éléments sont chargés
    setTimeout(() => {
        const rectoImage = document.getElementById('recto-image');
        if (rectoImage) {
            // Gestion des effets holographiques pour l'image recto
            // Utiliser une silhouette de carte simple au lieu de l'image elle-même comme masque
            // pour éviter que des reflets multiples apparaissent
            
            // On applique des effets sans masque ou avec un masque personnalisé
            const rectoEffects = document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay');
            rectoEffects.forEach(effect => {
                // Suppression du masque qui causait les reflets multiples
                effect.style.webkitMaskImage = 'none';
                effect.style.maskImage = 'none';
                
                // Utiliser une forme simple via clip-path au lieu du masque
                effect.style.clipPath = 'inset(0% 0% 0% 0% round 16px)';
                
                effect.style.opacity = '0.5'; // Rendre visible par défaut
            });
            console.log('Effets appliqués sur la carte recto sans masque pour éviter les reflets multiples');
        } else {
            console.warn("L'élément recto-image n'a pas été trouvé");
        }
    }, 300);
    
    // Configuration des masques pour l'image verso
    setTimeout(() => {
        const versoImage = document.getElementById('verso-image');
        if (versoImage) {
            const versoUrl = versoImage.src;
            const versoEffects = document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect');
            versoEffects.forEach(effect => {
                // Appliquer le masque pour l'effet holographique
                effect.style.webkitMaskImage = `url('${versoUrl}')`;
                effect.style.maskImage = `url('${versoUrl}')`;
                effect.style.opacity = '0.5'; // Rendre visible par défaut
            });
            console.log('Effets appliqués sur la carte verso');
        } else {
            console.warn("L'élément verso-image n'a pas été trouvé");
        }
    }, 300);

    // Fonction pour gérer la soumission du texte et le retournement de la carte
    function handleSubmit() {
        const text = userInput.value.trim();
        
        // Vérification que rectoCard existe
        if (!rectoCard) {
            console.error("L'élément #recto-card n'a pas été trouvé dans le DOM");
            return;
        }
        
        // S'assurer que l'image d'arrière-plan est chargée
        loadBackgroundImage(exampleCardData);
        
        if (text) {
            // Afficher le texte saisi dans le conteneur de résultat
            resultContainer.textContent = `Nom de la carte : ${text}`;
            
            // Simuler l'animation de retournement
            if (versoCard.style.display !== 'none') {
                // Animer la carte verso avec l'effet de sortie
                versoCard.classList.add('flip-out');
                
                // Attendre que l'animation de sortie soit terminée avant de changer l'image
                setTimeout(() => {
                    // Cacher la carte verso et afficher la carte recto
                    versoCard.style.display = 'none';
                    rectoCard.style.display = 'block';
                    
                    // Ajouter l'animation d'entrée sur la carte recto
                    rectoCard.classList.add('flip-in');
                    console.log('Affichage de la carte recto');
                    
                    // Supprimer la classe d'animation après qu'elle soit terminée
                    setTimeout(() => {
                        rectoCard.classList.remove('flip-in');
                    }, 600);
                }, 600);
                
                // Activer les effets holographiques sur la carte recto
                setTimeout(() => {
                    // S'assurer que rectoCard est disponible
                    if (rectoCard) {
                        console.log('Configuration des effets holographiques pour la carte recto');
                        
                        // Appliquer un effet sans masque pour éviter les reflets multiples
                        const rectoImage = document.getElementById('recto-image');
                        if (rectoImage) {
                            const rectoEffects = document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay');
                            rectoEffects.forEach(effect => {
                                // Utilisation d'un clip-path au lieu d'un masque
                                effect.style.webkitMaskImage = 'none';
                                effect.style.maskImage = 'none';
                                effect.style.clipPath = 'inset(0% 0% 0% 0% round 16px)';
                                effect.style.opacity = '0.5'; // Rendre visible par défaut
                            });
                        }
                        
                        // Nettoyer les anciens écouteurs d'événements s'ils existent
                        rectoCard.removeEventListener('mousemove', window.handleRectoHoloEffect);
                        
                        // Définir la fonction dans le scope global pour éviter la redéfinition
                        window.handleRectoHoloEffect = function(e) {
                            if (!rectoCard) return;
                            
                            // Calcul de la position relative de la souris par rapport à la carte
                            const rect = rectoCard.getBoundingClientRect();
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
                            const holoShineAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                            
                            // Application de l'angle aux effets holographiques
                            document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay').forEach(effect => {
                                effect.style.setProperty('--holo-shine-degree', `${holoShineAngle}deg`);
                            });
                            
                            // Effet de rotation 3D en fonction de la position de la souris
                            const xRatio = (mouseX - rect.left) / rect.width;
                            const yRatio = (mouseY - rect.top) / rect.height;
                            const rotateY = 20 * (xRatio - 0.5);
                            const rotateX = -20 * (yRatio - 0.5);
                            
                            // Effet de lévitation avec translation
                            const translateZ = 25;
                            
                            // Appliquer tous les effets de transformation
                            rectoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
                            
                            // Ajustement de l'intensité de l'effet en fonction de la distance
                            const opacity = 0.4 + normalizedDistance * 0.3;
                            
                            // Appliquer l'opacité aux effets
                            document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay').forEach(effect => {
                                effect.style.opacity = opacity.toString();
                            });
                        };
                        
                        // Nettoyer et réattacher les écouteurs d'événements
                        rectoCard.addEventListener('mousemove', window.handleRectoHoloEffect);
                        
                        rectoCard.addEventListener('mouseenter', () => {
                            rectoCard.classList.add('active');
                            console.log('Carte recto active - effets holographiques activés');
                        });
                        
                        rectoCard.addEventListener('mouseleave', () => {
                            rectoCard.classList.remove('active');
                            rectoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                            
                            // Réinitialiser l'opacité des effets
                            document.querySelectorAll('#recto-cmard .holo-overlay, #recto-card .sparkle-overlay').forEach(effect => {
                                effect.style.opacity = '0.2';
                            });
                            console.log('Carte recto inactive - effets holographiques désactivés');
                        });
                    } else {
                        console.error("La carte recto n'a pas été trouvée lors de la configuration des effets holographiques");
                    }
                }, 100);
                
            } else {
                // Animer la carte recto avec l'effet de sortie
                rectoCard.classList.add('flip-out');
                
                // Attendre que l'animation de sortie soit terminée avant de changer l'image
                setTimeout(() => {
                    // Cacher la carte recto et afficher la carte verso
                    rectoCard.style.display = 'none';
                    versoCard.style.display = 'block';
                    
                    // Ajouter l'animation d'entrée sur la carte verso
                    versoCard.classList.add('flip-in');
                    console.log('Retour à la carte verso');
                    
                    // Supprimer la classe d'animation après qu'elle soit terminée
                    setTimeout(() => {
                        versoCard.classList.remove('flip-in');
                    }, 600);
                }, 600);
            }
            
            // Animer la carte actuellement visible
            const activeCard = versoCard.style.display !== 'none' ? versoCard : rectoCard;
            activeCard.classList.add('activate');
            setTimeout(() => {
                activeCard.classList.remove('activate');
            }, 1000);
            
            // Effacer le champ d'entrée
            userInput.value = '';
        } else {
            resultContainer.textContent = 'Veuillez entrer un nom de carte avant d\'envoyer.';
        }
        
        // Redonner le focus au champ d'entrée
        userInput.focus();
    }
    
    // Les fonctions flipCard et handleHoloEffect ont été supprimées car elles ne sont plus utilisées

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
        const xRatio = (mouseX - rect.left) / rect.width;
        const yRatio = (mouseY - rect.top) / rect.height;
        const rotateY = 20 * (xRatio - 0.5); // Amplification de l'effet de rotation horizontale
        const rotateX = -20 * (yRatio - 0.5); // Amplification de l'effet de rotation verticale
        
        // Effet de lévitation avec translation
        const translateZ = 25; // Légère élévation de la carte
        
        // Appliquer tous les effets de transformation
        versoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;

        // Ajustement de l'intensité de l'effet en fonction de la distance
        const opacity = 0.4 + normalizedDistance * 0.3; 
        
        // Appliquer l'opacité aux effets
        document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect').forEach(effect => {
            effect.style.opacity = opacity.toString();
        });
    }

    // La fonction resetHoloEffect a été supprimée car elle n'est plus utilisée

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

    // Suppression des écouteurs d'événements qui utilisent des fonctions supprimées

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

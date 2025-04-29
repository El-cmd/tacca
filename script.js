// Variable globale pour stocker les données de la carte obtenues via fetch
let currentCardData = null;
let isGenerating = false; // Variable pour suivre l'état de génération
let hasGeneratedCard = false; // Variable pour vérifier si une carte a déjà été générée

document.addEventListener('DOMContentLoaded', () => {
    // Définition des fonctions de gestion des effets holographiques au niveau global
    window.handleRectoHoloEffect = null;
    
    // Référence à l'overlay de chargement
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Fonction pour afficher l'animation de chargement
    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        // Désactiver le bouton d'envoi pendant le chargement
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    }
    
    // Fonction pour masquer l'animation de chargement
    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        // Réactiver le bouton d'envoi après le chargement
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        }
    }
    
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
        if (effectsContainer && cardData.effects && cardData.effects !== 'None') {
            effectsContainer.textContent = cardData.effects;
        } else if (effectsContainer) {
            // Si effects vaut 'None' ou n'existe pas, on n'affiche rien
            effectsContainer.textContent = '';
        }
        
        // Afficher la description de la carte
        const descriptionContainer = document.getElementById('card-description');
        if (descriptionContainer && cardData.description) {
            descriptionContainer.textContent = cardData.description;
        }
        

    }
    
    // Les données seront chargées uniquement après la requête fetch
    // Aucun chargement initial n'est effectué
    
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('result');
    const versoCard = document.getElementById('verso-card');
    const rectoCard = document.getElementById('recto-card');
    const versoImage = document.getElementById('verso-image');
        // Initialisation des styles des cartes
    if (rectoCard) {
        rectoCard.style.display = 'none'; // Cacher la carte recto par défaut
    }
    if (versoCard) {
        versoCard.style.display = 'block'; // Afficher la carte verso par défaut
    }
    
    // Variables pour les effets holographiques
    let holoShineAngle = 0;
    
    // Configuration des masques pour les effets holographiques
    setTimeout(() => {
        // Configuration pour la carte recto
        const rectoImage = document.getElementById('recto-image');
        if (rectoImage) {
            const rectoEffects = document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay');
            rectoEffects.forEach(effect => {
                effect.style.webkitMaskImage = 'none';
                effect.style.maskImage = 'none';
                effect.style.clipPath = 'inset(0% 0% 0% 0% round 16px)';
                effect.style.opacity = '0.5';
            });
        }
        
        // Configuration pour la carte verso
        const versoImage = document.getElementById('verso-image');
        if (versoImage) {
            const versoEffects = document.querySelectorAll('#verso-card .holo-overlay, #verso-card .cosmos-effect, #verso-card .sparkle-effect');
            versoEffects.forEach(effect => {
                effect.style.opacity = '0.5';
            });
        }
    }, 200);

    // Fonction pour envoyer une requête POST à l'API et récupérer les données de la carte
    async function fetchCardData(message) {
        try {
            // Affiche l'animation de chargement
            showLoading();
            
            // URL de l'API
            const apiUrl = 'https://n8n-jrc4.onrender.com/webhook/api/chatcard';
            
            // Préparation des données pour la requête POST
            const requestData = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            };
            
            // Affichage des données envoyées dans la console
            console.log('Données envoyées à l\'API:', { message });
            console.log('Corps de la requête JSON:', requestData.body);
            
            // Affichage d'un message de chargement dans le conteneur de résultat
            resultContainer.textContent = 'Génération de la carte en cours...';
            
            // Envoi de la requête
            const response = await fetch(apiUrl, requestData);
            
            // Vérification que la réponse est OK
            if (!response.ok) {
                throw new Error(`Erreur lors de la requête: ${response.status}`);
            }
            
            // Conversion de la réponse en JSON
            const rawData = await response.json();
            
            // Masquer l'animation de chargement car nous avons reçu les données
            hideLoading();
            
            // Affichage des données brutes dans la console
            console.log('Données reçues de l\'API (JSON brut):', JSON.stringify(rawData, null, 2));
            console.log('Données structurées complètes:', rawData);
            
            // Extraire les données de la carte de la structure de réponse
            // La réponse est un tableau contenant un objet avec une propriété 'cardData'
            let cardData = null;
            if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].cardData) {
                cardData = rawData[0].cardData;
                console.log('Données de la carte extraites:', cardData);
            }
            
            // Retourne les données de la carte extraites
            return cardData;
            
        } catch (error) {
            // Masquer l'animation de chargement en cas d'erreur
            hideLoading();
            console.error('Erreur lors de la récupération des données:', error);
            resultContainer.textContent = `Erreur: ${error.message}`;
            return null;
        }
    }

    // Fonction pour gérer la soumission du texte et le retournement de la carte
    async function handleSubmit() {
        // Si génération déjà en cours, ne rien faire
        if (isGenerating) {
            console.log('Génération déjà en cours, action ignorée');
            return;
        }
        
        // Si une carte a déjà été générée, empêcher la génération d'une nouvelle carte
        if (hasGeneratedCard) {
            console.log('Une carte a déjà été générée, nouvelle génération non autorisée');
            resultContainer.textContent = 'Une carte a déjà été générée. Actualiser la page pour générer une nouvelle carte.';
            return;
        }
        
        // Marquer la génération comme en cours
        isGenerating = true;
        
        const text = userInput.value.trim();
        
        // Débogage: Affiche l'entrée utilisateur avant traitement
        console.log('===== DÉBOGAGE INPUT =====');
        console.log('Texte saisi par l\'utilisateur:', text);
        console.log('Type de donnée:', typeof text);
        console.log('Longueur du texte:', text.length);
        console.log('==========================');
        
        // Vérification que rectoCard existe
        if (!rectoCard) {
            console.error("L'élément #recto-card n'a pas été trouvé dans le DOM");
            return;
        }
        
        if (text) {
            // Débogage: Affiche ce qui sera envoyé à l'API
            console.log('Donnée qui sera envoyée à fetchCardData:', text);
            
            // Récupération des données de la carte depuis l'API avec gestion d'erreur
            let cardData;
            try {
                cardData = await fetchCardData(text);
            } catch (error) {
                console.error('Erreur lors de la génération de la carte:', error);
                resultContainer.textContent = `Erreur: ${error.message}`;
                isGenerating = false; // Réinitialiser l'état même en cas d'erreur
                return;
            }
            
            // Si nous avons reçu des données valides
            if (cardData) {
                // Afficher le JSON complet dans la console
                console.log('JSON complet de la carte:', JSON.stringify(cardData, null, 2));
                
                // Débogage: vérifier si toutes les propriétés nécessaires sont présentes
                console.log('Vérification des données:', {
                    'imageUrl existe': !!cardData.imageUrl,
                    'nom': cardData.name,
                    'attaque': cardData.attack,
                    'santé': cardData.health,
                });
                
                // Stocker les données de la carte globalement
                currentCardData = cardData;
                
                // Charger les données dans la carte
                loadBackgroundImage(cardData);
                
                // Après aération, réinitialiser l'animation de transformation
                setTimeout(() => {
                    versoCard.style.transform = 'perspective(1000px) rotateY(0deg)';
                }, 300);
                
                // Marquer qu'une carte a été générée avec succès
                hasGeneratedCard = true;
                
                // Désactiver définitivement le bouton d'envoi
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
                submitBtn.title = 'Une carte a déjà été générée. Rafraîchissez la page pour en créer une nouvelle.';
                
                // Afficher les détails de la carte dans la console pour le débogage
                console.log('Carte générée avec succès: ', {
                    nom: cardData.name,
                    type: cardData.type,
                    classe: cardData.class,
                    attaque: cardData.attack,
                    santé: cardData.health,
                    effets: cardData.effects,
                    rareté: cardData.rarity
                });
                
                // Afficher un message de succès avec les détails
                resultContainer.textContent = `Carte générée : ${cardData.name || text} (${cardData.type || 'Type inconnu'})`;
                
                // Afficher plus de détails dans la console pour débogage
                console.log('Carte générée avec succès:', {
                    nom: cardData.name,
                    type: cardData.type,
                    classe: cardData.class,
                    attaque: cardData.attack,
                    santé: cardData.health,
                    effets: cardData.effects,
                    rareté: cardData.rarity
                });
            }
            
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
                    
                    // Supprimer la classe d'animation après qu'elle soit terminée
                    setTimeout(() => {
                        rectoCard.classList.remove('flip-in');
                    }, 600);
                }, 600);
                
                // Activer les effets holographiques sur la carte recto
                setTimeout(() => {
                    // S'assurer que rectoCard est disponible
                    if (rectoCard) {

                        
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

                        });
                        
                        rectoCard.addEventListener('mouseleave', () => {
                            rectoCard.classList.remove('active');
                            rectoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                            
                            // Réinitialiser l'opacité des effets
                            document.querySelectorAll('#recto-card .holo-overlay, #recto-card .sparkle-overlay').forEach(effect => {
                                effect.style.opacity = '0.2';
                            });

                        });
                    } else {
                        console.error("La carte recto n'a pas été trouvée lors de la configuration des effets holographiques");
                    }
                }, 100);
                
            } else {e
                // Animer la carte recto avec l'effet de sortie
                rectoCard.classList.add('flip-out');
                
                // Attendre que l'animation de sortie soit terminée avant de changer l'image
                setTimeout(() => {
                    // Cacher la carte recto et afficher la carte verso
                    rectoCard.style.display = 'none';
                    versoCard.style.display = 'block';
                    
                    // Ajouter l'animation d'entrée sur la carte verso
                    versoCard.classList.add('flip-in');

                    
                    // Supprimer la classe d'animation après qu'elle soit terminée
                    setTimeout(() => {
                        versoCard.classList.remove('flip-in');
                    }, 600);
                }, 600);
            }
            

            
            // Effacer le champ d'entrée
            userInput.value = '';
        } else {
            resultContainer.textContent = 'Veuillez entrer un nom de carte avant d\'envoyer.';
        }
        
        // Redonner le focus au champ d'entrée
        userInput.focus();
        
        // Réinitialiser l'état de génération
        isGenerating = false;
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
        
    }

    // Focus initial sur le champ d'entrée
    userInput.focus();
});

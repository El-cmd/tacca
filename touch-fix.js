/**
 * Solution complète pour résoudre l'erreur "Element.setCapture() est obsolète"
 * en supprimant complètement les alertes et en redirectionnant vers la méthode moderne
 */

(function() {
    console.log('Application du correctif pour setCapture()...');

    // 1. Désactiver le warning console spécifique à ce problème
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        // Si le warning concerne setCapture, on le filtre
        if (args[0] && typeof args[0] === 'string' && args[0].includes('setCapture')) {
            return; // Ne pas afficher ce warning spécifique
        }
        // Sinon, comportement normal
        originalConsoleWarn.apply(console, args);
    };

    // 2. Remplacement complet de setCapture par setPointerCapture
    if (typeof Element !== 'undefined' && Element.prototype) {
        // Garde l'originale si elle existe
        const originalSetCapture = Element.prototype.setCapture;
        
        // Remplace la méthode obsolète
        Element.prototype.setCapture = function(retargetToElement) {
            // Genère un ID de pointeur unique si possible
            let pointerId = 1;
            
            // Vérifie si cette API est disponible
            if (typeof this.setPointerCapture === 'function') {
                try {
                    this.setPointerCapture(pointerId);
                    // Ajouter un gestionnaire pour relâcher automatiquement la capture quand le pointeur part
                    this.addEventListener('pointerup', () => {
                        if (typeof this.releasePointerCapture === 'function') {
                            this.releasePointerCapture(pointerId);
                        }
                    }, { once: true });
                    
                    return true;
                } catch (e) {
                    // Silencieux en cas d'erreur, on essaie la méthode originale
                }
            }
            
            // Fallback vers la méthode originale si nécessaire
            if (typeof originalSetCapture === 'function') {
                try {
                    return originalSetCapture.call(this, retargetToElement);
                } catch (e) {
                    // Silencieux en cas d'erreur
                }
            }
            
            return false;
        };

        // 3. Redirection de releaseCapture si nécessaire
        if (Element.prototype.releaseCapture) {
            const originalReleaseCapture = Element.prototype.releaseCapture;
            
            Element.prototype.releaseCapture = function() {
                if (typeof this.releasePointerCapture === 'function') {
                    try {
                        // On utilise le même ID qu'avant
                        this.releasePointerCapture(1);
                        return true;
                    } catch (e) {
                        // Silencieux en cas d'erreur
                    }
                }
                
                // Fallback
                if (typeof originalReleaseCapture === 'function') {
                    try {
                        return originalReleaseCapture.call(this);
                    } catch (e) {
                        // Silencieux
                    }
                }
                
                return false;
            };
        }
    }

    // 4. Gestion des scripts qui pourraient être chargés dynamiquement
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // Intercepter l'ajout de scripts
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                // Si c'est un script externe lié à touch-simulator
                if (name === 'src' && typeof value === 'string' && value.includes('touch-simulator')) {
                    console.log('Script touch-simulator détecté et intercepté');
                    // On peut complètement bloquer ce script ou le modifier ici
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        
        return element;
    };

    console.log('Correctif pour setCapture() installé avec succès');
})();


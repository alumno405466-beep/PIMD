/**
 * ROUTE-FIX.JS - VERSIÓN DEFINITIVA
 * Corrige rutas y MANTIENE las imágenes visibles
 */

(function() {
    'use strict';
    
    console.log('🔧 RouteFix: Iniciando corrección permanente...');
    
    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        debug: true, // Muestra mensajes en consola
        refreshInterval: 500, // Revisar cada 500ms (media segundo)
        maxAttempts: 20 // Máximo de intentos (10 segundos total)
    };
    
    // ===== DETECTAR ENTORNO =====
    const isGitHubPages = window.location.hostname.includes('github.io');
    let repoName = '';
    
    if (isGitHubPages) {
        const pathParts = window.location.pathname.split('/');
        repoName = pathParts[1] || '';
        if (CONFIG.debug) console.log(`📦 GitHub Pages detectado - Repositorio: ${repoName}`);
    }
    
    // ===== FUNCIÓN PRINCIPAL DE CORRECCIÓN =====
    function fixPath(path) {
        if (!path || typeof path !== 'string') return path;
        
        // No modificar URLs externas
        if (path.startsWith('http://') || path.startsWith('https://') || 
            path.startsWith('//') || path.startsWith('data:')) {
            return path;
        }
        
        let fixedPath = path;
        
        // CASO 1: Quitar / inicial en GitHub Pages
        if (isGitHubPages && fixedPath.startsWith('/')) {
            fixedPath = fixedPath.substring(1);
            if (CONFIG.debug) console.log(`🔧 Quitando / inicial: ${path} → ${fixedPath}`);
        }
        
        // CASO 2: Asegurar que no tenga / repetidas
        fixedPath = fixedPath.replace(/\/+/g, '/');
        
        return fixedPath;
    }
    
    // ===== CORREGIR Y BLOQUEAR UNA IMAGEN =====
    function fixAndLockImage(img) {
        if (!img || img.hasAttribute('data-fixed')) return false; // Ya está corregida
        
        const originalSrc = img.getAttribute('src');
        if (!originalSrc) return false;
        
        const fixedSrc = fixPath(originalSrc);
        
        if (fixedSrc !== originalSrc) {
            // CORRECCIÓN 1: Cambiar el src
            img.src = fixedSrc;
            
            // CORRECCIÓN 2: Marcar como corregida
            img.setAttribute('data-fixed', 'true');
            img.setAttribute('data-original-src', originalSrc);
            
            // CORRECCIÓN 3: FORZAR RECARGA
            img.onerror = function() {
                console.warn(`⚠️ Error cargando: ${fixedSrc}, reintentando...`);
                // Último intento: quitar ./ si lo tiene
                if (fixedSrc.startsWith('./')) {
                    this.src = fixedSrc.substring(2);
                }
            };
            
            // CORRECCIÓN 4: Bloquear cambios futuros
            Object.defineProperty(img, 'src', {
                set: function(value) {
                    console.warn('🚫 Intento de cambiar src bloqueado');
                    // No permitir cambios
                },
                get: function() {
                    return fixedSrc;
                },
                configurable: false
            });
            
            if (CONFIG.debug) console.log(`✅ Imagen fijada: ${originalSrc} → ${fixedSrc}`);
            return true;
        }
        
        img.setAttribute('data-fixed', 'true');
        return false;
    }
    
    // ===== CORREGIR SPRITES =====
    function fixAndLockSprite(use) {
        if (use.hasAttribute('data-fixed')) return false;
        
        const originalHref = use.getAttribute('xlink:href') || use.getAttribute('href');
        if (!originalHref) return false;
        
        const fixedHref = fixPath(originalHref);
        
        if (fixedHref !== originalHref) {
            use.setAttribute('xlink:href', fixedHref);
            use.setAttribute('href', fixedHref);
            use.setAttribute('data-fixed', 'true');
            
            if (CONFIG.debug) console.log(`✅ Sprite fijado: ${originalHref} → ${fixedHref}`);
            return true;
        }
        
        use.setAttribute('data-fixed', 'true');
        return false;
    }
    
    // ===== ESCANEAR Y CORREGIR TODO =====
    function scanAndFix() {
        let changes = 0;
        
        // 1. Imágenes
        document.querySelectorAll('img:not([data-fixed])').forEach(img => {
            if (fixAndLockImage(img)) changes++;
        });
        
        // 2. Sprites
        document.querySelectorAll('use:not([data-fixed])').forEach(use => {
            if (fixAndLockSprite(use)) changes++;
        });
        
        // 3. CSS Links
        document.querySelectorAll('link[rel="stylesheet"]:not([data-fixed])').forEach(link => {
            const originalHref = link.getAttribute('href');
            if (!originalHref) return;
            
            const fixedHref = fixPath(originalHref);
            if (fixedHref !== originalHref) {
                link.href = fixedHref;
                link.setAttribute('data-fixed', 'true');
                changes++;
            }
        });
        
        // 4. Scripts
        document.querySelectorAll('script[src]:not([data-fixed])').forEach(script => {
            const originalSrc = script.getAttribute('src');
            if (!originalSrc) return;
            
            const fixedSrc = fixPath(originalSrc);
            if (fixedSrc !== originalSrc) {
                script.src = fixedSrc;
                script.setAttribute('data-fixed', 'true');
                changes++;
            }
        });
        
        return changes;
    }
    
    // ===== SISTEMA DE CORRECCIÓN CONTINUA =====
    let attempts = 0;
    let fixInterval;
    let totalFixes = 0;
    
    function continuousFix() {
        const changes = scanAndFix();
        totalFixes += changes;
        
        if (changes > 0) {
            console.log(`🔄 Corrección continua: ${changes} elementos arreglados (total: ${totalFixes})`);
        }
        
        attempts++;
        
        // Parar después de varios intentos sin cambios
        if (changes === 0 && attempts > 5) {
            clearInterval(fixInterval);
            console.log(`✅ Corrección completada. Total definitivo: ${totalFixes} elementos arreglados`);
            
            // Mostrar estadísticas finales
            const images = document.querySelectorAll('img[data-fixed]');
            const sprites = document.querySelectorAll('use[data-fixed]');
            console.log(`📊 Resumen final: ${images.length} imágenes, ${sprites.length} sprites`);
        }
    }
    
    // ===== OBSERVADOR DE MUTACIONES (respaldo) =====
    const observer = new MutationObserver(function(mutations) {
        let needsFix = false;
        
        mutations.forEach(mutation => {
            // Si se añadieron nuevos nodos
            if (mutation.addedNodes.length > 0) {
                needsFix = true;
            }
            
            // Si cambiaron atributos de imágenes
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'src' || mutation.attributeName === 'href')) {
                const target = mutation.target;
                if (target.nodeName === 'IMG' || target.nodeName === 'use') {
                    target.removeAttribute('data-fixed'); // Permitir recorrección
                    needsFix = true;
                }
            }
        });
        
        if (needsFix) {
            scanAndFix();
        }
    });
    
    // Empezar a observar
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href']
    });
    
    // ===== INICIAR =====
    function init() {
        console.log('🚀 RouteFix iniciado - Modo: CORRECCIÓN PERMANENTE');
        
        // Corrección inmediata
        setTimeout(() => {
            const initialFixes = scanAndFix();
            console.log(`⚡ Corrección inicial: ${initialFixes} elementos`);
        }, 100);
        
        // Corrección continua
        fixInterval = setInterval(continuousFix, CONFIG.refreshInterval);
        
        // Corrección cuando la página termine de cargar
        window.addEventListener('load', function() {
            console.log('📄 Página completamente cargada, revisando...');
            setTimeout(() => {
                const finalFixes = scanAndFix();
                console.log(`🏁 Corrección final: ${finalFixes} elementos`);
            }, 500);
        });
        
        // Prevenir que otros scripts sobrescriban
        document.addEventListener('DOMContentLoaded', function() {
            // Proteger imágenes existentes
            document.querySelectorAll('img').forEach(img => {
                if (!img.hasAttribute('data-fixed')) {
                    fixAndLockImage(img);
                }
            });
        });
    }
    
    // Arrancar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
/**
 * ROUTE-FIX.JS
 * Corrige automáticamente todas las rutas de imágenes y recursos
 * para que funcionen correctamente en GitHub Pages
 * 
 * Se ejecuta automáticamente al cargar la página
 */

(function() {
    'use strict';
    
    console.log('🔧 RouteFix: Corrigiendo rutas automáticamente...');
    
    // ===== 1. DETECTAR ENTORNO =====
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';
    
    // Obtener el nombre del repositorio (si estamos en GitHub Pages)
    let repoName = '';
    if (isGitHubPages) {
        // Ejemplo: https://usuario.github.io/repo-name/
        const pathParts = window.location.pathname.split('/');
        repoName = pathParts[1] || ''; // El primer segmento después del dominio
        console.log(`📦 Repositorio detectado: ${repoName}`);
    }
    
    // ===== 2. FUNCIÓN PARA CORREGIR UNA RUTA =====
    function fixPath(path) {
        if (!path || typeof path !== 'string') return path;
        
        // No modificar rutas externas (http, https, //)
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
            return path;
        }
        
        // No modificar rutas de datos (data:)
        if (path.startsWith('data:')) {
            return path;
        }
        
        let fixedPath = path;
        
        // CASO 1: Quitar barra inicial en GitHub Pages
        if (isGitHubPages && fixedPath.startsWith('/')) {
            // Si hay nombre de repositorio, lo añadimos
            if (repoName) {
                fixedPath = '/' + repoName + fixedPath;
            } else {
                fixedPath = fixedPath.substring(1); // Quitar la primera barra
            }
        }
        
        // CASO 2: Asegurar que las rutas relativas tengan ./
        if (!fixedPath.startsWith('./') && !fixedPath.startsWith('/') && !fixedPath.startsWith('http')) {
            // Es una ruta relativa sin ./ - la dejamos como está
            // (ya debería funcionar)
        }
        
        return fixedPath;
    }
    
    // ===== 3. CORREGIR TODOS LOS <img> =====
    function fixImages() {
        const images = document.querySelectorAll('img');
        let count = 0;
        
        images.forEach(img => {
            const originalSrc = img.getAttribute('src');
            if (!originalSrc) return;
            
            const fixedSrc = fixPath(originalSrc);
            if (fixedSrc !== originalSrc) {
                img.src = fixedSrc;
                count++;
                console.log(`🖼️ Imagen corregida: ${originalSrc} → ${fixedSrc}`);
            }
        });
        
        if (count > 0) {
            console.log(`✅ ${count} imágenes corregidas`);
        }
        return count;
    }
    
    // ===== 4. CORREGIR SPRITES SVG =====
    function fixSprites() {
        const uses = document.querySelectorAll('use');
        let count = 0;
        
        uses.forEach(use => {
            const originalHref = use.getAttribute('xlink:href') || use.getAttribute('href');
            if (!originalHref) return;
            
            const fixedHref = fixPath(originalHref);
            if (fixedHref !== originalHref) {
                use.setAttribute('xlink:href', fixedHref);
                use.setAttribute('href', fixedHref); // Para navegadores modernos
                count++;
                console.log(`🎨 Sprite corregido: ${originalHref} → ${fixedHref}`);
            }
        });
        
        if (count > 0) {
            console.log(`✅ ${count} sprites corregidos`);
        }
        return count;
    }
    
    // ===== 5. CORREGIR LINKS CSS =====
    function fixCSSLinks() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        let count = 0;
        
        links.forEach(link => {
            const originalHref = link.getAttribute('href');
            if (!originalHref) return;
            
            const fixedHref = fixPath(originalHref);
            if (fixedHref !== originalHref) {
                link.href = fixedHref;
                count++;
                console.log(`📄 CSS corregido: ${originalHref} → ${fixedHref}`);
            }
        });
        
        return count;
    }
    
    // ===== 6. CORREGIR SCRIPTS =====
    function fixScripts() {
        const scripts = document.querySelectorAll('script[src]');
        let count = 0;
        
        scripts.forEach(script => {
            const originalSrc = script.getAttribute('src');
            if (!originalSrc) return;
            
            const fixedSrc = fixPath(originalSrc);
            if (fixedSrc !== originalSrc) {
                script.src = fixedSrc;
                count++;
                console.log(`📜 Script corregido: ${originalSrc} → ${fixedSrc}`);
            }
        });
        
        return count;
    }
    
    // ===== 7. CORREGIR FONDOS EN LÍNEA (style="background-image") =====
    function fixInlineBackgrounds() {
        const elements = document.querySelectorAll('[style*="background-image"]');
        let count = 0;
        
        elements.forEach(el => {
            const style = el.getAttribute('style');
            if (!style) return;
            
            // Buscar url('...') o url("...") o url(...)
            const urlMatch = style.match(/url\(['"]?([^'"()]+)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                const originalUrl = urlMatch[1];
                const fixedUrl = fixPath(originalUrl);
                
                if (fixedUrl !== originalUrl) {
                    const newStyle = style.replace(originalUrl, fixedUrl);
                    el.setAttribute('style', newStyle);
                    count++;
                    console.log(`🎨 Background corregido: ${originalUrl} → ${fixedUrl}`);
                }
            }
        });
        
        return count;
    }
    
    // ===== 8. EJECUTAR TODAS LAS CORRECCIONES =====
    function fixEverything() {
        console.log('🔧 Iniciando corrección de rutas...');
        
        const imgCount = fixImages();
        const spriteCount = fixSprites();
        const cssCount = fixCSSLinks();
        const scriptCount = fixScripts();
        const bgCount = fixInlineBackgrounds();
        
        const total = imgCount + spriteCount + cssCount + scriptCount + bgCount;
        
        if (total > 0) {
            console.log(`🎉 ¡Corrección completada! ${total} elementos arreglados.`);
            
            // Mostrar resumen
            console.table({
                'Imágenes': imgCount,
                'Sprites': spriteCount,
                'CSS': cssCount,
                'Scripts': scriptCount,
                'Backgrounds': bgCount,
                'TOTAL': total
            });
        } else {
            console.log('✨ No fue necesario corregir nada (las rutas ya son correctas)');
        }
        
        // Mostrar información del entorno
        console.log('🌐 Entorno:', isGitHubPages ? 'GitHub Pages' : (isLocal ? 'Local' : 'Otro'));
        if (isGitHubPages && repoName) {
            console.log('📁 Repositorio:', repoName);
        }
    }
    
    // ===== 9. EJECUTAR CUANDO EL DOM ESTÉ LISTO =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixEverything);
    } else {
        // DOM ya está cargado
        fixEverything();
    }
    
    // ===== 10. OBSERVAR CAMBIOS DINÁMICOS (opcional) =====
    // Útil para imágenes que se añaden después con JavaScript
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Pequeño retraso para que los elementos se añadan completamente
                setTimeout(function() {
                    fixImages();
                    fixSprites();
                    fixInlineBackgrounds();
                }, 100);
            }
        });
    });
    
    // Observar cambios en el body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
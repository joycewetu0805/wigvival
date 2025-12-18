#!/bin/bash

echo "🚀 Installation de WIGVIVAL - Salon Premium"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm détecté: $(npm --version)"

# Créer la structure de dossiers
echo "📁 Création de la structure de dossiers..."
mkdir -p public/images/{services,gallery,stylists}
mkdir -p src/{components,pages,hooks,utils,styles,data,animations}
mkdir -p src/components/{ui,layout,marketing,seo,optimized}
mkdir -p src/pages/admin

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérifier l'installation
echo "🔍 Vérification de l'installation..."
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    echo "✅ Installation réussie!"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

# Configurer les images placeholder
echo "🖼️ Configuration des images placeholder..."
cat > public/images/README.md << 'EOF'
# Images WIGVIVAL

Placez vos images dans les dossiers correspondants:

## services/
- resserage.jpg
- coiffure.jpg
- classic-restauration.jpg
- silkpress.jpg
- redefinition.jpg
- customisation.jpg
- teinture.jpg
- luxury-restauration.jpg

## gallery/
- plucking-1.jpg
- bleaching-1.jpg
- restauration-1.jpg
- silkpress-1.jpg
- teinture-1.jpg
- resserage-1.jpg
- coiffure-1.jpg
- luxury-1.jpg

## stylists/
- marie.jpg
- sophie.jpg
- julie.jpg

## Pour le développement, utilisez des placeholders:
- https://placehold.co/600x400/0f172a/d4af37
- https://placehold.co/400x400/0f172a/d4af37
EOF

# Créer un script de démarrage
echo "⚡ Création du script de démarrage..."
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Démarrage de WIGVIVAL..."
npm run dev
EOF
chmod +x start.sh

# Créer un script de build
echo "🏗️ Création du script de build..."
cat > build.sh << 'EOF'
#!/bin/bash
echo "🏗️ Construction de l'application..."
npm run build
echo "✅ Build terminé! Les fichiers sont dans le dossier 'dist'"
EOF
chmod +x build.sh

echo "🎉 Installation terminée avec succès!"
echo ""
echo "📋 Commandes disponibles:"
echo "   ./start.sh     - Démarrer le serveur de développement"
echo "   ./build.sh     - Construire pour la production"
echo "   npm run dev    - Démarrer en mode développement"
echo "   npm run build  - Construire pour production"
echo "   npm run preview- Prévisualiser la production"
echo ""
echo "🌐 L'application sera disponible sur: http://localhost:3000"
echo ""
echo "💡 Pour une optimisation maximale:"
echo "   1. Ajoutez vos propres images dans public/images/"
echo "   2. Configurez vos variables d'environnement"
echo "   3. Personnalisez les couleurs dans tailwind.config.js"
echo "   4. Testez sur différents appareils"
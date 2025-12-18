# 🚀 Checklist de Déploiement WIGVIVAL

## 📋 Pré-déploiement

### ✅ Configuration
- [ ] Variables d'environnement configurées (.env)
- [ ] Base de données configurée (si backend)
- [ ] SMTP configuré pour les emails
- [ ] Clés API (Stripe, Google Maps, etc.)
- [ ] Domaine configuré

### ✅ Optimisations
- [ ] Images optimisées (WebP, compression)
- [ ] Fonts préchargées
- [ ] Code minifié et tree-shaken
- [ ] Bundle analysé pour la taille
- [ ] Lazy loading configuré

### ✅ Tests
- [ ] Tests responsive sur mobile/tablette/desktop
- [ ] Tests de performance (Lighthouse)
- [ ] Tests de navigation
- [ ] Tests de formulaires
- [ ] Tests cross-browser
- [ ] Tests d'accessibilité (WCAG)

## 🌐 Déploiement Frontend (Vercel)

### ✅ Configuration Vercel
```bash
# Variables d'environnement
VITE_API_URL=https://api.wigvival.ca
VITE_SITE_URL=https://wigvival.ca
VITE_GA_ID=UA-XXXXXX-X
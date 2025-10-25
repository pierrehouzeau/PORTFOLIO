# Portfolio — Pierre Houzeau

Accès: https://pierrehouzeau.github.io/PORTFOLIO/

Site statique (HTML/CSS/JS) avec un îlot React pour quelques effets (barre de scroll, curseur). Sections: Accueil, Projets (cartes + modale), Compétences (filtre multi), Contact.

## Notes de design (UI/UX)
- Typographies: Inter (texte) et JetBrains Mono (éléments UI/tech).
- Icônes: monochromes (Simple Icons/Devicon) pour la cohérence visuelle; couleur neutralisée (grayscale).
- Mouvement: animations légères; respect de `prefers-reduced-motion`.
- Accessibilité: focus visible, contrastes, navigation clavier; modale avec focus trap + fermeture Échap.
- Responsive: grilles à colonnes fixes (desktop → mobile) pour éviter l’étirement; cases de compétences à taille fixe avec paliers.
- Données projets: résumé concis + “insight” (pourquoi/enseignement) + icônes de stack.

## Développement
- Démarrer un serveur statique (ex: Live Server/VSC) à la racine.
- Les données des projets sont dans `assets/data/projects.json`.
- Les scripts front sont sous `assets/js/`.
- L’îlot React (barre/curseur) est buildé via Vite dans `react/` (optionnel en prod). Le site charge le bundle compilé `react/dist/assets/bar.js`.

## Déploiement
- GitHub Pages (recommandé pour ce repo statique):
  1. Settings → Pages → Build and deployment → Deploy from a branch
  2. Branch: `main`, Folder: `/ (root)`
  3. Sauvegarder; l’URL est visible en haut de la page Pages
- Alternative: Netlify (drag‑and‑drop du dossier root, ou connect repo)

## Licence
Usage académique/démonstration.

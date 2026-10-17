# abidi-site

Site personnel de Mouhamed Ali Abidi. React 18 + TypeScript + Vite, sans autre dépendance.

- Nom et portrait en particules (processus d'Ornstein-Uhlenbeck)
- Empreinte brownienne générée à partir d'un nom
- Parcours en saut-diffusion (modèle de Merton)
- Pricer Black-Scholes avec vérification Monte Carlo
- Tableau interactif du nombre dérivé
- Français / anglais, terminal caché (touche `/`), mode recruteur
- Version ordinateur et téléphone (barre de navigation en bas sur mobile)

## Lancer en local

Il faut Node.js 18 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # site prêt à déployer dans dist/
```

## Modifier le contenu

Tous les textes (FR et EN), les liens et les expériences sont dans **`src/content.ts`**.
La photo est `src/assets/portrait.jpg` (format 4:5, fond clair et uni pour un bel effet de particules).

| Fichier | Rôle |
|---|---|
| `src/content.ts` | textes FR/EN, liens, expériences, projets |
| `src/lib/heroEngine.ts` | animation du nom et du portrait |
| `src/lib/finance.ts` | Black-Scholes, grecques, Monte Carlo |
| `src/components/Terminal.tsx` | commandes du terminal |
| `src/components/Recruiter.tsx` | mode recruteur |
| `src/styles.css` | couleurs (tokens en haut du fichier), mise en page, mobile |

## Mettre en ligne sur Cloudflare Pages

1. Crée un dépôt GitHub (par exemple `abidi-site`) et pousse ce dossier :
   ```bash
   git init && git add . && git commit -m "Site personnel"
   git branch -M main
   git remote add origin https://github.com/abidimouhamedali2-ops/abidi-site.git
   git push -u origin main
   ```
2. Dans le tableau de bord Cloudflare : **Workers & Pages → Create → Pages → Connect to Git**, puis choisis le dépôt.
3. Réglages de build :
   - Build command : `npm run build`
   - Build output directory : `dist`
4. Lance le déploiement. Le site est en ligne sur `abidi-site.pages.dev` (le nom dépend du projet).
5. Chaque `git push` sur `main` redéploie automatiquement.

Les intitulés exacts du tableau de bord Cloudflare peuvent varier légèrement.

## Brancher un nom de domaine

1. Achète un domaine, par exemple `abidi.dev` ou `mouhamedali.dev` (Cloudflare Registrar, ou un registrar agréé pour un `.tn`).
2. Dans le projet Pages : **Custom domains → Set up a custom domain**, saisis le domaine et suis les instructions DNS.
3. Le certificat HTTPS est créé automatiquement.

## Version « un seul fichier »

`npm run build:single` produit `dist-single/index.html`, avec tout (JS, CSS, photo) dans un seul fichier.
Pratique pour un aperçu ou un envoi par email.

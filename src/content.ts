// All copy for the site, in French and English. Both objects share one shape (Dict).
// Strings ending in "Html" may contain a little inline markup (<b>, <a>).

export const LINKS = {
  email: 'abidimouhamedali2@gmail.com',
  phone: '(+216) 96 717 482',
  linkedin: 'https://linkedin.com/in/abidi-mouhamed-ali',
  github: 'https://github.com/abidimouhamedali2-ops',
  mytrainia: 'https://mytrainia.fr/',
  onetech: 'https://www.onetech-bs.com/',
  ztc: 'https://ztc.tn/',
  esprit: 'https://www.esprit.tn/',
  polytech: 'https://www.universitecentrale.net/ecole/ecole-centrale-superieure-privee-polytechnique',
  enactus: 'https://www.instagram.com/enactus_ucentrale/',
}

export const ME = 'Mouhamed Ali Abidi'

const ext = (href: string, text: string) =>
  `<a class="ext" href="${href}" target="_blank" rel="noopener">${text}</a>`

export interface Experience {
  company: string; url: string; role: string; when: string; where: string
  desc: string; bullets: string[]; tags: string[]
}
export interface Project {
  name: string; when: string; kind: string; sub: string; desc: string
  figStrong: string; figText: string; tags: string[]
}

const TAGS = {
  mytrainia: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Stripe', 'Mistral AI', 'Radix UI', 'Framer Motion', 'Zod', 'KaTeX', 'Vitest', 'Playwright'],
  onetech: ['Spring Boot 3.3', 'Angular 18+', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'JWT', 'YOLOv8', 'XGBoost'],
  ztc: ['Django', 'DRF', 'React', 'Vite', 'Tailwind CSS', 'Shadcn/ui', 'JWT', 'Cloudinary'],
  kredia: ['Angular', 'TypeScript', 'RxJS', 'Java 17', 'Spring Boot', 'Spring Security', 'MySQL'],
  fitmind: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'DRF', 'PostgreSQL', 'GPT-4o'],
}

const TICKER: [string, string][] = [
  ['ABIDI.MA', '▲ full-stack'], ['KREDIA', '▲ micro-finance'], ['ONETECH', '▲ IA'], ['MYTRAINIA', '▲ Paris'],
  ['YOLOv8', '▲ vision'], ['XGBOOST', '▲ scoring'], ['SPRING', '▲ 3.3'], ['NEXT.JS', '▲ app'], ['ITÔ', '▲ dW'], ['ESPRIT', '▲ ingé'],
]

export const fr = {
  ticker: TICKER,
  top: {
    live: 'Séance ouverte · Tunisie',
    nav: [['empreinte', 'Empreinte'], ['trajectoire', 'Trajectoire'], ['pricer', 'Pricer'], ['experience', 'Expérience'], ['projets', 'Projets'], ['contact', 'Contact']] as [string, string][],
    langLabel: 'Langue',
    terminal: 'Terminal',
  },
  hero: {
    eyebrowL: 'Full-Stack · Fintech · IA',
    eyebrowR: 'Coté en continu depuis 2018',
    hint: 'Passe la souris sur mon nom ou mon portrait : tu ajoutes de la volatilité.',
    hintTouch: 'Touche mon nom ou mon portrait : tu ajoutes de la volatilité.',
    roleStrong: 'Ingénieur Full-Stack, Fintech & IA.',
    role: " Je transforme des problèmes complexes en produits concrets, de l'architecture back-end jusqu'au dernier pixel.",
    recruiter: 'Mode recruteur · 30 s',
    terminal: 'Ouvrir le terminal',
    ouText: "Chaque point de mon nom suit un processus d'Ornstein-Uhlenbeck : il est secoué au hasard, puis revient toujours à sa place.",
    spread: 'écart moyen',
    shock: 'Choc de volatilité',
    calm: 'Retour au calme',
    portrait: 'Portrait',
    processes: 'processus OU',
    sharp: 'Photo nette',
    dots: 'Version particules',
    photoAlt: 'Portrait de Mouhamed Ali Abidi',
  },
  print: {
    label: 'Empreinte stochastique',
    aside: 'Un nom, une graine, quinze ponts browniens refermés en anneaux.',
    h2: 'Mon empreinte, et la tienne',
    lede: "Chaque nom produit une empreinte unique et toujours identique : le nom devient la graine d'un générateur aléatoire, qui trace des ponts browniens en anneaux. Écris ton nom pour générer la tienne et mesurer notre corrélation. Quel que soit le résultat, il y a une bonne façon de travailler ensemble.",
    you: 'Toi',
    yourName: 'Ton nom',
    def: 'Recruteur curieux',
    ariaMine: 'Empreinte brownienne de Mouhamed Ali Abidi',
    ariaYours: 'Ton empreinte brownienne',
    same: 'Même nom, même graine, même empreinte : une corrélation parfaite. Ravi de te rencontrer.',
    zero: "Nos parcours sont indépendants, et c'est une force : en finance, on diversifie un portefeuille avec des actifs différents. Ensemble, on couvre plus de terrain.",
    pos: 'Nos trajectoires évoluent dans le même sens. On partage une direction : de quoi bien travailler ensemble.',
    neg: "Quand l'un monte, l'autre équilibre : c'est le principe d'une bonne couverture. Nos profils se complètent.",
  },
  traj: {
    label: 'Trajectoire',
    aside: 'Modèle de Merton : une diffusion continue, plus des sauts à chaque étape.',
    h2: 'Un parcours en saut-diffusion',
    lede: "Entre deux étapes, je progresse en continu. À chaque nouvelle expérience, la courbe fait un saut. Survole un numéro pour voir l'étape correspondante.",
    today: "aujourd'hui",
    projection: 'projection',
    swipe: 'Fais glisser le graphique vers la gauche pour voir 2026 →',
    aria: 'Trajectoire de carrière de 2018 à aujourd’hui, modélisée en saut-diffusion',
    events: [
      'Activité commerciale indépendante', 'Baccalauréat Mathématiques', 'Prépa MP · École Polytechnique de Tunis',
      'Vice-président et chef de projet · Enactus', 'Formateur en mathématiques', 'Cycle ingénieur · ESPRIT',
      'Stage · Zero Threat Corporation', 'FitMind AI', 'Kredia', 'Stage IA · OneTech', 'Stage · MyTrainia',
    ],
  },
  pricer: {
    label: 'Pricer',
    aside: 'Black-Scholes en formule fermée, vérifié par simulation de Monte Carlo.',
    h2: 'Une option sur mon potentiel',
    lede: "Un call européen donne le droit, sans l'obligation, d'acheter un actif au prix K à la date T. Voici le call sur ABIDI.MA. Règle les paramètres : le prix se recalcule avec Black-Scholes, et tu peux le vérifier par simulation.",
    s0: "Valeur aujourd'hui",
    K: "Prix d'exercice K", T: 'Échéance T', v: 'Volatilité σ', r: 'Taux sans risque r',
    year: 'an', years: 'ans',
    price: 'Prix du call',
    greeks: ['Δ delta', 'Γ gamma', 'ν vega', 'Θ theta / jour'],
    payoff: "Gain à l'échéance", value: "Valeur aujourd'hui",
    aria: "Valeur du call en fonction du prix de l'actif",
    readHtml: (K: number, p: number, d: string) =>
      `Lecture : la probabilité que ABIDI.MA dépasse ${K} à l'échéance est de <b>${p} %</b> (en probabilité risque-neutre). Avec un delta de ${d}, chaque point gagné par l'actif ajoute environ ${d} point à l'option.`,
    mc: 'Vérifier par Monte Carlo',
    mcIdle: '20 000 trajectoires simulées, comparées à la formule.',
    mcHtml: (m: string, ci: string, ref: string, gap: string) =>
      `Monte Carlo : <b>${m}</b> ± ${ci} · Black-Scholes : <b>${ref}</b> · écart ${gap} %`,
  },
  exp: {
    label: 'Expérience',
    aside: 'Stages en entreprise, du plus récent au plus ancien.',
    h2: 'Expérience professionnelle',
    items: [
      {
        company: 'MyTrainia', url: LINKS.mytrainia, role: 'Stagiaire Développeur Web', when: '10/2026 → 11/2026', where: 'Paris, France',
        desc: "Plateforme EdTech propulsée par l'IA, dédiée à la réussite en mathématiques. Déployée en production sur Cloudflare, avec un environnement de staging distinct.",
        bullets: [
          'Fonctionnalités full-stack (React, Supabase Auth et Edge Functions) intégrant IA générative, paiement Stripe et rendu mathématique KaTeX.',
          'Workflow professionnel : branches main/prod, pull requests, tests unitaires (Vitest) et end-to-end (Playwright).',
        ],
        tags: TAGS.mytrainia,
      },
      {
        company: 'OneTech Business Solutions', url: LINKS.onetech, role: 'Stagiaire Développeur Full-Stack & IA', when: '07/2026 → 09/2026', where: 'Tunis',
        desc: "Plateforme intelligente de gestion des sinistres d'assurance, qui automatise l'analyse des dossiers et la prise de décision pour trois profils : client, expert et agent.",
        bullets: [
          "Intégration de modèles d'IA (computer vision avec YOLOv8, XGBoost) pour évaluer les sinistres et réduire le traitement manuel.",
          'Architecture multi-rôles avec API sécurisées, pour fiabiliser chaque décision du processus.',
        ],
        tags: TAGS.onetech,
      },
      {
        company: 'Zero Threat Corporation', url: LINKS.ztc, role: 'Stagiaire Développeur Full-Stack', when: '06/2025 → 08/2025', where: 'Tunis',
        desc: 'Système de gestion des tickets de support : les employés soumettent leurs demandes, les administrateurs les traitent depuis une interface moderne et responsive.',
        bullets: [
          "Authentification sécurisée par rôles et gestion complète du cycle de vie d'un ticket.",
          'Dashboard interactif avec statistiques, filtrage avancé et gestion des pièces jointes.',
        ],
        tags: TAGS.ztc,
      },
    ] as Experience[],
  },
  proj: {
    label: 'Projets',
    aside: 'Deux produits conçus de bout en bout.',
    h2: 'Projets',
    items: [
      {
        name: 'Kredia', when: '01/2026 → 05/2026', kind: 'Micro-finance', sub: 'Plateforme intelligente de micro-finance',
        desc: "Démocratiser l'accès au crédit pour les populations sous-bancarisées. Simulation de crédit, demande de prêt en ligne, suivi des remboursements et espace investissement. Assistant financier IA (Gemini), dashboard admin d'analyse de risque, données de marché en temps réel et brique blockchain.",
        figStrong: '< 10 %', figText: "des prêts du secteur sont traités numériquement. Kredia s'attaque à cet écart.", tags: TAGS.kredia,
      },
      {
        name: 'FitMind AI', when: '10/2025 → 11/2025', kind: 'Projet personnel', sub: "Coaching sportif propulsé par l'IA",
        desc: "Programmes d'entraînement personnalisés et suivi de performance en temps réel via un chat conversationnel. Assistant nutrition intégré et tableaux de bord analytics.",
        figStrong: 'Temps réel', figText: 'WebSocket et file de tâches asynchrone pour une expérience fluide.', tags: TAGS.fitmind,
      },
    ] as Project[],
  },
  skills: {
    label: 'Portefeuille',
    aside: "Mes compétences, réparties par classe d'actifs.",
    h2: 'Portefeuille de compétences',
    groups: [
      ['Frontend', 'React, Next.js, Angular, TypeScript, HTML, CSS'],
      ['Backend', 'Node.js, NestJS, Spring Boot, Django, FastAPI, REST'],
      ['Bases de données', 'PostgreSQL, MySQL, MongoDB, SQL'],
      ['IA / Data', 'Machine Learning, Computer Vision (YOLOv8), XGBoost'],
      ['Langages', 'Python, Java, TypeScript, C, C++'],
      ['DevOps', 'Docker, Git, JWT/RBAC, CI/CD'],
    ] as [string, string][],
  },
  beyond: {
    label: 'Au-delà du code',
    aside: 'Pédagogie, leadership et sens du client.',
    h2: 'Enseigner, mener, vendre',
    teach: {
      when: '2024 → présent · Tunis',
      title: 'Formateur particulier en mathématiques',
      p1: "J'accompagne des groupes de lycéens avec une pédagogie structurée et progressive, adaptée à chaque groupe. Résultat : une progression mesurable de leurs notes.",
      p2Html: "Ma méthode tient en trois temps : <b>voir</b>, <b>calculer</b>, <b>retenir</b>. Essaie-la ici sur la notion qui bloque le plus d'élèves au bac : le nombre dérivé.",
      steps: ['Voir', 'Calculer', 'Retenir'],
      see: "La droite orange passe par A et M. Rapproche M de A : elle tourne jusqu'à devenir la tangente.",
      keepDone: (d: string) => `L'écart est presque nul : le taux tend vers f′(a) = a² − 1 = ${d}. C'est le nombre dérivé, la pente de la tangente.`,
      keep: (d: string, g: string) => `Quand h → 0, la sécante devient la tangente en pointillés. Sa pente vaut f′(a) = a² − 1 = ${d}. Écart restant : ${g}.`,
      hLabel: 'Écart h entre A et M',
      go: 'Faire tendre h vers 0',
      hint: 'Fais glisser sur le graphique pour déplacer le point A.',
      aria: 'Graphique interactif : sécante et tangente à la courbe de f',
    },
    others: [
      {
        when: '09/2023 → 06/2024 · Tunis',
        titleHtml: 'Vice-président et chef de projet, ' + ext(LINKS.enactus, 'Enactus Université Centrale'),
        text: "Vice-président du club, j'ai aussi piloté un projet à impact social lors d'une compétition entrepreneuriale nationale, jusqu'à sa présentation devant le jury.",
      },
      {
        when: '2018 → présent · Tunis',
        titleHtml: 'Responsable commercial, activité indépendante',
        text: 'Plus de six ans à gérer ma propre activité : négociation, relation client et décisions orientées résultats.',
      },
    ],
  },
  edu: {
    label: 'Formation',
    aside: "Des maths d'abord, puis l'ingénierie.",
    h2: 'Formation',
    rows: [
      ['2024 → présent', "Cycle d'ingénieur, Informatique", ext(LINKS.esprit, 'ESPRIT') + ' · Ariana'],
      ['2022 → 2024', 'Classes préparatoires MP', ext(LINKS.polytech, 'École Polytechnique de Tunis')],
      ['06/2022', 'Baccalauréat Mathématiques', 'Lycée Mahmoud Messadi · Ariana'],
    ] as [string, string, string][],
    langH2: 'Langues',
    langs: [['Arabe', 'Maternelle'], ['Français', 'Courant'], ['Anglais', 'Courant']] as [string, string][],
  },
  contact: {
    label: 'Passer un ordre',
    aside: 'Stage, projet ou collaboration : je réponds vite.',
    h2: 'Me contacter',
    email: 'Email', phone: 'Téléphone', copy: 'Copier', copied: 'Copié',
  },
  footer: 'Les performances passées ne préjugent pas des performances futures.',
  tabs: [['top', 'Accueil'], ['empreinte', 'Empreinte'], ['pricer', 'Pricer'], ['experience', 'Parcours'], ['contact', 'Contact']] as [string, string][],
  recruiter: {
    title: 'Mode recruteur',
    sub: "L'essentiel en 30 secondes.",
    summary: "Étudiant-ingénieur full-stack spécialisé en informatique financière. Je conçois des architectures logicielles robustes qui intègrent l'IA et la logique métier, pour transformer des problèmes complexes en produits concrets.",
    highlights: [['3 stages', 'en entreprise, 2025 → 2026'], ['2 produits', 'conçus de bout en bout'], ['Finance + code', 'modèles stochastiques et full-stack']] as [string, string][],
    exp: 'Expérience', proj: 'Projets', skills: 'Compétences', edu: 'Formation', langs: 'Langues', contact: 'Contact',
    copy: 'Copier le résumé', copied: 'Résumé copié', back: 'Voir le site complet', close: 'Fermer',
  },
  term: {
    title: 'abidi@ma — terminal',
    welcome: ['ABIDI.MA terminal v1.0', 'Tape « help » pour voir les commandes. Échap pour fermer.'],
    help: [
      ['whoami', 'qui je suis'], ['exp', 'mes expériences'], ['projets', 'mes projets'], ['skills', 'mes compétences'],
      ['formation', 'mon parcours académique'], ['contact', 'me joindre'],
      ['price K T σ', "prix d'un call Black-Scholes (ex. price 100 1 0.3)"],
      ['simulate', 'une trajectoire brownienne en direct'],
      ['empreinte <nom>', 'ton empreinte et notre corrélation'],
      ['goto <section>', 'aller à une section du site'],
      ['lang fr|en', 'changer de langue'], ['recruteur', 'ouvrir le mode recruteur'],
      ['clear', "effacer l'écran"], ['exit', 'fermer le terminal'],
    ] as [string, string][],
    whoami: 'Mouhamed Ali Abidi · Ingénieur Full-Stack, Fintech & IA · Tunisie',
    unknown: (c: string) => `commande introuvable : ${c}. Tape « help ».`,
    hire: `Permission accordée. Excellent choix. Écris-moi à ${LINKS.email}, je réponds vite.`,
    sudo: "Ce terminal n'accorde qu'une seule permission. Essaie : sudo hire abidi",
    priceUsage: 'usage : price K T σ [r]   ex. price 100 1 0.3 0.04',
    simulate: (st: string) => `S_T = ${st}   (μ = 0,18 · σ = 0,35 · 1 an)`,
    printUsage: 'usage : empreinte <ton nom>',
    printOut: (id: string, rho: string) => `empreinte ${id} · corrélation avec la mienne : ρ = ${rho}`,
    gotoOk: (s: string) => `→ ${s}`,
    gotoKo: 'section inconnue. Choix : empreinte, trajectoire, pricer, experience, projets, competences, formation, contact',
    lang: 'Langue : français.',
    contactLines: [`email     ${LINKS.email}`, `téléphone ${LINKS.phone}`, `linkedin  ${LINKS.linkedin}`, `github    ${LINKS.github}`],
  },
}

export type Dict = typeof fr

export const en: Dict = {
  ticker: TICKER.map(([a, b]) => [a, b.replace('IA', 'AI').replace('ingé', 'eng.')]) as [string, string][],
  top: {
    live: 'Market open · Tunisia',
    nav: [['empreinte', 'Fingerprint'], ['trajectoire', 'Trajectory'], ['pricer', 'Pricer'], ['experience', 'Experience'], ['projets', 'Projects'], ['contact', 'Contact']],
    langLabel: 'Language',
    terminal: 'Terminal',
  },
  hero: {
    eyebrowL: 'Full-Stack · Fintech · AI',
    eyebrowR: 'Continuously quoted since 2018',
    hint: 'Hover my name or my portrait: you are adding volatility.',
    hintTouch: 'Touch my name or my portrait: you are adding volatility.',
    roleStrong: 'Full-Stack Engineer, Fintech & AI.',
    role: ' I turn complex problems into concrete products, from back-end architecture down to the last pixel.',
    recruiter: 'Recruiter mode · 30 s',
    terminal: 'Open the terminal',
    ouText: 'Every dot of my name follows an Ornstein-Uhlenbeck process: shaken at random, it always returns to its place.',
    spread: 'mean deviation',
    shock: 'Volatility shock',
    calm: 'Back to calm',
    portrait: 'Portrait',
    processes: 'OU processes',
    sharp: 'Sharp photo',
    dots: 'Particle version',
    photoAlt: 'Portrait of Mouhamed Ali Abidi',
  },
  print: {
    label: 'Stochastic fingerprint',
    aside: 'One name, one seed, fifteen Brownian bridges closed into rings.',
    h2: 'My fingerprint, and yours',
    lede: 'Every name produces a unique fingerprint that never changes: the name seeds a random generator, which draws Brownian bridges as rings. Type your name to generate yours and measure our correlation. Whatever the result, there is a good way to work together.',
    you: 'You',
    yourName: 'Your name',
    def: 'Curious recruiter',
    ariaMine: 'Brownian fingerprint of Mouhamed Ali Abidi',
    ariaYours: 'Your Brownian fingerprint',
    same: 'Same name, same seed, same fingerprint: a perfect correlation. Nice to meet you.',
    zero: 'Our paths are independent, and that is a strength: in finance, you diversify a portfolio with different assets. Together, we cover more ground.',
    pos: 'Our paths move in the same direction. We share a heading: a good basis for working together.',
    neg: 'When one goes up, the other balances: that is what a good hedge does. Our profiles complement each other.',
  },
  traj: {
    label: 'Trajectory',
    aside: 'Merton model: continuous diffusion, plus a jump at every milestone.',
    h2: 'A jump-diffusion career',
    lede: 'Between milestones, I progress continuously. With each new experience, the curve jumps. Hover a number to see the milestone.',
    today: 'today',
    projection: 'projection',
    swipe: 'Swipe the chart left to see 2026 →',
    aria: 'Career trajectory from 2018 to today, modeled as a jump-diffusion',
    events: [
      'Independent sales business', 'Baccalauréat, Mathematics', 'Preparatory classes MP · École Polytechnique de Tunis',
      'Vice-president & project lead · Enactus', 'Math tutor', 'Engineering degree · ESPRIT',
      'Internship · Zero Threat Corporation', 'FitMind AI', 'Kredia', 'AI internship · OneTech', 'Internship · MyTrainia',
    ],
  },
  pricer: {
    label: 'Pricer',
    aside: 'Closed-form Black-Scholes, checked by Monte Carlo simulation.',
    h2: 'An option on my potential',
    lede: 'A European call gives the right, not the obligation, to buy an asset at price K on date T. Here is the call on ABIDI.MA. Adjust the parameters: the price is recomputed with Black-Scholes, and you can check it by simulation.',
    s0: 'Value today',
    K: 'Strike K', T: 'Maturity T', v: 'Volatility σ', r: 'Risk-free rate r',
    year: 'year', years: 'years',
    price: 'Call price',
    greeks: ['Δ delta', 'Γ gamma', 'ν vega', 'Θ theta / day'],
    payoff: 'Payoff at maturity', value: 'Value today',
    aria: 'Call value as a function of the asset price',
    readHtml: (K: number, p: number, d: string) =>
      `Reading: the probability that ABIDI.MA ends above ${K} at maturity is <b>${p}%</b> (risk-neutral). With a delta of ${d}, each point gained by the asset adds about ${d} point to the option.`,
    mc: 'Check with Monte Carlo',
    mcIdle: '20,000 simulated paths, compared with the formula.',
    mcHtml: (m: string, ci: string, ref: string, gap: string) =>
      `Monte Carlo: <b>${m}</b> ± ${ci} · Black-Scholes: <b>${ref}</b> · gap ${gap}%`,
  },
  exp: {
    label: 'Experience',
    aside: 'Internships, most recent first.',
    h2: 'Professional experience',
    items: [
      {
        company: 'MyTrainia', url: LINKS.mytrainia, role: 'Web Developer Intern', when: '10/2026 → 11/2026', where: 'Paris, France',
        desc: 'AI-powered EdTech platform dedicated to success in mathematics. Deployed to production on Cloudflare, with a separate staging environment.',
        bullets: [
          'Full-stack features (React, Supabase Auth and Edge Functions) integrating generative AI, Stripe payments and KaTeX math rendering.',
          'Professional workflow: main/prod branches, pull requests, unit tests (Vitest) and end-to-end tests (Playwright).',
        ],
        tags: TAGS.mytrainia,
      },
      {
        company: 'OneTech Business Solutions', url: LINKS.onetech, role: 'Full-Stack & AI Developer Intern', when: '07/2026 → 09/2026', where: 'Tunis',
        desc: 'Intelligent platform for managing insurance claims, automating file analysis and decision-making for three profiles: client, expert and agent.',
        bullets: [
          'Integrated AI models (computer vision with YOLOv8, XGBoost) to assess claims and reduce manual processing.',
          'Multi-role architecture with secured APIs, making every step of the decision process more reliable.',
        ],
        tags: TAGS.onetech,
      },
      {
        company: 'Zero Threat Corporation', url: LINKS.ztc, role: 'Full-Stack Developer Intern', when: '06/2025 → 08/2025', where: 'Tunis',
        desc: 'Support ticket management system: employees submit requests, administrators handle them from a modern, responsive interface.',
        bullets: [
          'Secure role-based authentication and full ticket lifecycle management.',
          'Interactive dashboard with statistics, advanced filtering and attachment management.',
        ],
        tags: TAGS.ztc,
      },
    ],
  },
  proj: {
    label: 'Projects',
    aside: 'Two products designed end to end.',
    h2: 'Projects',
    items: [
      {
        name: 'Kredia', when: '01/2026 → 05/2026', kind: 'Micro-finance', sub: 'Intelligent micro-finance platform',
        desc: 'Opening up access to credit for under-banked populations. Credit simulation, online loan applications, repayment tracking and an investment space. AI financial assistant (Gemini), admin dashboard for risk analysis, real-time market data and a blockchain module.',
        figStrong: '< 10 %', figText: 'of loans in the sector are processed digitally. Kredia targets that gap.', tags: TAGS.kredia,
      },
      {
        name: 'FitMind AI', when: '10/2025 → 11/2025', kind: 'Personal project', sub: 'AI-powered fitness coaching',
        desc: 'Personalized training programs and real-time performance tracking through a conversational chat. Built-in nutrition assistant and analytics dashboards.',
        figStrong: 'Real time', figText: 'WebSocket and an asynchronous task queue for a smooth experience.', tags: TAGS.fitmind,
      },
    ],
  },
  skills: {
    label: 'Portfolio',
    aside: 'My skills, grouped by asset class.',
    h2: 'Skills portfolio',
    groups: [
      ['Frontend', 'React, Next.js, Angular, TypeScript, HTML, CSS'],
      ['Backend', 'Node.js, NestJS, Spring Boot, Django, FastAPI, REST'],
      ['Databases', 'PostgreSQL, MySQL, MongoDB, SQL'],
      ['AI / Data', 'Machine Learning, Computer Vision (YOLOv8), XGBoost'],
      ['Languages', 'Python, Java, TypeScript, C, C++'],
      ['DevOps', 'Docker, Git, JWT/RBAC, CI/CD'],
    ],
  },
  beyond: {
    label: 'Beyond code',
    aside: 'Teaching, leadership and a sense of the client.',
    h2: 'Teach, lead, sell',
    teach: {
      when: '2024 → present · Tunis',
      title: 'Private math tutor',
      p1: 'I coach groups of high-school students with a structured, progressive method adapted to each group. The result: measurable progress in their grades.',
      p2Html: 'My method has three stages: <b>see</b>, <b>compute</b>, <b>remember</b>. Try it here on the concept that trips up the most students in the final exam: the derivative.',
      steps: ['See', 'Compute', 'Remember'],
      see: 'The orange line goes through A and M. Bring M closer to A: it turns until it becomes the tangent.',
      keepDone: (d: string) => `The gap is almost zero: the rate tends to f′(a) = a² − 1 = ${d}. That is the derivative, the slope of the tangent.`,
      keep: (d: string, g: string) => `As h → 0, the secant becomes the dotted tangent. Its slope is f′(a) = a² − 1 = ${d}. Remaining gap: ${g}.`,
      hLabel: 'Gap h between A and M',
      go: 'Let h tend to 0',
      hint: 'Drag on the chart to move point A.',
      aria: 'Interactive chart: secant and tangent to the curve of f',
    },
    others: [
      {
        when: '09/2023 → 06/2024 · Tunis',
        titleHtml: 'Vice-president & project lead, ' + ext(LINKS.enactus, 'Enactus Université Centrale'),
        text: 'Vice-president of the club, I also led a social-impact project in a national entrepreneurship competition, all the way to the jury presentation.',
      },
      {
        when: '2018 → present · Tunis',
        titleHtml: 'Sales lead, independent business',
        text: 'Over six years running my own business: negotiation, client relationships and results-driven decisions.',
      },
    ],
  },
  edu: {
    label: 'Education',
    aside: 'Maths first, then engineering.',
    h2: 'Education',
    rows: [
      ['2024 → present', 'Engineering degree, Computer Science', ext(LINKS.esprit, 'ESPRIT') + ' · Ariana'],
      ['2022 → 2024', 'Preparatory classes (MP)', ext(LINKS.polytech, 'École Polytechnique de Tunis')],
      ['06/2022', 'Baccalauréat, Mathematics', 'Lycée Mahmoud Messadi · Ariana'],
    ],
    langH2: 'Languages',
    langs: [['Arabic', 'Native'], ['French', 'Fluent'], ['English', 'Fluent']],
  },
  contact: {
    label: 'Place an order',
    aside: 'Internship, project or collaboration: I reply fast.',
    h2: 'Contact me',
    email: 'Email', phone: 'Phone', copy: 'Copy', copied: 'Copied',
  },
  footer: 'Past performance is no guarantee of future results.',
  tabs: [['top', 'Home'], ['empreinte', 'Print'], ['pricer', 'Pricer'], ['experience', 'Career'], ['contact', 'Contact']],
  recruiter: {
    title: 'Recruiter mode',
    sub: 'The essentials in 30 seconds.',
    summary: 'Full-stack engineering student specialized in financial computing. I design robust software architectures that combine AI and business logic, turning complex problems into concrete products.',
    highlights: [['3 internships', 'in companies, 2025 → 2026'], ['2 products', 'designed end to end'], ['Finance + code', 'stochastic models and full-stack']],
    exp: 'Experience', proj: 'Projects', skills: 'Skills', edu: 'Education', langs: 'Languages', contact: 'Contact',
    copy: 'Copy the summary', copied: 'Summary copied', back: 'See the full site', close: 'Close',
  },
  term: {
    title: 'abidi@ma — terminal',
    welcome: ['ABIDI.MA terminal v1.0', 'Type "help" to list commands. Esc to close.'],
    help: [
      ['whoami', 'who I am'], ['exp', 'my experience'], ['projects', 'my projects'], ['skills', 'my skills'],
      ['education', 'my academic path'], ['contact', 'reach me'],
      ['price K T σ', 'Black-Scholes call price (e.g. price 100 1 0.3)'],
      ['simulate', 'a live Brownian path'],
      ['print <name>', 'your fingerprint and our correlation'],
      ['goto <section>', 'jump to a section of the site'],
      ['lang fr|en', 'switch language'], ['recruiter', 'open recruiter mode'],
      ['clear', 'clear the screen'], ['exit', 'close the terminal'],
    ],
    whoami: 'Mouhamed Ali Abidi · Full-Stack Engineer, Fintech & AI · Tunisia',
    unknown: (c: string) => `command not found: ${c}. Type "help".`,
    hire: `Permission granted. Excellent choice. Write to me at ${LINKS.email}, I reply fast.`,
    sudo: 'This terminal grants only one permission. Try: sudo hire abidi',
    priceUsage: 'usage: price K T σ [r]   e.g. price 100 1 0.3 0.04',
    simulate: (st: string) => `S_T = ${st}   (μ = 0.18 · σ = 0.35 · 1 year)`,
    printUsage: 'usage: print <your name>',
    printOut: (id: string, rho: string) => `fingerprint ${id} · correlation with mine: ρ = ${rho}`,
    gotoOk: (s: string) => `→ ${s}`,
    gotoKo: 'unknown section. Choose: empreinte, trajectoire, pricer, experience, projets, competences, formation, contact',
    lang: 'Language: English.',
    contactLines: [`email     ${LINKS.email}`, `phone     ${LINKS.phone}`, `linkedin  ${LINKS.linkedin}`, `github    ${LINKS.github}`],
  },
}

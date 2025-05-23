# Tecnicapp - Frontend

Aquest és el frontend de l'aplicació Tecnicapp, una aplicació per gestionar castellers, esdeveniments i castells.

## Requisits previs

- Node.js (v18 o superior)
- npm o yarn
- Backend de Tecnicapp en execució (al port 5000 per defecte)

## Instal·lació

1. Clona el repositori o descarrega els fitxers
2. Navega a la carpeta del client:
```bash
cd Tecnicapp/client
```
3. Instal·la les dependències:
```bash
npm install
```

## Configuració

La configuració principal ja està feta a través del fitxer `package.json`. Per defecte, l'aplicació es connecta al backend a través del proxy configurat en:

```json
"proxy": "http://localhost:5000"
```

Això significa que el backend ha d'estar en execució a http://localhost:5000. Si el backend s'executa en una altra ubicació, modifica aquesta línia.

## Execució en mode desenvolupament

Per iniciar l'aplicació en mode desenvolupament:

```bash
npm start
```

Això iniciarà l'aplicació i obrirà automàticament el navegador a http://localhost:3000.

## Compilació per a producció

Per crear una compilació optimitzada per a producció:

```bash
npm run build
```

Això generarà una versió optimitzada de l'aplicació a la carpeta `build/`.

## Desplegament

La versió de producció generada amb `npm run build` pot ser desplegada a qualsevol servei d'allotjament estàtic com:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### Desplegament a Vercel

Per desplegar a Vercel:

1. Instal·la Vercel CLI:
```bash
npm install -g vercel
```

2. Executa la comanda de desplegament:
```bash
vercel
```

3. Segueix les instruccions per completar el desplegament

## Característiques de l'aplicació

L'aplicació client de Tecnicapp inclou les següents característiques:

### Tema clar/fosc
L'aplicació suporta tema clar i fosc, i pot detectar automàticament la preferència del sistema.

### Pàgines principals

- **Autenticació**: Inici de sessió i registre d'usuaris
- **Esdeveniments**: Gestió d'assajos i actuacions
- **Membres**: Gestió dels membres de la colla
- **Castells**: Configuració i gestió de castells
- **Tronc i Pinya**: Eina visual per organitzar el tronc i la pinya dels castells

## Estructura del projecte

```
client/
├── public/                  # Fitxers estàtics
│   └── img/                 # Imatges públiques
├── src/                     # Codi font
│   ├── App.js               # Component principal
│   ├── index.js             # Punt d'entrada
│   ├── context/             # Context de React
│   ├── pages/               # Components de pàgina
│   │   ├── altres/          # Components generals
│   │   ├── autenticacio/    # Components d'inici de sessió i registre
│   │   ├── castells/        # Components de gestió de castells
│   │   ├── esdeveniments/   # Components de gestió d'esdeveniments
│   │   └── membres/         # Components de gestió de membres
│   ├── styles/              # Fitxers CSS
│   └── svg/                 # Gràfics SVG per a les plantilles
└── package.json             # Configuració i dependències
```

## Tecnologies utilitzades

- React 19
- React Router 6
- Material UI 6
- Emotion (per a estils)
- React Zoom Pan Pinch (per a la visualització de plantilles)

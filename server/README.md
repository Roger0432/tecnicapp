# Tecnicapp - Backend

Aquest és el backend de l'aplicació Tecnicapp, una aplicació per gestionar castellers, esdeveniments i castells.

## Requisits previs

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instal·lació

1. Clona el repositori o descarrega els fitxers
2. Navega a la carpeta del servidor:
```bash
cd Tecnicapp/server
```
3. Instal·la les dependències:
```bash
npm install
```

## Configuració de la base de dades PostgreSQL

1. Assegura't de tenir PostgreSQL instal·lat i en funcionament
2. Crea una nova base de dades per a l'aplicació:
```sql
CREATE DATABASE tecnicapp;
```
3. Connecta't a la base de dades i crea les taules necessàries:

```sql
-- Crear taula de rols
CREATE TABLE rols (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

-- Crear taula d'usuaris
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    cognoms VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol_id INTEGER REFERENCES rols(id)
);

-- Crear taula de membres
CREATE TABLE membres (
    id SERIAL PRIMARY KEY,
    mote VARCHAR(100),
    nom VARCHAR(100) NOT NULL,
    cognoms VARCHAR(100) NOT NULL,
    alcada_hombro NUMERIC(4,2),
    alcada_mans NUMERIC(4,2),
    comentaris TEXT
);

-- Crear taula d'esdeveniments
CREATE TABLE esdeveniments (
    id SERIAL PRIMARY KEY,
    dia DATE NOT NULL,
    lloc VARCHAR(200) NOT NULL,
    hora_inici TIME NOT NULL,
    hora_fi TIME NOT NULL,
    assaig BOOLEAN NOT NULL,
    nom VARCHAR(200)
);

-- Crear taula de castells
CREATE TABLE castells (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Crear taula de relació entre esdeveniments i castells
CREATE TABLE esdeveniments_castells (
    id SERIAL PRIMARY KEY,
    esdeveniment_id INTEGER REFERENCES esdeveniments(id) ON DELETE CASCADE,
    castell_id INTEGER REFERENCES castells(id) ON DELETE CASCADE,
    nom VARCHAR(100)
);

-- Crear taula per al tronc
CREATE TABLE tronc (
    id SERIAL PRIMARY KEY,
    esdeveniment_castell_id INTEGER REFERENCES esdeveniments_castells(id) ON DELETE CASCADE,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    posicio_id INTEGER NOT NULL
);

-- Crear taula per a la pinya
CREATE TABLE pinya (
    id SERIAL PRIMARY KEY,
    esdeveniment_castell_id INTEGER REFERENCES esdeveniments_castells(id) ON DELETE CASCADE,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    posicio_id INTEGER NOT NULL
);

-- Inserir rols bàsics
INSERT INTO rols (rol) VALUES ('Administrador');
INSERT INTO rols (rol) VALUES ('Tècnic');
INSERT INTO rols (rol) VALUES ('Cap de colla');
```

4. Opcionalment, pots inserir dades d'exemple per provar l'aplicació

## Configuració del fitxer .env

Crea un fitxer `.env` a l'arrel del directori del servidor amb els següents paràmetres:

```
PORT=5000
POSTGRES_USER=usuari_postgres
POSTGRES_HOST=localhost
POSTGRES_DATABASE=tecnicapp
POSTGRES_PASSWORD=contrasenya_postgres
POSTGRES_PORT=5432
CODI_ACTIVACIO=codi_secret_per_registre
```

Substitueix els valors pels corresponents a la teva configuració.

## Executar l'aplicació

### Mode de desenvolupament

Per executar l'aplicació en mode de desenvolupament amb nodemon (reinici automàtic en fer canvis):

```bash
npm run dev
```

### Mode de producció

Per executar l'aplicació en mode de producció:

```bash
npm start
```

L'aplicació s'executarà per defecte al port 5000 o al port especificat a l'arxiu `.env`.

## API Endpoints

L'API inclou els següents endpoints principals:

### Autenticació
- `POST /inicisessio` - Iniciar sessió
- `POST /registre` - Registrar un nou usuari
- `GET /verify-token` - Verificar token JWT
- `GET /rols` - Obtenir els rols disponibles

### Esdeveniments
- `POST /crear-esdeveniment` - Crear un nou esdeveniment
- `POST /esdeveniments` - Obtenir els esdeveniments (assaig o actuació)
- `GET /detalls-esdeveniment/:id` - Obtenir els detalls d'un esdeveniment
- `DELETE /borrar-esdeveniment/:id` - Eliminar un esdeveniment
- `PUT /editar-esdeveniment/:id` - Actualitzar un esdeveniment

### Membres
- `GET /membres` - Obtenir tots els membres
- `POST /crear-membre` - Crear un nou membre
- `DELETE /borrar-membre/:id` - Eliminar un membre
- `PUT /editar-membre/:id` - Actualitzar un membre

### Castells
- `GET /castells` - Obtenir tots els castells
- `POST /guardar-castells` - Guardar castells per a un esdeveniment
- `DELETE /borrar-castell/:id` - Eliminar un castell

### Tronc i Pinya
- `GET /membres-tronc/:id` - Obtenir els membres del tronc per a un castell
- `GET /membres-no-tronc/:id` - Obtenir els membres disponibles per al tronc
- `PUT /actualitzar-tronc/:id` - Actualitzar el tronc d'un castell
- `GET /membres-pinya/:id` - Obtenir els membres de la pinya per a un castell
- `GET /membres-no-pinya/:id` - Obtenir els membres disponibles per a la pinya
- `PUT /actualitzar-pinya/:id` - Actualitzar la pinya d'un castell

## Desplegament a Vercel

El servidor està configurat per ser desplegat a Vercel. El fitxer `vercel.json` ja conté la configuració necessària. Per desplegar-lo:

1. Instal·la Vercel CLI:
```bash
npm install -g vercel
```

2. Desplega l'aplicació:
```bash
vercel
```

3. Segueix les instruccions per completar el desplegament

## Connexió amb el client

El client per defecte es connecta a l'API en les següents URLs:
- En mode desenvolupament: `http://localhost:5000`
- En producció: `https://tecnicapp-server.vercel.app`
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
3. Connecta't a la base de dades i executa el següent script de creació complet:

```sql
-- Creació de taules

-- Taula de rols
CREATE TABLE public.rols (
    id integer NOT NULL,
    rol character varying NOT NULL
);

ALTER TABLE public.rols 
    ADD CONSTRAINT rols_pk PRIMARY KEY (id);

CREATE SEQUENCE public.rols_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.rols_id_seq OWNED BY public.rols.id;
ALTER TABLE ONLY public.rols ALTER COLUMN id SET DEFAULT nextval('public.rols_id_seq'::regclass);

-- Taula d'usuaris
CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying NOT NULL,
    cognoms character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    rol_id integer NOT NULL
);

ALTER TABLE public.users 
    ADD CONSTRAINT users_pk PRIMARY KEY (id);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_rols_fk FOREIGN KEY (rol_id) REFERENCES public.rols(id) ON DELETE CASCADE;

-- Taula de resultats
CREATE TABLE public.resultats (
    id integer NOT NULL,
    descripcio character varying NOT NULL
);

ALTER TABLE public.resultats 
    ADD CONSTRAINT resultats_pk PRIMARY KEY (id);

CREATE SEQUENCE public.resultats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.resultats_id_seq OWNED BY public.resultats.id;
ALTER TABLE ONLY public.resultats ALTER COLUMN id SET DEFAULT nextval('public.resultats_id_seq'::regclass);

-- Taula d'esdeveniments
CREATE TABLE public.esdeveniments (
    id integer NOT NULL,
    dia date NOT NULL,
    lloc character varying NOT NULL,
    hora_inici time without time zone NOT NULL,
    hora_fi time without time zone NOT NULL,
    assaig boolean NOT NULL,
    nom character varying NOT NULL
);

ALTER TABLE public.esdeveniments 
    ADD CONSTRAINT esdeveniments_pk PRIMARY KEY (id);

CREATE SEQUENCE public.assaigsdiades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.assaigsdiades_id_seq OWNED BY public.esdeveniments.id;
ALTER TABLE ONLY public.esdeveniments ALTER COLUMN id SET DEFAULT nextval('public.assaigsdiades_id_seq'::regclass);

-- Taula de castells
CREATE TABLE public.castells (
    id integer NOT NULL,
    nom character varying NOT NULL,
    amplada numeric NOT NULL,
    alcada numeric NOT NULL,
    agulla boolean NOT NULL,
    folre boolean NOT NULL,
    manilles boolean NOT NULL,
    puntals boolean NOT NULL,
    per_sota boolean NOT NULL,
    margarita boolean,
    grup numeric NOT NULL,
    subgrup numeric NOT NULL,
    punts_carregat numeric NOT NULL,
    punts_descarregat numeric NOT NULL
);

ALTER TABLE public.castells 
    ADD CONSTRAINT castells_pk PRIMARY KEY (id);

CREATE SEQUENCE public.castells_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.castells_id_seq OWNED BY public.castells.id;
ALTER TABLE ONLY public.castells ALTER COLUMN id SET DEFAULT nextval('public.castells_id_seq'::regclass);

-- Taula d'esdeveniments_castells
CREATE TABLE public.esdeveniments_castells (
    id integer NOT NULL,
    esdeveniment_id integer NOT NULL,
    castell_id integer NOT NULL,
    resultat_id integer NOT NULL,
    nom character varying
);

ALTER TABLE public.esdeveniments_castells 
    ADD CONSTRAINT esdeveniments_castells_pk PRIMARY KEY (id);

CREATE SEQUENCE public.assaigsdiades_castells_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.assaigsdiades_castells_id_seq OWNED BY public.esdeveniments_castells.id;
ALTER TABLE ONLY public.esdeveniments_castells ALTER COLUMN id SET DEFAULT nextval('public.assaigsdiades_castells_id_seq'::regclass);
ALTER TABLE ONLY public.esdeveniments_castells
    ADD CONSTRAINT esdeveniments_castells_castells_fk FOREIGN KEY (castell_id) REFERENCES public.castells(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.esdeveniments_castells
    ADD CONSTRAINT esdeveniments_castells_esdeveniments_fk FOREIGN KEY (esdeveniment_id) REFERENCES public.esdeveniments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.esdeveniments_castells
    ADD CONSTRAINT esdeveniments_castells_resultats_fk FOREIGN KEY (resultat_id) REFERENCES public.resultats(id) ON DELETE CASCADE;

-- Taula de membres
CREATE TABLE public.membres (
    id integer NOT NULL,
    nom character varying NOT NULL,
    cognoms character varying,
    mote character varying NOT NULL,
    comentaris character varying,
    alcada_hombro numeric,
    alcada_mans numeric
);

ALTER TABLE public.membres 
    ADD CONSTRAINT membres_pk PRIMARY KEY (id);

CREATE SEQUENCE public.membres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.membres_id_seq OWNED BY public.membres.id;
ALTER TABLE ONLY public.membres ALTER COLUMN id SET DEFAULT nextval('public.membres_id_seq'::regclass);

-- Taula de posicions
CREATE TABLE public.posicions (
    id integer NOT NULL,
    nom character varying NOT NULL
);

ALTER TABLE public.posicions 
    ADD CONSTRAINT posicions_pk PRIMARY KEY (id);

CREATE SEQUENCE public.posicions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.posicions_id_seq OWNED BY public.posicions.id;
ALTER TABLE ONLY public.posicions ALTER COLUMN id SET DEFAULT nextval('public.posicions_id_seq'::regclass);

-- Taula de membres_posicions
CREATE TABLE public.membres_posicions (
    id integer NOT NULL,
    membre_id integer NOT NULL,
    esdeveniment_castell_id integer NOT NULL,
    posicio character varying NOT NULL
);

ALTER TABLE public.membres_posicions 
    ADD CONSTRAINT membres_posicions_pk PRIMARY KEY (id);

CREATE SEQUENCE public.membres_posicions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.membres_posicions_id_seq OWNED BY public.membres_posicions.id;
ALTER TABLE ONLY public.membres_posicions ALTER COLUMN id SET DEFAULT nextval('public.membres_posicions_id_seq'::regclass);
ALTER TABLE ONLY public.membres_posicions
    ADD CONSTRAINT membres_posicions_membres_fk FOREIGN KEY (membre_id) REFERENCES public.membres(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.membres_posicions
    ADD CONSTRAINT members_posicions_esdeveniments_castells_fk FOREIGN KEY (esdeveniment_castell_id) REFERENCES public.esdeveniments_castells(id) ON DELETE CASCADE;

-- Dades mínimes necessàries per al funcionament de l'aplicació
-- Inserció de rols bàsics
INSERT INTO public.rols (id, rol) VALUES (1, 'Cap de colla');
INSERT INTO public.rols (id, rol) VALUES (2, 'Sots cap de colla');
INSERT INTO public.rols (id, rol) VALUES (3, 'Cap de troncs');
INSERT INTO public.rols (id, rol) VALUES (4, 'Cap de canalla');
INSERT INTO public.rols (id, rol) VALUES (5, 'Cap de pinyes');
INSERT INTO public.rols (id, rol) VALUES (6, 'Cap de baixos');
INSERT INTO public.rols (id, rol) VALUES (7, 'Cap de crosses');
INSERT INTO public.rols (id, rol) VALUES (8, 'Equip de troncs');
INSERT INTO public.rols (id, rol) VALUES (9, 'Equip de canalla');
INSERT INTO public.rols (id, rol) VALUES (10, 'Equip de pinyes');
INSERT INTO public.rols (id, rol) VALUES (11, 'Equip de baixos');
INSERT INTO public.rols (id, rol) VALUES (12, 'Equip de crosses');

-- Inserció de resultats possibles per als castells
INSERT INTO public.resultats (id, descripcio) VALUES (1, 'Per fer');
INSERT INTO public.resultats (id, descripcio) VALUES (2, 'Descarregat');
INSERT INTO public.resultats (id, descripcio) VALUES (3, 'Carregat');
INSERT INTO public.resultats (id, descripcio) VALUES (4, 'Intent desmuntat');
INSERT INTO public.resultats (id, descripcio) VALUES (5, 'Intent');

-- Inserció de posicions bàsiques
INSERT INTO public.posicions (id, nom) VALUES (1, 'baix');
INSERT INTO public.posicions (id, nom) VALUES (2, 'tronc');
INSERT INTO public.posicions (id, nom) VALUES (3, 'dosos');
INSERT INTO public.posicions (id, nom) VALUES (4, 'acotxador');
INSERT INTO public.posicions (id, nom) VALUES (5, 'enxaneta');
```

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
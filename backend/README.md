# PISE-Backend
PISE (Plataforma de Interoperabilidad en los Servicios de Emergencia)

REPOSITORIO EN DONDE SE ALMACENA EL CODIGO FUENTE DE PISE BACKEND.

WIKI DEL PROYECTO: https://tree.taiga.io/project/jorgesilva7-trabajo-de-titulo-js/wiki

Para ejecutar la API para el desarrollo, debe tener lo siguiente en el PC

Tener instalado npm (latest)
Node (10.16.3) (npm install node)
MongoDB (latest)
Recomendado utilizar nodemon (npm install nodemon)
Una vez clonado el repositorio y cada vez que haya un cambio, debe hacer lo siguiente

npm install
mongod (mongo ejecutandose)
su BD estará vacía, pedir BD con datos iniciales al Jefe de proyecto
nodemon index.js

# VARIABLES DE ENTORNO EN ESTE PROYECTO

* PISE_DB_USER: Usuario MongoDB
* PISE_DB_PASSWORD: Password MongoDB
* DB_PORT: Puerto MongoDB
* NODE_ENV: Development o Production
* SEED: true o false (para datos seed)
* AWS_KEY: AWS Key
* AWS_ID: AWS Id
* AWS_BUCKET_NAME: Nombre Bucket AWS S3
* PISE_SECRET: Secret para JWT
* PISE_EMAIL: Email gmail
* PISE_EMAIL_PWD: Password email gmail

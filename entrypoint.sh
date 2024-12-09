#!/bin/sh

node_modules/sequelize-cli/lib/sequelize db:migrate

npm run start:dev
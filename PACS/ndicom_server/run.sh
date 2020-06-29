#!/usr/bin/env bash
echo "Waiting PostgreSQL to launch on 8080..."

nc -z localhost 5432


echo "PostgreSQL launched"

echo "Migrate database"
python ./manage.py makemigrations
python ./manage.py migrate
echo "Store DICOM images"
python ./manage.py clear_dicom
python ./manage.py store_dicom ../images
echo "Load plugins"
# shellcheck disable=SC2006
python ./manage.py clear_plugins
python ./manage.py clear_results
python ./manage.py store_plugins ./plugins
python app.py

nc -z localhost 8080

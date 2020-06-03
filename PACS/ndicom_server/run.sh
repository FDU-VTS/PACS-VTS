#!/usr/bin/env bash
echo "Waiting PostgreSQL to launch on 8080..."

nc -z localhost 5432


echo "PostgreSQL launched"

sleep 10
echo "Migrate database"
#python ./manage.py makemigrations
#python ./manage.py migrate
echo "Store DICOM images"
#python ./manage.py clear_dicom
#python ./manage.py store_dicom ../images
python app.py &

nc -z localhost 8080

sleep 10
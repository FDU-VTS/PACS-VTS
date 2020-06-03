#!/usr/bin/env bash
echo "Load plugins"
# shellcheck disable=SC2006
filelist=`ls ./plugins/`

for file in $filelist

do

    cd plugins/$file
#    pip install .
    cd ..
    cd ..
    python ./manage.py store_plugins ./plugins/$file
done


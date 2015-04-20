# OSMViewer

![Screenshot of OSMViewer](http://i.imgur.com/ln44oFz.jpg)

A web application for viewing [OpenStreetMap](https://www.openstreetmap.org/) data on a map. It was mainly just a chance to 
have a play around with:

- [Angular.js](https://angularjs.org/) with [angular-leaflet-directive](http://tombatossals.github.io/angular-leaflet-directive)
- [Leaflet](http://leafletjs.com/)
- [PostgreSQL](http://www.postgresql.org/) with [PostGIS](http://postgis.net/)
- [Flask](http://flask.pocoo.org/)

## Requirements

The app pulls data from a PostgreSQL + PostGIS database, housing OpenStreetMap data. You can find data sets for major cities at [Mapzen](https://mapzen.com/metro-extracts/), then load the data using [osm2pgsql](http://wiki.openstreetmap.org/wiki/Osm2pgsql).

Edit `app.config['DATABASE_URL']` in `osmviewer.py` before starting the app. 

## Get it running

```bash
$ git clone git@github.com:mshafer/osm-viewer.git
$ cd osm-viewer
$ pip install -r requirements.txt
# Create a virtualenv if you want
# Update osmviewer.py with the URL of your PostgreSQL instance
$ python osmviewer.py
```

The app will now be running at [http://localhost:5000/](http://localhost:5000/)

## TODO

- Currently the client asks the server for all features within the map's bounds, but this will overlap with regions that have already been fetched. Need to make sure we're only querying for new regions.
- Add UI for selecting the type of features to display. Currently this is hardcoded in the server to only return one type of feature.

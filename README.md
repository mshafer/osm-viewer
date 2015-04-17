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

```
$ cd OSMViewer
# Create a virtualenv if you want
$ pip install -r requirements.txt
$ python osmviewer.py
```

The app will now be running at [http://localhost:5000/](http://localhost:5000/)

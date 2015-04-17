# OSMViewer

![Screenshot of OSMViewer](http://i.imgur.com/ZuMjw6s.jpg)

A web application for viewing [OpenStreetMap](https://www.openstreetmap.org/) data on a map. It was mainly just a chance to 
have a play around with:

- [Angular.js](https://angularjs.org/) with [angular-leaflet-directive](http://tombatossals.github.io/angular-leaflet-directive)
- [Leaflet](http://leafletjs.com/)
- [PostgreSQL](http://www.postgresql.org/) with [PostGIS](http://postgis.net/)
- [Flask](http://flask.pocoo.org/)

## Get it running

Use [osm2pgsql](http://wiki.openstreetmap.org/wiki/Osm2pgsql) to load some OpenStreetMap data into a PostgreSQL database. Data sets for major cities are available at [Mapzen](https://mapzen.com/metro-extracts/).

```
$ cd OSMViewer
# Create a virtualenv if you want
$ pip install -r requirements.txt
$ python osmviewer.py
```

The app will now be running at http://localhost:5000/
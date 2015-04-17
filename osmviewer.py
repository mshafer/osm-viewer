import json
from flask import Flask, render_template, jsonify, Response

app = Flask(__name__)


@app.route('/')
def map_view():
    return render_template('map-view.html')


@app.route('/api/points')
def points():
    points = [
        {
            'osmId': '2433178371.0',
            'name':  'Caroline Chisholm Drive near Junction Road',
            'type': 'bus',
            'latitude': -33.8658763,
            'longitude': 151.21242949999998
        }
    ]
    return Response(json.dumps(points),  mimetype='application/json')


if __name__ == '__main__':
    app.run()

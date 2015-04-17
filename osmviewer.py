import json
from flask import Flask, render_template, Response, request, jsonify
import psycopg2
from voluptuous import Schema, MultipleInvalid, Any

app = Flask(__name__)
app.config['DATABASE_URL'] = 'osmdata'


######## Request Object Definitions ########

GetFeaturesRequest = Schema({
    'north': Any(float, int),
    'east': Any(float, int),
    'south': Any(float, int),
    'west': Any(float, int)
}, required=True)

def validate_request(request_object, request_schema):
    """
    Attempt to validate the given request object, using the given voluptuous schema.
    If validation does not succeed, a BadRequestError is thrown with an appropriate error message.

    :param request_object: the JSON request data
    :param request_schema: the voluptuous schema against which the data should be validated
    :return:
    """
    try:
        request_schema(request_object)
    except MultipleInvalid as e:
        error_descriptions = {
            '.'.join(e.path): e.msg
        }
        raise BadRequestException(message="", payload=error_descriptions)

######## Error Responses ########

class BadRequestException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        dictionary = dict(self.payload or ())
        if self.message != "":
            dictionary['message'] = self.message
        return dictionary


@app.errorhandler(BadRequestException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


######## Services ########

class FeatureService(object):
    conn = psycopg2.connect(database=app.config['DATABASE_URL'])

    def get_features_within_bounds(self, north, south, east, west):
        cursor = self.conn.cursor()
        cursor.execute("SELECT osm_id, name, ST_X(planet_osm_point.way), ST_Y(planet_osm_point.way) "
                       "FROM planet_osm_point "
                       "WHERE amenity = 'parking' "
                       "AND ST_CONTAINS("
                            "ST_MakeEnvelope(%s, %s, %s, %s, 4326), "
                            "planet_osm_point.way);", (west, south, east, north))
        return [self.__convert_sql_result_to_dict(sql_result) for sql_result in cursor.fetchall()]

    @staticmethod
    def __convert_sql_result_to_dict(sql_result):
        return {
            'osmId': sql_result[0],
            'name': sql_result[1],
            'longitude': sql_result[2],
            'latitude': sql_result[3]
        }

feature_service = FeatureService()


######## Routes ########

@app.route('/')
def map_view():
    return render_template('map-view.html')


@app.route('/api/features')
def features():
    request_data = {
        'north': request.args.get('north', type=float),
        'east': request.args.get('east', type=float),
        'south': request.args.get('south', type=float),
        'west': request.args.get('west', type=float)
    }
    validate_request(request_data, GetFeaturesRequest)
    features_within_bounds = feature_service.get_features_within_bounds(**request_data)
    return Response(json.dumps(features_within_bounds), mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)

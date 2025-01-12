from flask import Blueprint, jsonify, request

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

@api_blueprint.route('/data', methods=['POST'])
def post_data():
    data = request.json  # Get JSON payload from request
    return jsonify({'received': data}), 201

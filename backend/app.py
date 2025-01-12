from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from the React frontend

@app.route('/api/filter', methods=['POST'])
def apply_filters():
    data = request.json  # Get JSON data from the request body
    filters = data.get("filters", {})
    file_content = data.get("fileContent", {})

    # Apply filters to the JSON data (example logic)
    filtered_data = [
        record for record in file_content
        if (not filters.get("gender") or record.get("gender") == filters["gender"]) and
           (not filters.get("continent") or record.get("continent") == filters["continent"]) and
           (not filters.get("ageGroup") or record.get("ageGroup") == filters["ageGroup"]) and
           (not filters.get("race") or record.get("race") == filters["race"])
    ]
    print(filtered_data)
    return jsonify({
        "message": "Filters applied successfully!",
        "filteredData": filtered_data
    })

if __name__ == '__main__':
    app.run(debug=True)

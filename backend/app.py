from flask import Flask, jsonify, request
from flask_cors import CORS
from bias import calculate_filtered_false_positive_rate, calculate_filtered_demographic_parity, calculate_group_disparity, assign_letter_grade
from firebase import get_data, save_data, delete_data

app = Flask(__name__)
CORS(app)  # allow requests from React frontend

def lowercase_data(data):
    """convert all keys and values in a dictionary or list to lowercase."""
    if isinstance(data, dict):
        return {k.lower(): (v.lower() if isinstance(v, str) else v) for k, v in data.items()}
    elif isinstance(data, list):
        return [lowercase_data(item) for item in data]
    return data

@app.route('/api/filter', methods=['POST'])
def apply_filters():
    try:
        data = request.json  # get JSON data from the request body
        print("Incoming data:", data)  # Debug the data

        # convert filters and dataset to lowercase for consistency
        filters = lowercase_data(data.get("filters", {}))
        dataset = lowercase_data(data.get("fileContent", []))
        # print("Filters:", filters)
        # print("Data:", dataset)

        # use methods in bias.py to process the dataset
        false_positive_rate = calculate_filtered_false_positive_rate(dataset, filters)
        demographic_parity = calculate_filtered_demographic_parity(dataset, filters)
        group_disparity = calculate_group_disparity(dataset, filters)
        overall_grade = assign_letter_grade(false_positive_rate, group_disparity)

        # create snapshot to be saved in the database
        snapshot = {
            "filtersApplied": filters,
            "metrics": {
                "falsePositiveRate": false_positive_rate,
                "demographicParity": demographic_parity,
                "groupDisparity": group_disparity
            },
            "overallGrade": overall_grade
        }
        
        print(snapshot)

        return jsonify({
            "message": "Filters applied successfully!",
            "snapshot": snapshot
        })
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "An error occurred while applying filters"}), 500


if __name__ == '__main__':
    app.run(debug=True)

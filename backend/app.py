from flask import Flask, jsonify, request
from flask_cors import CORS
from bias import calculate_filtered_false_positive_rate, calculate_filtered_demographic_parity, calculate_group_disparity, assign_letter_grade
from firebase import get_data_with_user_sub, save_data, delete_data

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
        data = request.json  # Get JSON data from the request body
        print("Incoming data:", data)  # Debug the data

        # Extract the user ID
        user = data.get("userId", None)
        if not user:
            return jsonify({"message": "User ID is missing from the request"}), 400
        
        print(f"Processing filters for user: {user}")

        # Convert filters and dataset to lowercase for consistency
        filters = lowercase_data(data.get("filters", {}))
        dataset = lowercase_data(data.get("fileContent", []))
        
        # Debugging output
        print("Filters:", filters)
        print("Data:", dataset)

        # Use methods in bias.py to process the dataset
        false_positive_rate = calculate_filtered_false_positive_rate(dataset, filters)
        demographic_parity = calculate_filtered_demographic_parity(dataset, filters)
        group_disparity = calculate_group_disparity(dataset, filters)
        overall_grade = assign_letter_grade(false_positive_rate, group_disparity)

        # Create snapshot to be saved in the database
        snapshot = {
            "userId": user,  # Include user ID in the snapshot
            "filtersApplied": filters,
            "metrics": {
                "falsePositiveRate": false_positive_rate,
                "demographicParity": demographic_parity,
                "groupDisparity": group_disparity
            },
            "overallGrade": overall_grade
        }

        # Save the snapshot to Firebase under the user's ID
        try:
            reference_path = f"snapshots/{user}"  # Define a path like snapshots/{userId}
            save_data(reference_path, snapshot)
            print(f"Snapshot saved to {reference_path}")
        except Exception as save_error:
            print(f"Error saving snapshot to Firebase: {save_error}")
            return jsonify({"message": "Failed to save snapshot to the database"}), 500

        print(snapshot)

        return jsonify({
            "message": "Filters applied and snapshot saved successfully!",
            "snapshot": snapshot
        })
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "An error occurred while applying filters"}), 500


@app.route('/api/get_user_data', methods=['POST'])
def get_user_data_api():
    try:
        data = request.json  # Get JSON data from the request body
        user_id = data.get("userId", None)
        
        if not user_id:
            return jsonify({"message": "User ID is missing from the request"}), 400
        
        print(f"Retrieving data for user ID: {user_id}")
        
        # Call the get_user_data function to fetch data for the user
        user_data = get_user_data(user_id)
        
        if not user_data:
            return jsonify({
                "message": f"No data found for user ID: {user_id}",
                "data": None
            }), 404
        
        return jsonify({
            "message": "User data retrieved successfully!",
            "data": user_data
        })
    except Exception as e:
        print(f"Error in get_user_data_api: {e}")
        return jsonify({"message": "An error occurred while retrieving user data"}), 500


def get_user_data(user_id):
    try:
        # Define the root path to search for user-related data
        root_reference = "snapshots"
        
        # Get all data under the root reference
        all_data = get_data_with_user_sub(root_reference)
        
        if not all_data:
            print("No data found in the database.")
            return None
        
        # Filter data by user ID
        user_data = {key: value for key, value in all_data.items() if value.get("userId") == user_id}
        
        if not user_data:
            print(f"No data found for user ID: {user_id}")
            return None
        
        print(f"Data for user {user_id}: {user_data}")
        return user_data
    except Exception as e:
        print(f"Error retrieving data for user {user_id}: {e}")
        return None


if __name__ == '__main__':
    app.run(debug=True)

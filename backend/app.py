from flask import Flask, jsonify, request
from flask_cors import CORS
from bias import calculate_filtered_false_positive_rate, calculate_filtered_demographic_parity, calculate_group_disparity, assign_letter_grade
from firebase import get_data_with_user_sub, save_data, delete_data
from datetime import datetime



app = Flask(__name__)
CORS(app)  # allow requests from React frontend
user = 0
filters = 0
false_positive_rate = 0
demographic_parity = 0
group_disparity = 0
overall_grade = 0


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

        return jsonify({
            "message": "Filters applied and snapshot saved successfully!",
            "snapshot": snapshot
        })
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "An error occurred while applying filters"}), 500


@app.route('/api/save_snapshot', methods=['POST'])
def save_snapshot_api():
    try:
        print("Tried saving")
        data = request.json  # Get JSON data from the request body
        print("Incoming data:", data)  # Debug the data
        
        # Extract the user ID and snapshot name
        user = data.get("userId", None)
        snapshot_name = data.get("snapshotName", None)
        snapshot = data.get("metrics")
        if not user:
            print("userid is missing")
            return jsonify({"message": "User ID is missing from the request"}), 400

        if not snapshot_name:
            print("snapshot name is missing")
            return jsonify({"message": "Snapshot name is missing from the request"}), 400

        false_positive_rate = snapshot.get("falsePositiveRate", 0)
        demographic_parity = snapshot.get("demographicParity", 0)
        group_disparity = snapshot.get("groupDisparity", 0)
        overall_grade = data.get("overallGrade", "F")

        # Save the snapshot to Firebase under a unique ID
        try:
            # Prepare the snapshot to be saved
            snapshot = {
                "userId": user,
                "snapshotName": snapshot_name,  # Include snapshot name
                "filtersApplied": filters,
                "metrics": {
                    "falsePositiveRate": false_positive_rate,
                    "demographicParity": demographic_parity,
                    "groupDisparity": group_disparity
                },
                "overallGrade": overall_grade,
                "timestamp": datetime.utcnow().isoformat()  # Include a timestamp for the snapshot
            }
            # Generate a unique ID for the snapshot using snapshot name and a timestamp
            unique_id = f"{snapshot_name}_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"
            reference_path = f"snapshots/{user}/{unique_id}"  # Path: snapshots/{user}/{snapshot_name_timestamp}
            save_data(reference_path, snapshot)
            print(f"Snapshot saved to {reference_path}")
        except Exception as save_error:
            print(f"Error saving snapshot to Firebase: {save_error}")
            return jsonify({"message": "Failed to save snapshot to the database"}), 500

        # Return success response
        return jsonify({
            "message": "Snapshot saved successfully!",
            "snapshot": snapshot
        })
    except Exception as e:
        print(f"Error in save_snapshot_api: {e}")
        return jsonify({"message": "An error occurred while saving snapshot"}), 500



@app.route('/api/get_user_data', methods=['POST'])
def get_user_data_api():
    try:
        # Retrieve JSON data from the request body
        data = request.json
        user_id = data.get("userId", None)
        
        if not user_id:
            return jsonify({"message": "User ID is missing from the request"}), 400
        
        print(f"Retrieving data for user ID: {user_id}")
        
        # Fetch user data using the get_data_with_user_sub function
        user_data = get_data_with_user_sub(user_id)
        
        if not user_data:
            return jsonify({
                "message": f"No snapshots found for user ID: {user_id}",
                "snapshots": []
            }), 404

        # Debug output
        print("Fetched user data:", user_data)

        # Extract snapshots (filter out non-snapshot keys)
        snapshots = []
        for key, snapshot in user_data.items():
            # Skip non-snapshot keys
            if not isinstance(snapshot, dict) or "snapshotName" not in snapshot:
                continue
            
            snapshots.append({
                "id": key,  # Firebase key as ID
                "name": snapshot.get("snapshotName", f"Snapshot {key}"),
                "timestamp": snapshot.get("timestamp", "N/A"),
                "falsePositiveRate": snapshot["metrics"].get("falsePositiveRate", 0),
                "demographicParity": snapshot["metrics"].get("demographicParity", 0),
                "groupDisparity": snapshot["metrics"].get("groupDisparity", 0),
                "grade": snapshot.get("overallGrade", "N/A")
            })
        
        # Check if snapshots list is empty
        if not snapshots:
            return jsonify({
                "message": f"No snapshots found for user ID: {user_id}",
                "snapshots": []
            }), 404

        # Return the processed snapshots
        return jsonify({
            "message": "Snapshots retrieved successfully!",
            "snapshots": snapshots
        })

    except Exception as e:
        print(f"Error in get_user_data_api: {e}")
        return jsonify({"message": "An error occurred while retrieving snapshots"}), 500





if __name__ == '__main__':
    app.run(debug=True)

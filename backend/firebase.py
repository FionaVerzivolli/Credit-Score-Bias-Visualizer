import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Initialize Firebase app only once
def initialize_firebase():
    if not firebase_admin._apps:  # Check if Firebase has already been initialized
        cred = credentials.Certificate('secret key.json')
        firebase_admin.initialize_app(cred, {
            'databaseURL': "https://deltahacks-1334c-default-rtdb.firebaseio.com/"
        })


# Function to retrieve all references containing the user.sub within 'snapshots'
def get_data_with_user_sub(user_sub):
    initialize_firebase()  # Ensure Firebase is initialized
    reference_path = "snapshots"
    try:
        ref = db.reference(reference_path)
        data = ref.get()

        if not data:
            print(f"No data found at {reference_path}")
            return None

        # Search for references that contain the user.sub within 'snapshots'
        matching_references = {}

        def find_matches(data, path=""):
            if isinstance(data, dict):
                for key, value in data.items():
                    new_path = f"{path}/{key}" if path else key
                    if user_sub in str(key) or user_sub in str(value):
                        # If a match is found, store the entire node's contents
                        matching_references[new_path] = value
                    find_matches(value, new_path)

        find_matches(data)

        if not matching_references:
            print(f"No matching references found for user.sub: {user_sub}")
        else:
            print(f"Found {len(matching_references)} matching references for user.sub: {user_sub}")
        
        return matching_references

    except Exception as e:
        print(f"Error retrieving data with user.sub {user_sub}: {e}")
        return None



# Function to save data to a given reference
def save_data(reference_path, data):
    initialize_firebase()  # Ensure Firebase is initialized
    try:
        ref = db.reference(reference_path)
        ref.set(data)
        print(f"Data saved successfully to {reference_path}")
    except Exception as e:
        print(f"Error saving data to {reference_path}: {e}")


# Function to delete data at a given reference
def delete_data(reference_path):
    initialize_firebase()  # Ensure Firebase is initialized
    try:
        ref = db.reference(reference_path)
        ref.delete()
        print(f"Data deleted successfully from {reference_path}")
    except Exception as e:
        print(f"Error deleting data from {reference_path}: {e}")


if __name__ == "__main__":

    # User sub to search for
    user_sub = "google-oauth2|102358690028127056038"  # Replace with the actual user.sub value

    # Retrieve and print matching data
    matching_data = get_data_with_user_sub(user_sub)
    print("Matching data:", matching_data)
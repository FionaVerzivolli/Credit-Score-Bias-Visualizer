import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

def get_credentials():
    # Fetch the service account key JSON file contents
    cred = credentials.Certificate('secret key.json')

    # Initialize the app with a service account, granting admin privileges
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://deltahacks-1334c-default-rtdb.firebaseio.com/"
    })

# Function to retrieve all references containing the user.sub
def get_data_with_user_sub(reference_path, user_sub):
    get_credentials()
    try:
        ref = db.reference(reference_path)
        data = ref.get()

        if not data:
            print(f"No data found at {reference_path}")
            return None

        # Search for references that contain the user.sub
        matching_references = {}

        def find_matches(data, path=""):
            if isinstance(data, dict):
                for key, value in data.items():
                    new_path = f"{path}/{key}" if path else key
                    if user_sub in str(key) or user_sub in str(value):
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
    get_credentials()
    try:
        ref = db.reference(reference_path)
        ref.set(data)
        print(f"Data saved successfully to {reference_path}")
    except Exception as e:
        print(f"Error saving data to {reference_path}: {e}")


# Function to delete data at a given reference
def delete_data(reference_path):
    get_credentials()
    try:
        ref = db.reference(reference_path)
        ref.delete()
        print(f"Data deleted successfully from {reference_path}")
    except Exception as e:
        print(f"Error deleting data from {reference_path}: {e}")

# Example usage
if __name__ == "__main__":
    # Define a test reference path
    test_reference = "example/data"

    # Save data
    sample_data = {
        "user1": {"name": "Alice", "age": 25, "city": "New York"},
        "user2": {"name": "Bob", "age": 30, "city": "San Francisco"}
    }
    save_data(test_reference, sample_data)

    # Retrieve and print data
    data = get_data(test_reference)
    print("Retrieved data:", data)

    # Delete data
    delete_data(test_reference)
    deleted_data = get_data(test_reference)
    print("Data after deletion:", deleted_data)

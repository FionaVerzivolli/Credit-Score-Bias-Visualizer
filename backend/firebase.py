import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Fetch the service account key JSON file contents
cred = credentials.Certificate('secret key.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': "URL to database"
})

# Function to retrieve data from a given reference
def get_data(reference_path):
    try:
        ref = db.reference(reference_path)
        data = ref.get()
        return data
    except Exception as e:
        print(f"Error retrieving data from {reference_path}: {e}")
        return None

# Function to save data to a given reference
def save_data(reference_path, data):
    try:
        ref = db.reference(reference_path)
        ref.set(data)
        print(f"Data saved successfully to {reference_path}")
    except Exception as e:
        print(f"Error saving data to {reference_path}: {e}")


# Function to delete data at a given reference
def delete_data(reference_path):
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

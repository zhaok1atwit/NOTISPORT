#Parses through given JSON recurisvely until given key is found
#and returns the data within the key
#
#obj = JSON file
#key = key string
#
def json_parsing(obj, key):
    arr = []

    def extract(obj, arr, key):
        """Return all matching values in an object."""
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict)) or (isinstance(v, (list)) and  v and isinstance(v[0], (list, dict))):
                    extract(v, arr, key)
                elif k == key:
                    arr.append(v)
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr

    results = extract(obj, arr, key)
    return results[0] if results else results

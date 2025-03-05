import json

def load_ddl(view_name):
    """Loads the DDL statement for the given view name from JSON file."""
    
    with open("../data/ddl_statements.json", "r") as file:
        ddl_data = json.load(file)
    
    return ddl_data.get(view_name, None)

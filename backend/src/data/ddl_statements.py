import json
from pathlib import Path

def get_ddl_statement(view_name: str) -> str:
    """
    Get the DDL statement for a specific view from the JSON file.
    """
    json_path = Path(__file__).parent / "ddl_statements.json"
    print(f"Looking for DDL statement for view: {view_name}")
    print(f"DDL statements file path: {json_path}")
    
    try:
        with open(json_path, 'r') as f:
            ddl_statements = json.load(f)
            print(f"Available views: {list(ddl_statements.keys())}")
            statement = ddl_statements.get(view_name)
            if statement:
                print(f"Found DDL statement for view {view_name}")
            else:
                print(f"No DDL statement found for view {view_name}")
            return statement
    except FileNotFoundError:
        print(f"DDL statements file not found at {json_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error decoding DDL statements file at {json_path}")
        return None
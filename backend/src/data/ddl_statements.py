import json
from pathlib import Path

def get_ddl_statement(view_key: str) -> str:
    """
    Get the DDL schema for a specific view (using user-friendly key) from the JSON file.
    """
    json_path = Path(__file__).parent / "ddl_statements.json"
    print(f"Looking for DDL for view key: {view_key}")
    print(f"DDL statements file path: {json_path}")

    try:
        with open(json_path, 'r') as f:
            ddl_statements = json.load(f)
            print(f"Available view keys: {list(ddl_statements.keys())}")

            view_config = ddl_statements.get(view_key)
            if view_config and "schema" in view_config:
                print(f"Found schema for view key {view_key}")
                return view_config["schema"]
            else:
                print(f"No schema found for view key {view_key}")
                return None
    except FileNotFoundError:
        print(f"DDL statements file not found at {json_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error decoding DDL statements file at {json_path}")
        return None

import pandas as pd
import json

def create_circle_packing_json(csv_file, hierarchy_columns, value_column, output_file):
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file)
    
    # Extract the necessary columns from the DataFrame
    data = df[hierarchy_columns + [value_column]].copy()
    
    # Create a hierarchical structure from the extracted columns
    root = {"name": "flare", "children": []}
    
    for _, row in data.iterrows():
        current_node = root
        for column in hierarchy_columns:
            name = row[column]
            if "children" not in current_node:
                current_node["children"] = []
            
            child = next((c for c in current_node["children"] if c["name"] == name), None)
            if child is None:
                child = {"name": name}
                current_node["children"].append(child)
            current_node = child
        
        current_node["value"] = current_node.get("value", 0) + 1
    
    # Convert the hierarchical structure to circle-packing JSON
    circle_packing_json = json.dumps(root, indent=4)
    
    # Save the circle-packing JSON to a file
    with open(output_file, "w") as file:
        file.write(circle_packing_json)
    
    print(f"Circle-packing JSON saved in '{output_file}' file.")

csv_file = "../data/circle_packing_netflix.csv" 
hierarchy_columns = ["type", "country", "rating", "listed_in"]  # Columns representing the hierarchy
value_column = "Value"  # Column representing the values
output_file = "circle_packing.json"  # Output file name

create_circle_packing_json(csv_file, hierarchy_columns, value_column, output_file)

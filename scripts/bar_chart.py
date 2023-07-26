import pandas as pd

# Read the CSV file into a pandas DataFrame
df = pd.read_csv("../data/netflix_titles.csv")

# Count the frequency of each "rating"
rating_frequency_descending = df["rating"].value_counts().reset_index()
rating_frequency_descending.columns = ["group", "count"]

# Save the result to a CSV file
rating_frequency_descending.to_csv("../data/rating_frequency_descending.csv", index=False)

# Load the CSV data
file_path = "../data/netflix_titles.csv"
data = pd.read_csv(file_path)

# Filter the data to keep only TV-MA shows
tvma_shows = data[data["rating"] == "TV-MA"]

# Initialize a dictionary to store the frequency of each category of seasons
season_frequency = {}

# Loop through each TV-MA show
for _, show in tvma_shows.iterrows():
    # Extract the number of seasons from the 'duration' column (assuming the duration is in the format 'X Seasons')
    duration_info = show["duration"].lower()  # Convert to lowercase to handle case-insensitive matching
    if "season" in duration_info:
        season_info = duration_info.split(" ")[0]
        num_seasons = int(season_info)

        # Increment the frequency count for the corresponding category of seasons
        if num_seasons in season_frequency:
            season_frequency[num_seasons] += 1
        else:
            season_frequency[num_seasons] = 1

# Convert the dictionary to a DataFrame
df_season_frequency = pd.DataFrame(list(season_frequency.items()), columns=["seasons", "count"])
df_season_frequency = df_season_frequency.sort_values(by="seasons")

# Save the DataFrame to a CSV file
output_file_path = "../data/tvMA_seasons.csv"
df_season_frequency.to_csv(output_file_path, index=False)



import pandas as pd

# Read CSV data from the file
csv_file = "../data/netflix_titles.csv"
df = pd.read_csv(csv_file)

# Filter the DataFrame to include only "TV-MA" ratings and release_year from 2002 onwards
tv_ma_df = df[(df["rating"] == "TV-MA") & (df["release_year"] >= 2002) & (df["release_year"] <= 2021)]

# Group by release_year and calculate the cumulative total
rating_count_by_year = tv_ma_df.groupby("release_year").size().cumsum().reset_index(name="cumulative_sum")

# Store the output in a new CSV file
output_file = "../data/tvMA_cumulative_perYear.csv"
rating_count_by_year.to_csv(output_file, index=False)

##############################

# Read CSV data from the file (assuming the file is named "original_data.csv")
csv_file = "../data/netflix_stock.csv"
df = pd.read_csv(csv_file)

# Convert the "Date" column to datetime format
df["Date"] = pd.to_datetime(df["Date"])

# Filter to include only the dates up to the last day of 2021
last_day_2021 = pd.Timestamp("2021-12-31")
filtered_data = df[df["Date"] <= last_day_2021][["Date", "Close"]]

# Rename the columns to "date" and "value"
filtered_data = filtered_data.rename(columns={"Date": "date", "Close": "value"})

# Store the filtered data in a new CSV file (assuming the file is named "closing_stock.csv")
output_file = "../data/closing_stock.csv"
filtered_data.to_csv(output_file, index=False)


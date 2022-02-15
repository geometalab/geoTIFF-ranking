import csv
import json
import os
from os.path import exists
import matplotlib.pyplot as plt
import numpy as np


# Find the csv and the geojson file
def find_file():
    output_path_qrank = "output-qrank.geojson"
    output_path_osm_synced = "output-tile-logs-synced.geojson"
    qrank_file = "qrank.csv"
    geojson_file = "output-tile-logs.geojson"

    if not exists(qrank_file):
        print("Could not find a file named %s." % qrank_file)
        exit()

    file_list = []

    for file in os.listdir():
        if file.endswith(".geojson"):
            file_list.append(file)

    if not exists(geojson_file):
        if len(file_list) == 0:
            print("Found no geojson file.")
            exit()

        if len(file_list) > 1:
            print("Found more than one .geojson file, please specify which file to use:")
            geojson_file = input("Enter file name: ")

        if len(file_list) == 1:
            geojson_file = file_list[0]

    return qrank_file, geojson_file, output_path_qrank, output_path_osm_synced


def get_qrank(wikidata_tag, rows):
    for row in rows:
        if row[0] == wikidata_tag:
            return int(row[1])

    # If tag is not found, we return 0
    return 0


# Filter out all features which do not include a wikidata property
def filter_unusable_features(data):
    len_before = len(data['features'])
    data['features'] = [feature for feature in data['features'] if "wikidata" in feature['properties']]
    len_after = len(data['features'])
    num_unusable_features = len_before - len_after
    return data, num_unusable_features


# Distribution of OSM Features with a Wikidata Tag in comparison to all OSM Features, ranked by OSM Tile Logs
def create_visualisation(data):
    arr = []
    for x in range(0, len(data['features'])):
        if "wikidata" in data['features'][x]['properties']:
            arr.append(x)

    x = np.array(arr)
    n, bins, patches = plt.hist(x, bins=100)
    plt.xlabel("Ranking positions by OSM Tile logs rank")
    plt.ylabel("Number of OSM Features with a Wikidata Tag")
    plt.title("Distribution of Features with a wikidata tag")
    plt.show()


def generate_ranking_from_geojson():
    qrank_file, geojson_file, output_path_qrank, output_path_osm_synced = find_file()

    qrank_rows = []

    # reading qrank.csv file
    print("Loading data from %s..." % qrank_file)
    with open(qrank_file, 'r') as csvfile:
        csvreader = csv.reader(csvfile)

        # extracting each data row one by one
        for row in csvreader:
            qrank_rows.append(row)

    # reading geojson file
    print("Loading data from %s..." % geojson_file)
    with open(geojson_file, "r", encoding='utf-8') as f:
        data = json.load(f)

    # Display Distribution of OSM Features with a Wikidata Tag
    # create_visualisation(data)

    # Looping through all remaining features, getting the qrank for each one
    print("Adding qrank property to data.")
    progress_count = 0
    for feature in data['features']:
        progress_count += 1
        print("Processing %s of %s features" % (progress_count, len(data['features'])))
        # add the qrank property to the feature
        if 'wikidata' in feature['properties']:
            wikidata_tag = feature['properties']['wikidata']
            feature['properties'].update({"qrank": get_qrank(wikidata_tag, qrank_rows)})

    # Override the geojson file, now with added qrank where wikidata tag is available
    with open(geojson_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    # Remove all features not containing a wikidata tag
    data, num_of_missing_wikidata_tag = filter_unusable_features(data)

    # Sort and Rank by Tile Views
    data['features'] = sorted(data['features'], key=lambda x: float(x['properties']['tile_count']), reverse=True)
    rank = 0
    for feature in data['features']:
        rank += 1
        feature['properties'].update({"osm_views_rank": rank})

    # Sort and Rank by QRank
    data['features'] = sorted(data['features'], key=lambda x: float(x['properties']['qrank']), reverse=True)
    rank = 0
    for feature in data['features']:
        rank += 1
        feature['properties'].update({"qrank_rank": rank})

    qrank_ordered_data = data

    # Save the qrank file
    with open(output_path_qrank, "w", encoding="utf-8") as f:
        json.dump(qrank_ordered_data, f, indent=4, ensure_ascii=False)

    # Sort by Tile Views again
    data['features'] = sorted(data['features'], key=lambda x: float(x['properties']['tile_count']), reverse=True)
    osm_ordered_data = data

    # Save the synced osm file
    with open(output_path_osm_synced, "w", encoding="utf-8") as f:
        json.dump(osm_ordered_data, f, indent=4, ensure_ascii=False)



    # Print infos
    print("%s of the features did not contain a wikidata tag." % num_of_missing_wikidata_tag)
    print("%s features have been ranked" % (len(data['features'])))


if __name__ == '__main__':
    generate_ranking_from_geojson()

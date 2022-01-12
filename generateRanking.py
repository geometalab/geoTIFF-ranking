import csv
import json
import os
from os.path import exists


# Find the csv and the geojson file
def find_file():
    output_file = "output-qrank.geojson"
    qrank_file = "qrank.csv"
    geojson_file = ""

    if not exists(qrank_file):
        print("Could not find a file named %s." % qrank_file)
        exit()

    file_list = []

    for file in os.listdir():
        if file.endswith(".geojson"):
            file_list.append(file)

    if len(file_list) == 0:
        print("Found no geojson file.")
        exit()

    if len(file_list) > 2:
        print("Found more than one .geojson file, please specify which file to use:")
        geojson_file = input("Enter file name: ")

    if len(file_list) == 1:
        geojson_file = file_list[0]

    return qrank_file, geojson_file, output_file


def get_qrank(wikidata_tag, rows):
    for row in rows:
        if row[0] == wikidata_tag:
            return row[1]

    # If tag is not found, we return 0
    return 0

# Filter out all features which do not include a wikidata property
def filter_unusable_features(data):
    len_before = len(data['features'])
    data['features'] = [feature for feature in data['features'] if "wikidata" in feature['properties']]
    len_after = len(data['features'])
    num_unusable_features = len_before - len_after
    return data, num_unusable_features


def generate_ranking_from_geojson():
    qrank_file, geojson_file, output_file = find_file()

    qrank_rows = []

    # reading csv file
    print("Loading data from %s..." % qrank_file)
    with open(qrank_file, 'r') as csvfile:
        csvreader = csv.reader(csvfile)

        # extracting each data row one by one
        for row in csvreader:
            qrank_rows.append(row)

    print("Loading data from %s..." % geojson_file)
    with open(geojson_file, "r", encoding='utf-8') as f:
        data = json.load(f)

    data, num_of_missing_wikidata_tag = filter_unusable_features(data)

    print("Adding qrank property to data.")
    progress_count = 0
    for feature in data['features']:
        progress_count += 1
        print("Processing %s of %s features" % (progress_count, len(data['features'])))
        # add the qrank property to the feature
        wikidata_tag = feature['properties']['wikidata']
        feature['properties'].update({"qrank": get_qrank(wikidata_tag, qrank_rows)})

    # Sort by qrank
    print("Sorting and saving data to %s." % output_file)
    data['features'] = sorted(data['features'], key=lambda x: int(x['properties']['qrank']), reverse=True)

    # Create new file or truncate already existing one and dump json data
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("%s of the features did not contain a wikidata tag." % num_of_missing_wikidata_tag)
    print("%s features have been ranked" % (len(data['features'])))
    print("Done.")


if __name__ == '__main__':
    generate_ranking_from_geojson()

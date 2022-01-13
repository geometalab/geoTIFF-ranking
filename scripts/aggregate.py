import os
import subprocess
import json
import shutil
from os.path import exists

tif_path = None
json_path = None
output_path = "output-tile-logs.geojson"


def val_at_coord(coordinates):
    result = subprocess.run(['gdallocationinfo', tif_path, '-xml', '-wgs84', str(coordinates[0]), str(coordinates[1])],
                            capture_output=True, text=True)
    if result.stderr != "":
        raise Exception("Exception while executing gdallocationinfo: " + result.stderr)
    xml = result.stdout
    result = xml[xml.find('<Value>') + 7: xml.find('</Value>')]
    return result


# Finds the tif_path and json_path file and prompts user if multiple are found/aborts if none are found
def find_file(extensions):
    num_of_occurrences = 0
    found_file = 0

    for file in os.listdir():
        for extension in extensions:
            if file.endswith(extension):
                if file != output_path:
                    num_of_occurrences += 1
                    found_file = file
                else:
                    print("Can not use %s as this is an output file." % output_path)

    if num_of_occurrences == 0:
        print('Could not find any %s files. Please place one in the same directory as this script.' % extensions)
        exit()

    if num_of_occurrences == 1:
        print('Using %s as %s file.' % (found_file, extensions))
        return found_file

    if num_of_occurrences > 1:
        found_file = input(
            'Multiple %s files found. Please enter the %s file which you want to use: \n' % (extensions, extensions))
        if exists(found_file):
            return found_file
        else:
            print("File %s does not exist" % found_file)
            exit()


# checks if the geometry of the feature is a point and warns if not
# also the place for future handling of areas
# TODO handling of areas/relations
def calculate_coordinates(feature):
    if feature['geometry']['type'] == "Point":
        return feature['geometry']['coordinates']
    else:
        print('The feature %s is not a Point. As this script only supports point, replace your out statement in your '
              'overpass turbo query with "out center;"')
        exit()


# outputs a minimalist version of the json, only containing name, coordinates and tile count
def reduce_content(data):
    name = ""
    wikidata = ""
    for feature in data['features']:
        if 'name' in feature['properties']:
            name = feature['properties']['name']
        if 'wikidata' in feature['properties']:
            wikidata = feature['properties']['wikidata']
        tile_count = feature['properties']['tile_count']
        del feature['properties']
        feature.update({"properties": {}})
        if name != "":
            feature['properties'].update({"name": name})
        if wikidata != "":
            feature['properties'].update({"wikidata": wikidata})
        feature['properties'].update({"tile_count": tile_count})
        del feature['id']


def main(reduce):
    global tif_path
    global json_path
    tif_path = find_file(['.tif', 'tiff'])
    json_path = find_file(['.geojson'])

    # Load data from the geoJson file
    with open(json_path, "r+", encoding='utf-8') as f:
        data = json.load(f)

    progress = 1  # For progress indicator
    for feature in data['features']:
        print("Getting tile counts: %s of %s" % (progress, str(len(data["features"]))))

        value = val_at_coord(feature['geometry']['coordinates'])
        feature['properties'].update({"tile_count": value})
        progress += 1

    # Sort features by tile count, the highest first
    print("Sorting dataset...")
    data['features'] = sorted(data['features'], key=lambda x: float(x['properties']['tile_count']), reverse=True)

    # Remove some data to make output json cleaner
    if reduce:
        reduce_content(data)

    # Create new file or truncate already existing one and dump json data
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("Done. \n")


if __name__ == '__main__':
    simple_content = False  # Reduces properties in output geojson
    main(simple_content)

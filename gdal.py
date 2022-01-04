import os
import subprocess
import json
import shutil
from os.path import exists

tif_path = None
json_path = None
output_path = "output.geojson"


def val_at_coord(coordinates):
    result = subprocess.run(['gdallocationinfo', tif_path, '-xml', '-wgs84', str(coordinates[0]), str(coordinates[1])],
                            capture_output=True, text=True)
    if result.stderr != "":
        raise Exception("Exception while executing gdallocationinfo: " + result.stderr)
    xml = result.stdout
    result = xml[xml.find('<Value>') + 7: xml.find('</Value>')]
    return result


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


def main():
    global tif_path
    global json_path
    tif_path = find_file(['.tif', 'tiff'])
    json_path = find_file(['.geojson'])

    # Copy the geojson as to not edit the original data
    shutil.copy(json_path, output_path)

    # Open the copied geoJson file
    with open(output_path, "r+", encoding='utf-8') as f:
        data = json.load(f)
        progress = 1  # For progress indicator
        for feature in data['features']:
            print("Getting tilecounts: %s of %s" % (progress, str(len(data["features"]))))
            value = val_at_coord(feature['geometry']['coordinates'])
            feature.update({"tile count": value})
            progress += 1

        # Sort features by tilecount, highest first
        print("Sorting dataset...")
        data['features'] = sorted(data['features'], key=lambda x: x['tile count'])

        print("Ranking tile counts...")
        progress = 1
        for feature in data['features']:
            feature.update({"rank": progress})
            progress += 1

        # Clear old data and save data to file
        f.seek(0)
        f.truncate()
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("Done. \n")


if __name__ == '__main__':
    main()

import sys
import subprocess
import json
import shutil

tifPath = "out.tif"
jsonPath = "export.geojson"
outputPath = "output.geojson"


def val_at_coord(coordinates):
    result = subprocess.run(['gdallocationinfo', tifPath, '-xml', '-wgs84', str(coordinates[0]), str(coordinates[1])],
                            capture_output=True, text=True)
    print(str(coordinates[0]))
    if result.stderr != "":
        raise Exception("Exeption while excecuting gdallocationinfo: " + result.stderr)
    xml = result.stdout
    result = xml[xml.find('<Value>') + 7: xml.find('</Value>')]
    return result


if __name__ == '__main__':
    # Copy the geojson as to not edit the original data
    shutil.copy(jsonPath, outputPath)

    # Open the copied geoJson file
    with open(outputPath, "r+", encoding='utf-8') as f:
        data = json.load(f)
        progress = 1  # For progress indicator
        for feature in data['features']:
            print("Getting tilecounts: %s of %s" % (progress, str(len(data["features"]))))
            value = val_at_coord(feature['geometry']['coordinates'])
            feature.update({"tilecount": value})
            progress += 1

        # Sort features by tilecount, highest first
        print("Sorting dataset...")
        data['features'] = sorted(data['features'], key=lambda x: x['tilecount'])
        print("Dataset sorted.")

        progress = 1
        for feature in data['features']:
            print("Ranking tilecounts: %s of %s" % (progress, str(len(data["features"]))))
            feature.update({"rank": progress})
            progress += 1

        # Clear old data and save data to file
        f.seek(0)
        f.truncate
        json.dump(data, f, indent=4)

    print("Done. \n")

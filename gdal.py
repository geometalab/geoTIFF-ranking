import sys
import subprocess
import json
import shutil

tifPath = "out.tif"
jsonPath = "export.geojson"
outputPath = "output.geojson"

def val_at_coord(coordinates):
    result = subprocess.run(['gdallocationinfo', tifPath, '-xml', '-wgs84', str(coordinates[0]), str(coordinates[1])], capture_output=True, text=True)
    if result.stderr != "":
        raise Exception("Exeption while excecuting gdallocationinfo: " + result.stderr)
    xml = result.stdout
    result = xml[xml.find('<Value>') + 7 : xml.find('</Value>')]
    return result



if __name__ == '__main__':
    # Copy the geojson as to not edit the original data
    shutil.copy(jsonPath, outputPath)

    # Open the copied geoJson file
    with open(outputPath) as f:
        data = json.load(f)
        x = 0
        for feature in data['features']:
            value = val_at_coord(feature['geometry']['coordinates'])
            feature.update({"tilecount": value})
            x = x + 1
            print("progress: %s of %s"%(x, str(len(data["features"]))))

        f.write(json.dumps(data, f, indent=4))

    print("Done.")


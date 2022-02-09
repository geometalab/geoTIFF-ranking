import json
import math
from os.path import exists


def find_file():
    geojson_file = "output-tile-logs.geojson"
    if not exists(geojson_file):
        geojson_file = input(
            "Could not find a file named %s in current directory. Enter the file you want to process:" % geojson_file)
    return geojson_file


def rank_merge():
    geojson_file = find_file()
    method1_file = "stefan.geojson"
    method2_file = "sascha.geojson"

    calculate_rank(geojson_file, method1_file, 1)
    calculate_rank(geojson_file, method2_file, 2)


def calculate_rank(input_file, output_file, use_case):
    print("Opening File.")
    with open(input_file, "r", encoding='utf-8') as f:
        data = json.load(f)

    max_osmviews = data['features'][0]['properties']['tile_count']
    max_qrank = 0

    print("Calculating new rank property...")
    for feature in data['features']:
        rank = 0
        osm_views = feature['properties']['tile_count']
        if use_case == 1:
            # Stefan Keller's Method
            if 'qrank' in feature['properties'] and feature['properties']['qrank'] != 0:
                qrank = feature['properties']['qrank']
                rank = math.log10(osm_views) / 20 + math.log10(qrank) / 20
            else:
                rank = math.log10(osm_views) / 10
        elif use_case == 2:
            # Sasha Brawer's Method
            if 'qrank' in feature['properties'] and feature['properties']['qrank'] != 0:
                qrank = feature['properties']['qrank']
                if qrank > max_qrank:
                    max_qrank = qrank
                rank = math.log10(qrank) / math.log10(max_qrank) * 0.6 + math.log10(osm_views) / math.log10(
                    max_osmviews) * (1 - 0.6)
            else:
                rank = math.log10(osm_views) / 10
        else:
            print("Invalid usecase")
            exit()

        feature['properties'].update({"rank": rank})

    # Sort by newly generated rank property
    data['features'] = sorted(data['features'], key=lambda x: float(x['properties']['rank']), reverse=True)

    # Save method in file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("Done. Saved to %s." % output_file)
    if use_case == 2:
        print("Max OSM Views: %s, Max QRank: %s \n" % (max_osmviews, max_qrank))


if __name__ == '__main__':
    rank_merge()

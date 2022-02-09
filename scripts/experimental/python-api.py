import sys
import textwrap

from numbers import Real
import gdal
from osgeo import osr


def val_at_coord(filename: str,
                 longitude: Real, latitude: Real):
    ds = gdal.Open(filename, 1)
    if ds is None:
        raise Exception('Cannot open %s' % filename)

    # Build Spatial Reference object based on coordinate system, fetched from the opened dataset

    sr = osr.SpatialReference()
    sr.ImportFromEPSG(4326)
    ds.SetProjection(sr.ExportToWkt())

    srs = osr.SpatialReference()
    srs.ImportFromWkt(ds.GetProjection())

    srsLatLong = srs.CloneGeogCS()
    # Convert from (longitude,latitude) to projected coordinates
    ct = osr.CoordinateTransformation(srsLatLong, srs)
    (X, Y, height) = ct.TransformPoint(longitude, latitude)

    # Read geotransform matrix and calculate corresponding pixel coordinates
    geotransform = ds.GetGeoTransform()
    inv_geotransform = gdal.InvGeoTransform(geotransform)
    x = int(inv_geotransform[0] + inv_geotransform[1] * X + inv_geotransform[2] * Y)
    y = int(inv_geotransform[3] + inv_geotransform[4] * X + inv_geotransform[5] * Y)

    print('x=%d, y=%d' % (x, y))

    if x < 0 or x >= ds.RasterXSize or y < 0 or y >= ds.RasterYSize:
        raise Exception('Passed coordinates are not in dataset extent')

    res = ds.ReadAsArray(x, y, 1, 1)

    if len(res.shape) == 2:
        print(res[0][0])
    else:
        for val in res:
            print(val[0][0])

    return res



if __name__ == '__main__':
    path = "C:/Users/zahne/Downloads/osmviews(1).tiff"
    print(val_at_coord(path, 8.23, 47.15))

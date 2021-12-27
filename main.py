import sys
import textwrap


from numbers import Real
from osgeo import gdalconst, osr, gdal


def val_at_coord(filename: str,
                 longitude: Real, latitude: Real, coordtype_georef: bool,
                 print_xy: bool, print_values: bool):
    ds = gdal.Open(filename, gdal.GA_ReadOnly)
    if ds is None:
        raise Exception('Cannot open %s' % filename)

    # Build Spatial Reference object based on coordinate system, fetched from the opened dataset
    if coordtype_georef:
        X = longitude
        Y = latitude
    else:
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

    if print_xy:
        print('x=%d, y=%d' % (x, y))

    if x < 0 or x >= ds.RasterXSize or y < 0 or y >= ds.RasterYSize:
        raise Exception('Passed coordinates are not in dataset extent')

    res = ds.ReadAsArray(x, y, 1, 1)
    if print_values:
        if len(res.shape) == 2:
            print(res[0][0])
        else:
            for val in res:
                print(val[0][0])

    return res


if __name__ == '__main__':
    path = "out.tif"
    val_at_coord(path, 1, 1, True, True, True)

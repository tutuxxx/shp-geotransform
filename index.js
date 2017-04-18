var shpTransform = require('./lib/shpTransform');
/**
 *@param originFileName
 *@param transformType(gcj2wgs、wgs2gcj、gcj2bd、wgs2bd、bd2gcj)
 */
shpTransform('polygon.shp', 'wgs2bd');
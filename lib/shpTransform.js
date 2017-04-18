var shpTransform = function (shpFileName, transformType) {
    var gdal = require('gdal');
    var geoTransform = require('./geoTransform');

    //设置编码为GBK
    gdal.config.set('SHAPE_ENCODING', 'CP936');

    //获取原始图层信息
    var originDS = gdal.open('origin-shp/' + shpFileName, "r");
    var originLayer = originDS.layers.get(0);
    var featuresCount = originLayer.features.count();

    console.log("图层首元素空间数据:" + originLayer.features.first().getGeometry().toJSON());
    console.log("图层中要素数量: " + featuresCount);
    console.log("图层所含字段: " + originLayer.fields.getNames());
    console.log("图层边界范围: " + JSON.stringify(originLayer.getExtent()));
    console.log("图层坐标系: " + (originLayer.srs ? originLayer.srs.toWKT() : 'null'));

    if (featuresCount == 0) {
        console.log('原始SHP文件中无要素...');
        return;
    }

    var originAttrs = originLayer.fields.getNames();
    var originGeomTypeStr = originLayer.features.first().getGeometry().toObject().type;

    //创建新图层
    var resultDS = gdal.open('result-shp/' + shpFileName.split('.')[0] + '_' + transformType + '.shp', "w", 'ESRI Shapefile');
    var srs = gdal.SpatialReference.fromEPSGA(4326);
    resultDS.layers.create('0', srs, gdal[originGeomTypeStr]);

    var resultLayer = resultDS.layers.get(0);

    //封装新增的字段及其属性
    function getFieldDefn(name) {
        var fieldDefn = originLayer.fields.get(name);
        var defn = new gdal.FieldDefn(name, getFieldType(fieldDefn.type));
        var originDefn = originLayer.fields.get(name);
        for (var o in defn) {
            defn[o] = originDefn[o];
        }
        return fieldDefn;
    }

    //转换字段类型的表述方式
    function getFieldType(type) {
        return type == 'string' ? gdal.OFTString : type == 'integer' || type == 'integer64' ? gdal.OFTInteger : type == 'real' ? gdal.OFTReal : type == 'date' ? gdal.OFTDate : gdal.OFTString;
    }

    // 复制原始图层字段并设置字段类型
    originAttrs.forEach(function (obj, idx) {
        var field = getFieldDefn(obj);
        resultLayer.fields.add(field);
        console.log('创建完成第 ' + (idx + 1) + ' 个字段...');
    });

    originLayer.features.forEach(function (obj, idx) {
        var coordinates = obj.getGeometry().toObject().coordinates;
        //构造一个feature
        var feature = new gdal.Feature(resultLayer);
        var geom = eval('new gdal.' + originGeomTypeStr + '()');

        //为构造的feature属性字段赋值
        var featureAttr = obj.fields.toObject();
        for (var o in featureAttr) {
            //给字段赋值
            feature.fields.set(o, featureAttr[o]);
        }

        //为构造的feature增加转换过的空间信息
        switch (originGeomTypeStr) {
            case 'Point':
                var coordTans = eval('geoTransform.' + transformType + '(coordinates[0], coordinates[1])');
                geom.x = parseFloat(coordTans[0].toFixed(6));
                geom.y = parseFloat(coordTans[1].toFixed(6));
                break;
            case 'LineString':
                coordinates.forEach(function (obj1) {
                    var coordTans = eval('geoTransform.' + transformType + '(obj1[0], obj1[1])');
                    geom.points.add(new gdal.Point(parseFloat(coordTans[0].toFixed(6)), parseFloat(coordTans[1].toFixed(6))));
                });
                break;
            case 'Polygon':
                coordinates.forEach(function (obj1) {
                    var ring = new gdal.LinearRing();
                    obj1.forEach(function (obj2) {
                        var coordTans = eval('geoTransform.' + transformType + '(obj2[0], obj2[1])');
                        ring.points.add(parseFloat(coordTans[0].toFixed(6)), parseFloat(coordTans[1].toFixed(6)));
                    });
                    geom.rings.add(ring);
                });
                break;
            default:
                console.log('没有您要转换的要素类型！');
                return;
        }
        feature.setGeometry(geom);

        //将feature增加到图层
        resultLayer.features.add(feature);
        console.log('完成对第 ' + (idx + 1) + ' 个要素的创建、属性赋值、坐标系转换,剩余'+(featuresCount-idx-1)+'个');
        (idx + 1) == featuresCount && console.log('finished...');
    })

    //保存对shp文件的修改
    resultLayer.flush();
}

module.exports = shpTransform;



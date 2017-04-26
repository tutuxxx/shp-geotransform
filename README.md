# shp-geotransform

在中国特色GIS主义中，我们拿到的SHP数据一般有WGS84和GCJ02两种坐标系。而在实际的GIS开发（基于SHP文件的空间分析和空间展示）中，我们一般用到的坐标系有WGS84、GCJ02、BD09，而且在很多情况下数据的坐标系和底图坐标系息息相关，坐标系不匹配会出现图层偏移，这就涉及到坐标系转换的问题。


## shp-geotransform是什么

本项目旨在从源头解决坐标系不一致问题，做到一次转换，多次利用。

>`常见地图坐标系科普`： 

* WGS84：国际标准，BingMap、谷歌国外地图、osm地图等国外的地图、GPS芯片或者北斗芯片获取的经纬度
* GCJ02：中国标准，谷歌中国地图、搜搜中国地图、高德地图、阿里云、腾讯地图
* BD09：百度标准，百度地图

## 贡献内容

如果你想参与shp-geotransform的共同创作，修改或添加内容，可以先[Fork](https://github.com/tutuxxx/shp-geotransform)本仓库，然后将修改的内容提交[Pull requests](https://github.com/tutuxxx/shp-geotransform/pulls)；或者[创建Issues](https://github.com/tutuxxx/shp-geotransform/issues/new)。

## 安装

shp-geotransform是基于node.js的所以先要安装node.js, 推荐您使用最新版本的node.js，如果具体使用过程中遇到问题也可以[在此反馈](https://github.com/tutuxxx/shp-geotransform/issues/new)；具体安装步骤如下：

1. 安装[node.js](https://nodejs.org), 建议您采用最新版本的 node.js;
2. 安装shp-geotransform：
       *  如果您想贡献内容，请[Fork](https://github.com/tutuxxx/shp-geotransform)本仓库；
       *  如果您只想使用，请clone本仓库；
       *  如果您不是开发人员，只想简单使用坐标系转换功能，请[下载](https://github.com/tutuxxx/shp-geotransform/archive/master.zip)仓库到本地；
3. 安装shp-geotransform的依赖：
       1. 命令行进入shp-geotransform；
       2. 命令行中运行npm install命令安装shp-geotransform依赖的node模块；
       
## 使用

1. 选择放置您的shp文件到origin-shp文件夹中；

2. 设置参数，打开根目录下index.js：
    ```
        shpTransform(originFileName,transformType);
    ```
    参数说明:
    * **originFileName**：shp文件名，如：point.shp;
    * **transformType**：坐标系转换类型，包括gcj2wgs、wgs2gcj、gcj2bd、wgs2bd、bd2gcj五种； 

3. 设置完参数后命令行运行命令：  
    ```
        node index.js
    ```

4. 如果看到命令行中输出如下内容，就表示转换成功啦！  
    ```
        finished...
    ```

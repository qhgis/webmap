require([
  "esri/config",
    "esri/Map",
      "esri/views/MapView",
  "esri/layers/FeatureLayer","esri/widgets/Legend","esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/Graphic","esri/geometry/geometryEngine",
    "esri/layers/TileLayer","esri/widgets/Swipe",
    ], function(esriConfig,Map, MapView,FeatureLayer,Legend,Query,QueryTask,Graphic,geometryEngine,TileLayer,Swipe) {

  esriConfig.apiKey = "AAPK56e3ac027f044c4089d8ceec232fc05dYaOuzVRzm8tMRqvzOvDvIEevbqJ85yppn9PacU6cy4duurJrVK9wo_8BcWO8i8bi";
//**********************************************功能1：切换地图的底图**********************************************************
      var map = new Map({
        basemap: "gray"
      });

      var view = new MapView({
        container: "viewDiv01",
        map: map,
        center: [-103.71511,40.09042],
        zoom: 5
      });


      
      document.getElementById("basemap01").addEventListener("click",function(){
      	map.basemap= "gray";
      });



      document.getElementById("basemap02").addEventListener("click",function(){
      	map.basemap= "satellite";
      });


//**********************************************功能：缩放至学校位置**********************************************************

    document.getElementById("Harvard").addEventListener("click",function(){

        view.goTo({
            center: [-71.126, 42.382],
            zoom: 17
        });



        view.graphics.removeAll();
        let query = featureLayer03.createQuery();
        query.where = "UNIQUEID = '16602702'";
        query.outFields = ["*"];
        query.returnGeometry = true;

        featureLayer03.queryFeatures(query).then(function (abc) {


            abc.features.forEach(function (item) {

                const bufferPoly = geometryEngine.geodesicBuffer(item.geometry,1,'meters');

                var g = new Graphic({
                    geometry: item.geometry, //item.geometry,
                    attributes: item.attributes,
                    symbol: {
                        type: "simple-fill",
                        color: "red",
                        outline: {
                            color: [128, 128, 128, 0.5],
                            width: "0.5px"
                        }
                        //size: 3,//item.attributes['magnitude'] * item.attributes['magnitude'],
                        //style: "square"

                    }
                });

                view.graphics.add(g);

            });

        });

    });

    document.getElementById("clemson").addEventListener("click",function() {
        view.goTo({
            center: [-82.840, 34.676],
            zoom: 14
        });



        const clemson = new TileLayer({
            url: "https://tiles.arcgis.com/tiles/x5wCko8UnSi4h0CB/arcgis/rest/services/Clemson_University_aerial_imagery_March_2019/MapServer",
            maxScale: 3000
        });
        map.add(clemson);


        const swipe = new Swipe({
            leadingLayers: [clemson],
            trailingLayers: [featureLayer03],
            position: 35, // set position of widget to 35%
            view: view
        });

        // add the widget to the view
        view.ui.add(swipe);








    })


//**********************************************功能：显示地图的比例尺，鼠标等坐标点等**********************************************************
      
      //*** 添加DIV用于显示坐标等信息 ***//
      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "7px 15px 5px";
      view.ui.add(coordsWidget, "bottom-left");

      //***显示经纬度、比例尺大小和尺度***//
      function showCoordinates(pt) {
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
            " | Scale 1:" + Math.round(view.scale * 1) / 1 ;
        coordsWidget.innerHTML = coords;
      }
      
      //*** 添加事件显示中心的坐标（在视图停止移动之后） ***//
      view.watch(["stationary"], function() {
        showCoordinates(view.center);
      });

      //*** 添加显示鼠标的坐标点***//
      view.on(["pointer-down","pointer-move"], function(evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
      });

  //*************************添加图层*************************************
  // Trailheads Point feature layer
  var featureLayer01 = new FeatureLayer({
      portalItem: {
          id: "284d5c00b0d046e18eddff4017927dd1"
      }
  });

  // Trailheads Line feature layer
  var featureLayer02 = new FeatureLayer({

      portalItem: {
          id: "0566a63fbc6a4dd498072dc4cfbd0616"
      }
  });

  // Trailheads Polygon feature layer
  var featureLayer03 = new FeatureLayer({
    url: "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Colleges_and_Universities_Campuses/FeatureServer/0"
  });

  document.getElementById("Add_point").addEventListener("click", function() {
    map.add(featureLayer01);

  });

  document.getElementById("Add_line").addEventListener("click", function() {
    map.add(featureLayer02);

      view.goTo({
          center:[-73.5,41] ,
          zoom:10
      });

      const legend = new Legend({
          view: view,
          layerInfos: [
              {
                  layer: featureLayer02,
                  title: "NY Educational Attainment"
              }
          ]
      });


      view.ui.add(legend, "bottom-right");
  });

  document.getElementById("Add_polygon").addEventListener("click", function() {
    map.add(featureLayer03);
  });

  //*************************移除图层*************************************
  document.getElementById("Remove_point").addEventListener("click", function () {
    map.remove(featureLayer01);
  });

  document.getElementById("Remove_line").addEventListener("click", function () {
    map.remove(featureLayer02);
      view.ui.remove(legend, "bottom-right");
  });

  document.getElementById("Remove_polygon").addEventListener("click", function () {
    map.remove(featureLayer03);
      view.graphics.removeAll();
  });


  //*************************计算图层数量*************************************
  view.map.allLayers.on("change", function(event) {
    var num = event.target.length - 2;
    document.getElementById("Layers").textContent = "Layers： " + num;
  });

  // 显示第二块


      
  });
    

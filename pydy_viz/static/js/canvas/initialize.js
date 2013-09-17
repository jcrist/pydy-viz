var Canvas = function(JSONObj) {
/**
 * This function acts as a class constructor for Canvas class
 * It takes the JSON Object variable as the argument, which contains
 * all the data in the JSON format.
 * It binds onClick methods of certain Divs on the frontend
 * with some Canvas.prototype functions.
 */
    var renderer, scene, primaryCamera, primaryControls

    $("#resetControls").click(this.resetControls);      
    $("#startAnimation").click(this.startAnimation);  
    $("#pauseAnimation").click(this.pauseAnimation);  
    $("#stopAnimation").click(this.stopAnimation);             
    $("#switchCamera").click(this.switchCamera);                 
    $("#goToFrame").click(this.goToFrame);                     
        
};

Canvas.prototype.timeSteps = JSONObj.frames[0].simulation_matrix.length;

Canvas.prototype.frames = new THREE.Object3D();
Canvas.prototype.frames.name = "frames";

Canvas.prototype.grid = new THREE.Object3D();
Canvas.prototype.grid.name = "Grid";    

Canvas.prototype.cameras = new THREE.Object3D()
Canvas.prototype.cameras.name = "Cameras";

Canvas.prototype.cameraPoints = new THREE.Object3D()
Canvas.prototype.cameraPoints.name = "Camera Points";

Canvas.prototype.lights = new THREE.Object3D()
Canvas.prototype.lights.name = "Lights";

Canvas.prototype.lightPoints = new THREE.Object3D()
Canvas.prototype.lightPoints.name = "Light Points";

Canvas.prototype.scene = new THREE.Scene();

Canvas.prototype.animationCounter = 0;
Canvas.prototype.cameraCounter = 0;

Canvas.prototype.animationSpeed = parseInt($("#animationSpeed").val())
Canvas.prototype.initialize = function(){

/**
 * This prototype function initializes the starting canvas, on which
 * all the visualizations are drawn. 
 * It adds following to the canvas:
 *  - A Primary Camera
 *  - Primary Trackball Controls
 *  - A Primary Light
 *  - Axes
 *  - Grid
 *  - A Div for displaying total number of frames.
 *  - A Div for displaying the current frame animation is
 *    running on.
 */

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(JSONObj.width, JSONObj.height);
	
	this.container = $('#container');
	this.container.append(this.renderer.domElement);	
	
	var axesMaterial = new THREE.MeshLambertMaterial(
	                            {
	                                color: 0xFFFFFF
	                            });

    var _pcamera = JSONObj.cameras[0]
    this.aspect_ratio = JSONObj.width / JSONObj.height;
    
    switch(_pcamera.type){
    
        case "PerspectiveCamera":
            this.primaryCamera = new THREE.PerspectiveCamera(
                                           _pcamera.fov, this.aspect_ratio, 
                                           _pcamera.near, _pcamera.far );
            this.primaryCamera.matrix.elements = _pcamera.simulation_matrix[0];
            this.primaryCamera.position.x = 00 //_pcamera.position[0];
            this.primaryCamera.position.y = 00 //_pcamera.position[1];
            this.primaryCamera.position.z = 100 //_pcamera.position[2];
            break;
            
            
    }
    
    this.scene.add(this.primaryCamera);

    // setting up primary trackball controls ...
    this.primaryControls = new THREE.TrackballControls(
                                            this.primaryCamera,
                                            this.renderer.domElement);
    
    var gridYZ = new THREE.GridHelper(100, 5);
	gridYZ.position.set( 0,0,0 );
    gridYZ.material.color = new THREE.Color(0xFFFFFF);
	gridYZ.rotation.y = Math.PI/2;
	
    this.grid.add(gridYZ);
    this.scene.add(this.grid);
    
    this.axes = new THREE.AxisHelper(JSONObj.height);
    this.axes.name = "Axes";
    this.scene.add(this.axes);
    this.renderer.render(this.scene, this.primaryCamera);
    
    // copying to vars for 
    
    // Setting a basic Point Light for colors ...
    this.primaryLight = new THREE.PointLight(0xffffff);
    this.primaryLight.position.set(10,10,-10);
    this.scene.add(this.primaryLight);
    // A point object to show this light ..
    var _geom = new THREE.SphereGeometry(2,100,100);
    var _material = new THREE.MeshBasicMaterial(0xffffff);
    this.lightPoint = new THREE.Mesh(_geom, _material);
    this.lightPoint.position.set(10,10,-10);
    this.scene.add(this.lightPoint);
    
        
    primaryControls = this.primaryControls; 
    primaryCamera = this.primaryCamera;
    renderer = this.renderer;
    scene = this.scene;
    $("#frameCount").append("<h2>Total Frames: " + this.timeSteps + "</h2>")
    $("#currentFrame").append("<h2>Current Frame: " + this.animationCounter + "</h2>")    
    
    };


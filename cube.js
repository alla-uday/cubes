// REQUIREMENT 2: Canvas set tp 960 x 640

//Global variable 
var canvas; 
var gl;
var program;
var aspect;
var vbuffer;

//boolean to store cross hairs should be shown or not
var ch=false;
//points for crosshair
var chPoints = [
            vec2(-0.1, 0),
            vec2(0.1, 0),                
            vec2(0, -0.1),
            vec2(0, 0.1)
        ];
//array that stores points of the cube which is to be drawn
var points = [];
var pd = 45;
//points 1-6 hold the points for outlining the cubes
var points1 = []
var points2 = [];
var points3 = [];
var points4 = [];
var points5 = [];
var points6 = [];

//holding the values for white color
var white = [ 1.0, 1.0, 1.0, 1.0 ];

//REQUIREMENT 3: 8 random colors for the 8 cubes 
var ColorsOfCubes = [
    vec4(1.0, 0.5, 0.0, 1),  // orange
    vec4(1.0, 0.0, 0.0, 0.75),  // red
    vec4(0.0, 1.0, 0.0, 1),  // green
    vec4(1.0, 1.0, 0.0, 0.75),  // yellow
    vec4(0.0, 1.0, 1.0, 0.75),  // cyan
    vec4(0.0, 0.5, 0.0, 0.75),  // light green
    vec4(0.0, 0.0, 1.0, 0.75),  // blue
    vec4(1.0, 0.0, 1.0, 0.75)   // magenta
];

//unit sized cube (EXTRA CREDIT 1: using  instance of one cube to draw 8 cubes)
var side = 0.5;
var verticesOfCube = [
    vec3( -side, -side,  side),
    vec3( -side,  side,  side),
    vec3(  side,  side,  side),
    vec3(  side, -side,  side),
    vec3( -side, -side, -side),
    vec3( -side,  side, -side),
    vec3(  side,  side, -side),
    vec3(  side, -side, -side)
];
// REQUIREMENT 3:  Each of the eight cubes should be centered at (+/- 10, +/- 10, +/- 10) from the origin 
// To translate the cube to 8 different positions
var positionsOfCubes = [
    vec3(10, 10, 10),
    vec3(10, 10, -10),
    vec3(10, -10, 10),
    vec3(10, -10, -10),
    vec3(-10, 10, 10),
    vec3(-10, 10, -10),
    vec3(-10, -10, 10),
    vec3(-10, -10, -10)
];

//array to hold the scaling factors for each of the 8 cubes (>10% variation between them)
var cubeScales = [1.00, 1.00, 1.00];    

var toggleScale = true;

//array to hold the degree rates of rotations for each of the 8 cubes (20rpm)
//EXTRA CREDIT 4: The rotation speed should be constant and should be 20 rpm
// CALCULATION: 60 renders / second --> 0.33 rotations per second --> 120 degrees per ssecond --> 2 degrees per render
var degRatesOfEachCube = [2, 2, 2, 2,2, 2, 2, 2];
//array that stores the curren posiiton of rotation for each of the 8 cubes
var degreesOfRotation = [0, 0, 0, 0, 0, 0, 0, 0];

//variable that stores the rotation degree extent of the heading (left, right buttons pressed)
var degreeOfRotation=0;

//array to hold the axis of rotations 
var axisofRot = [vec3(0,0,1), vec3(1,0,0), vec3(0,1,0)];

var xAxis = 0;
var yAxis = 0;
var zAxis = -45;

//projection matrix
var pMatrix;

//modelview matrix
var mvMatrix;

//orthogonal matrix
var opMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);;

var color;

window.onload = function init() {
    // Setting up the Canvas
    canvas = document.getElementById( "gl-canvas" );
    //setting aspect ratio so no strecthing happens when canvas dimensions are changed
    aspect = canvas.width/canvas.height;
    
    //checking if WebGL is available
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { 
        alert( "WebGL isn't available" ); 
    }

    //listener to see if '+' has been pressed
    document.onkeypress = function(k) {
        k = k || window.event;
        //REQUIREMENT 11: The ‘+’ key should toggle the display of an orthographic projection 
        //of a cross hair centered over your scene. 
        //The cross hairs themselves can be a simple set of lines rendered in white
        if(k.keyCode == 43){
            ch=!ch;
        }
    };
    //listener to see if other keys are pressed
    document.onkeydown = function(k) {
        k = k || window.event;
        
        //REQUIREMENT 5: When 'c' is pressed cycle the colors of the cube 
        if(k.keyCode===67) { 
            var arr = []
            for (var i =1; i<ColorsOfCubes.length;i++){
                arr.push(ColorsOfCubes[i]);
            }
            arr.push(ColorsOfCubes[0]);
            ColorsOfCubes = arr;
            
        }
       
        // REQUIREMENT 7: Implement a simple camera navigation system using the keyboard. 
        //Up and down arrow keys should control the position of the camera along the Y axis. 
        //Each key press should adjust position by 0.25 units.
        // check if 'up' is pressed and move camera up yaxis by 0.25 units
        else if(k.keyCode===38) {
            yAxis =yAxis - 0.25;
        }
        // check if 'down' is pressed and move camera down yaxis by 0.25 units
        else if(k.keyCode===40) {
            yAxis = yAxis + 0.25;
        }

        //REQUIREMENT 8: The left and right arrow keys control the heading of the camera. 
        //Each key press should rotate the heading by four (4) degrees
        // check if 'left' is pressed and rotate camera by 4 degrees
        else if(k.keyCode===37) {
            degreeOfRotation = degreeOfRotation - 4;
        }
        //check if 'right' is pressed and rotate camera by 4 degrees
        else if(k.keyCode===39) { 
            degreeOfRotation = degreeOfRotation + 4;
        }
        
        //REQUIREMENT 9: The letters i, j, k and m control forward, left, right and backward, respectively, 
        //relative to the camera's current heading. 
        //Each key press should adjust position by 0.25 units.
        // check if 'i' is pressed to move camera forward by 0.25 units
        else if(k.keyCode===73){ 
            zAxis = zAxis + 0.25;
        }
        // check if 'j' is pressed to move camera left by 0.25 units
        else if(k.keyCode===74){ 
            xAxis = xAxis + 0.25;
        }
        // check if 'k' is pressed to move camera right by 0.25 units
        else if(k.keyCode===75){ 
            xAxis-=0.25;
        }
        // check if 'm' is pressed to move camera behind by 0.25 units
        else if(k.keyCode===77){ 
            zAxis-=0.25;
        }

        //REQUIREMENT 10: The ‘n’ and ‘w’ keys should adjust the horizontal field of view (FOV) narrower or wider. 
        //One (1) degree per key press. Keep the display of your scene square as the FOV changes
        // check if 'n' is pressed to narrow the field by one degree
        else if(k.keyCode===78){
            pd =pd - 1;
        }
        //check if 'w' is pressed to widen the field of view by 1 degree 
        else if(k.keyCode===87){ 
            pd = pd + 1;
        }

        //REQUIREMENT 9: The ‘r’ key should reset the view to the start position
        // check if 'r' is pressed to reset the camera to its default position 
        else if(k.keyCode===82) { 
            xAxis = 0;
            yAxis = 0;
            zAxis = -45;
            aspect = canvas.width/canvas.height;
            pd = 45;
            degreeOfRotation = 0;
        }
    };
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    //REQUIREMENT 2: Clear to a black background and enable Z Buffer 
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //indices 1-6 are to draw the triangle strips for the cubes in the right order
    var indices1 = [ 1, 0, 3, 1, 3, 2];
    var indices2 = [ 2, 3, 7, 2, 7, 6];
    var indices3 = [  3, 0, 4, 3,4,7];
    var indices4 = [ 6, 5, 1, 6,1,2];
    var indices5 = [ 4, 5, 6, 4,6, 7 ];
    var indices6 = [ 5, 4, 0, 5,0,1];

    //pi 1-6 are the points to draw the outlines of the cube 
    var pi1 = [1,0,3,2,1];
    var pi2 = [2,3,7,6,2];
    var pi3 = [3,0,4,7,3];
    var pi4 = [6,5,1,2,6];
    var pi5 = [4,5,6,7,4];
    var pi6 = [5,4,0,1,5];

    //pushing the points(vertices of cube) in the order specified by the indices 1-6 and pi 1-6
    for ( var i = 0; i < indices1.length; ++i ) {
        points.push( verticesOfCube[indices1[i]] );

    }
    for ( var i = 0; i < pi1.length; ++i ) {
        points1.push( verticesOfCube[pi1[i]] );

    }
    for ( var i = 0; i < indices2.length; ++i ) {
        points.push( verticesOfCube[indices2[i]] );
    }
    for ( var i = 0; i < pi2.length; ++i ) {
        points2.push( verticesOfCube[pi2[i]] );
    }

    for ( var i = 0; i < indices3.length; ++i ) {
        points.push( verticesOfCube[indices3[i]] );
    }
    for ( var i = 0; i < pi3.length; ++i ) {
        points3.push( verticesOfCube[pi3[i]] );
    }

    for ( var i = 0; i < indices4.length; ++i ) {
     points.push( verticesOfCube[indices4[i]] );
    }
    for ( var i = 0; i < pi4.length; ++i ) {
        points4.push( verticesOfCube[pi4[i]] );
    }
    for ( var i = 0; i < indices5.length; ++i ) {
        points.push( verticesOfCube[indices5[i]] );
    }
    for ( var i = 0; i < pi5.length; ++i ) {
        points5.push( verticesOfCube[pi5[i]] );
    }
    for ( var i = 0; i < indices6.length; ++i ) {
        points.push( verticesOfCube[indices6[i]] );
    }
    for ( var i = 0; i < pi6.length; ++i ) {
        points6.push( verticesOfCube[pi6[i]] );
    }

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

}

function render()
{
    //perspective matrix
    // REQUIREMENT 6: The cubes should display in a square aspect ratio (no stretching or squeezing) 
    pMatrix = perspective(pd, aspect, 0.1, 1000); 

    
    color = gl.getUniformLocation(program, "color");
    mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
        
    //drawing the 8 cubes by 
    var matrix = mat4();
    
    //Variation of scaling >20% ---
    //EXTRA CREDIT 4: the scale should vary by no more than twenty percent (20%) for their original size
    if(toggleScale){
        for(var i = 0; i < cubeScales.length; i++ ){
            cubeScales[i] += .0025
        }
        if(cubeScales[0] >= 1.20){
            toggleScale = !toggleScale;
        }
    }
    else{
        for(var i = 0; i < cubeScales.length; i++ ){
            cubeScales[i] -= .0025
        }
        if(cubeScales[0] <= 1.00){
            toggleScale = !toggleScale;
        }
    }

    //EXTRA CREDIT 1: Instance each of the eight cubes from the same geometry data
    //drawing 8 cubes using 1 matrix by translating it to 8 different locations
    for (var i =0; i<8;i++){
        matrix = mat4();
        matrix = mult(matrix, pMatrix);
        matrix = mult(matrix, rotate(degreeOfRotation, [0,1,0])); 
        matrix = mult(matrix, translate(vec3(xAxis, yAxis, zAxis))); 
        matrix = mult(matrix, translate(positionsOfCubes[i]))
        matrix = mult( matrix, scale( cubeScales) );
        //EXTRA CREDIT 4: The rotation of each cube can be around any axis you choose.
        degreesOfRotation[i] = degreesOfRotation[i] + degRatesOfEachCube[i];
        matrix = mult(matrix, rotate(degreesOfRotation[i], axisofRot[i%3])); 

        gl.uniform4fv(color, flatten(ColorsOfCubes[i]));
        gl.uniformMatrix4fv(mvMatrix, false, flatten(matrix)); 
        //EXTRA CREDIT 2:Implement the cube geometry as a single triangle strip primitive
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);
        gl.uniform4fv(color, flatten(white));


        //Ch buffer 1-6 is to draw outlines for the cube
        //REQUIREMENT 4: Draw each cube’s outline (the edges) 
        //in white so the faces are apparent (needed because there is no lighting in this assignment)
        var chBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chBuffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5);

        var ch1Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ch1Buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points2), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5); 

        var ch2Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ch2Buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points3), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5); 

        var ch3Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ch3Buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points4), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5);

        var ch4Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ch4Buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points5), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5);    

        var ch5Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ch5Buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points6), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, 5);       

        vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );        
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);

    }
    //drawing the cross hair
    if (ch) {
        
                
        var chBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, chBuffer);        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(chPoints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 2, gl.FLOAT, false, 0, 0);
        
        //For Orthoginal projection of the cross hairs multiply by the prthogonal matrix   
        ////REQUIREMENT 11: The ‘+’ key should toggle the display of an orthographic projection 
        //of a cross hair centered over your scene. 
        //The cross hairs themselves can be a simple set of lines rendered in white     
        matrix = mat4();      
        matrix = mult(matrix, opMatrix);

        //set the color of the cross hairs to white
        gl.uniform4fv(color, flatten(vec4(1.0, 1.0, 1.0, 1.0)));
        gl.uniformMatrix4fv(mvMatrix, false, flatten(matrix));  

        //draw lines
        gl.drawArrays(gl.LINES, 0, 4);
        
        //rebind the cube buffers
        vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );        
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
   
    }

 
    window.requestAnimFrame( render );
}

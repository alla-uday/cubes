CS 174A 

Assignment 1

Author: Uday Shankar Alla

Date: February 1st, 2017

TA: Sam Amin

OS/Browser: MacOS Sierra 10.12.1 / Google Chrome

=====================================================================================================

Instructions:

Open the file Assign1.html, preferably in chrome, to run the assignment
(Should be in the same folder as cube.js and other js files).

=====================================================================================================

Work done

	- Requirements 1-11 completed.

	- Extra Credit 1,2,3,4 completed 

======================================================================================================

Details of Requirements:

	1. Code has comments throught to explain logic and details where necessary. README.md file present as well.

	2.  HTML canvas set to size 960x640. Enabled z-buffer and cleared canvas to a black background. 

	3. 8 unit cubes displayed using symmetric perspective projection. 

	   8 cubes centered at (+/- 10, +/- 10, +/- 10) from the origin.

	   Each of the eight cubes drawn with a different color(excluded black and white as specified).

	   All eight cubes visible from an initial camera position along the Z axis.

	4. cube’s outline drawn in white so the faces are apparent.

	5. ‘c’ key cycle the colors between the cubes.

	6. The cubes displayed in a square aspect ratio(no strectching etc.)

	7. Up and down arrow keys control the position of the camera along  Y axis (+Y is up and -Y is down. 

	   Each key press adjusts position by 0.25 units.

	8. The left and right arrow keys control the heading of the camera. 

	   Each key press rotates the heading by four (4) degrees

	9. The letters i, j, k and m control forward, left, right and backward, respectively, relative to 

	    the camera's current heading. Each key press adjusts position by 0.25 units.

   10. The ‘n’ and ‘w’ keys adjust the horizontal field of view (FOV) narrower or wider. 

       One (1) degree per key press.

   11. The ‘+’ key toggles the display of an orthographic projection of a white cross hair centered over scene.



=========================================================================================================

Extra credit done:

	1.Instanced each of the eight cubes from the same geometry data 

	2. Implemented the cube geometry as a single triangle strip primitive

	3. Quaternions used.

	4. Each cube rotates smoothly and individually around the x ,y or z axis. 

	   The rotation speed is set to 20 rpm.

	   Calculation for it:

	   		60 renders per second (as present webgl utils file)

	   		20 rotations per m = 0.33 rotations per second = 120 degrees per second 

	   		which gives us 2 degrees per render

	   	The scale of each cube ranges from 1.00 to 1.20 and gradually increases and decreases at a rate of 
	   	0.0025 for smooth scaling.
	   	

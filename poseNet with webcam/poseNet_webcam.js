// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 Human pose detection using machine learning.
 This code uses: 
    ML5.js: giving us easy to use poseNet ML model.
    P5.js: for drawing and creating video output in the browser.
*/

// the output of our webcam
let webcam_output;
// to store the ML model
let poseNet;
// output of our ML model is stores in this
let poses = [];

/* function setup() is by P5.js:
      it is the first function that is executed and runs only once.
      We will do our initial setup here.
*/
function setup() {

  /* create a box in browser to show our output. Canvas having:
         width: 640 pixels and
         height: 480 pixels
  */
  createCanvas(640, 480);

  // get webcam input
  webcam_output = createCapture(VIDEO);
  // set webcam video to the same height and width of our canvas
  webcam_output.size(width, height);

  /* Create a new poseNet model. Input:
      1) give our present webcam output
      2) a function "modelReady" when the model is loaded and ready to use
  */
  poseNet = ml5.poseNet(webcam_output, modelReady);

  /*
    An event or trigger.
    Whenever webcam gives a new image, it is given to the poseNet model.
    The moment pose is detected and output is ready it calls:
    function(result): where result is the models output.
    store this in poses variable for furthur use.
  */
  poseNet.on('pose', function(results) {
    poses = results;
  });

  /* Hide the webcam output for now.
     We will modify the images and show with points and lines of the 
     poses detected later on.
  */
  webcam_output.hide();
}

/* function called when the model is ready to use.
   set the #status field to Model Loaded for the
  user to know we are ready to rock!
 */
function modelReady() {
  select('#status').html('Model Loaded');
}


/* function draw() is by P5.js:
      This function is called on repeat forever (unless you plan on closing the browser
      and/or pressing the power button)
*/
function draw() {

  // show the image we currently have of the webcam output.
  image(webcam_output, 0, 0, width, height);

  // draw the points we have got from the poseNet model
  drawKeypoints();
  // draw the lines too.
  drawSkeleton();
}

// A function to draw detected points on the image.
function drawKeypoints(){
  /*
    Remember we saved all the result from the poseNet output in "poses" array.
    Loop through every pose and draw keypoints
   */
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse if the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        // choosing colour. RGB where each colour ranges from 0 255
        fill(0, 0, 255);
        // disable drawing outline
        noStroke();
        /* draw a small ellipse. Which being so small looks like a dot. Purpose complete.
            input: X position of the point in the 2D image
                   Y position as well
                   width in px of the ellipse. 10 given
                   height in px of the ellipse. 10 given
        */
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
    /*
    Remember we saved all the result from the poseNet output in "poses" array.
    Loop through every pose and draw skeleton lines.
   */
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      // line start point
      let startPoint = skeleton[j][0];
      // line end point
      let endPoint = skeleton[j][1];
      // Sets the color used to draw lines and borders around shapes
      stroke(0, 255, 0);
      /* draw a line:
            input: X position of start point of line in this 2D image
                   Y position as well
                   X position of end point of line in this 2D image
                   Y position as well
          */
      line(startPoint.position.x, startPoint.position.y, endPoint.position.x, endPoint.position.y);
    }
  }
}

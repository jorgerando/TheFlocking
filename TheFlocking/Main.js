
var easycam ;
var grupo ;

var agrupacion = 5
var alinacion  = 20
var alinacion= 25

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL)
  easycam = createEasyCam({distance:2900})
  grupo = new Grupo(100);

}

function draw(){

  background(255);
  noFill();
  stroke(0)
  box(windowWidth);
  translate(-windowWidth/2,-windowWidth/2,-windowWidth/2)

  grupo.activar([alinacion,alinacion,agrupacion ])

}

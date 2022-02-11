
var easycam ;
var grupo ;

var agrupacion = 5
var alinacion  = 20
var alinacion= 25

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL)

  console.log(windowWidth)
  easycam = createEasyCam({distance:4000})
  grupo = new Grupo(300);

}

function draw(){

  background(255);

  noFill();
  stroke(0)
  //box(windowWidth);
  noFill() ;
  point(0,0,0)

  sphere(windowWidth, 20, 20);
  grupo.activar([alinacion,alinacion,agrupacion ])

}

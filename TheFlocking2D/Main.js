
var cohetes = []
var n = 180;
var activador = true ;

let valor_separacion;
let valor_agrupacion;
let valor_alineacion;
let boton;

let velocidad;

function setup() {

  boton = createButton('Visualizar Rango');
  boton.position(20,140 );
  boton.mousePressed(activarRango);
  createCanvas( windowWidth, windowHeight);

  valor_separacion = createSlider(0, 100, 25);
  valor_separacion.position(10, 30);

  valor_agrupacion = createSlider(0, 100, 5);
  valor_agrupacion.position(10, 60);

  valor_alineacion = createSlider(0, 100, 10);
  valor_alineacion.position(10, 90);

  velocidad = createSlider(0, 20,5);
  velocidad.position(10, 120);



  for (var i = 0 ; i < n ; i++ ){

   cohetes.push( new Cohete() )

  }


}

function activarRango() {
  activador = !activador
}

function draw() {

  background(0,0,0)
  fill(255)
  text('Separacion', 10, 20);
  text('Agrupacion', 10, 50);
  text('Alineacion', 10, 80);
  text('Velocidad', 10, 110);

  for (var i = 0 ; i < n ; i++ ){

    cohetes[i].incremento = velocidad.value()


    cohetes[i].moverse()
    cohetes[i].verCohete()
    cohetes[i].bordes()

    var f_separacion = cohetes[i].separeracion(cohetes)
    var f_alineacion = cohetes[i].alineacion(cohetes)
    var f_agrupacion = cohetes[i].agrupacion(cohetes)
    

    f_separacion = f_separacion.mult(valor_separacion.value())
    f_alineacion = f_alineacion.mult(  valor_alineacion.value())
    f_agrupacion = f_agrupacion.mult(valor_agrupacion.value())


    cohetes[i].aplicarFuerza(f_separacion )
    cohetes[i].aplicarFuerza(f_alineacion)
    cohetes[i].aplicarFuerza(f_agrupacion )





  }

}

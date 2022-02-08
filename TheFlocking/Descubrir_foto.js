
class Individuo {

  constructor(w,h,modo){
    this.W = w
    this.H = h
    if(modo){
    this.crearImagen()
    }
  }

  darAdn(adn){
    this.img = adn
  }

  writeColor(image, x, y, red, green, blue, alpha) {
    let index = (x + y * image.width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
  }

  crearImagen(){
    this.img = createImage(this.W, this.H);
    this.img.loadPixels();
    for(var x = 0 ; x < this.img.width ; x++ ){
      for(var y = 0 ; y < this.img.height; y++){
       this.writeColor(this.img,x,y,random(255),random(255),random(255),255)
      }
    }
    this.img.updatePixels();

  }

  fit(img_r){

    var sum = 0

    for(var x = 0 ; x < this.img.width ; x++ ){
      for(var y = 0 ; y < this.img.height ; y++){

        var I_p = this.img.get(x,y)
        var R_p = img_r.get(x,y)

        var I_r = I_p[0]
        var I_g = I_p[1]
        var I_b = I_p[2]

        var R_r = R_p[0]
        var R_g = R_p[1]
        var R_b = R_p[2]

        var d_r = (I_r-R_r)
        var d_g = (I_g-R_g)
        var d_b = (I_b-R_b)

        var dif = Math.sqrt(d_r*d_r+d_g*d_g+d_b*d_b)
        sum+=dif

      }
    }
    var a = sum / (this.img.width*this.img.height)
    var fit = Math.pow(1/a,10)
    return fit
  }

  reproducir(padre,tasa_mutacion){

    var hijo = createImage( this.img.width , this.img.height )
    var Hijo = new Individuo(this.img.width , this.img.height,false )

    hijo.loadPixels();
    for(var x = 0 ; x < this.img.width ; x++ ){
      for(var y = 0 ; y < this.img.height ; y++){

        var I_p = this.img.get(x,y)
        var R_p = padre.img.get(x,y)

        if ( y  > this.img.height / 2) {
          writeColor(hijo,x,y,I_p[0],I_p[1],I_p[2],255 )
        }else{
          writeColor(hijo,x,y,R_p[0],R_p[1],R_p[2],255 )
        }

        if( Math.random() < tasa_mutacion ){
          writeColor(hijo,x,y,random(255),random(255),random(255),255)
        }
    }
    }
    hijo.updatePixels()
    Hijo.darAdn(hijo)
    return Hijo
  }

  ver(x,y){

    image(this.img,x,y)
  }

}

class Poblacion{

  constructor(w,h,n){
    this.n = n
    this.inidividuos = []

    this.fitMedia = 0 ;
    this.maxfit = 0 ;
    this.best = "" ;

    this.inicializarPoblacion(w,h,n)
    this.asociacion = [] ;
  }

  inicializarPoblacion(w,h,n){

    for(var i = 0 ; i < n ; i++ ){
    this.inidividuos.push( new Individuo(w,h,true) )
    }
  }

  seleccionMasAptos(img_r){

    var mejor = ""
    var individuo_fitnes = [] ;
    var maxFitActual = 0 ;
    var fitMedioActual = 0 ;


    for(var i = 0 ; i < this.n ; i++ ){

      var individuo_actual = this.inidividuos[i]
      var aptitud_individuo_actual = individuo_actual.fit(img_r)

      //console.log("Individuo "+i+" fit : "+aptitud_individuo_actual)

      if (aptitud_individuo_actual > maxFitActual ){
          maxFitActual = aptitud_individuo_actual
          mejor = individuo_actual ;
      }

      fitMedioActual+=aptitud_individuo_actual
      individuo_fitnes.push([individuo_actual,aptitud_individuo_actual])

    }

   this.sum = fitMedioActual
   fitMedioActual=fitMedioActual/this.n
   this.best = mejor ;
   this.maxfit = maxFitActual ;
   this.fitMedia = fitMedioActual ;
   this.asociacion = individuo_fitnes ;
 }

  selecionar(){

    while (true){
      //console.log(Math.floor(Math.random() * this.n))
      var individuo_fit = this.asociacion[Math.floor(Math.random() * this.n)]
      var ind = individuo_fit[0]
      var fit = individuo_fit[1]

    var r = Math.random()*this.maxfit
     if(r < fit ){
       //console.log(fit)
       return ind
     }
   }

  }

  selecionar2(){

    var r = Math.random()
    console.log(r)
    var fit_sum_ac = 0
    var fit_sum_an = 0
    for (var i = 0 ; i < this.asociacion.length ;i++){

        var individuo_fit = this.asociacion[i]
        var ind = individuo_fit[0]
        var fit = individuo_fit[1]

        fit_sum_ac+=(fit/this.sum)
        //console.log("Rango : "+fit_sum_an+" "+fit_sum_ac)

        if (r > fit_sum_an  && r < fit_sum_ac ){
            return ind
        }
        fit_sum_an = fit_sum_ac

    }


  }

  crearNuevaGeneracion(tasa){

    var nuevaPoblacion = []
    for(var i = 0 ; i < this.n ; i++ ){

       var madre = this.selecionar()
       var padre = this.selecionar()
       var hijo = madre.reproducir(padre,tasa)
       nuevaPoblacion.push(hijo)

    }
    this.inidividuos = nuevaPoblacion

  }

  verMejor(i){
    this.best.img.resize(300,300)
    image(this.best.img,i,0)
  }

  verEstaditicas(generacion){
    console.log("Mejor fit : "+this.maxfit)
    console.log("Media fit : "+this.fitMedia)
    textSize(20)
    text("Generacion : "+ generacion,400,400)
    text("Mejor fit : "+this.maxfit,400,430)
    text("Media fit : "+this.fitMedia,400,450)
  }

}

function writeColor(image, x, y, red, green, blue, alpha) {
  let index = (x + y * image.width) * 4;
  image.pixels[index] = red;
  image.pixels[index + 1] = green;
  image.pixels[index + 2] = blue;
  image.pixels[index + 3] = alpha;
}

var img

var w = 8
var h = 8
var numero_individuos =300
var tasa = 0.02

var generacion = 0
var poblacion
var i = ""

var adn_m
var adn_p
var pedro
var ana
var hijo
var copia
function preload() {
  img = loadImage('https://live.mrf.io/statics/i/ps/www.muycomputer.com/wp-content/uploads/2019/05/MonaLisa.jpg?widthimagen_individuo=1200&enable=upscale')
}

function setup() {

  createCanvas(800,800);
  img.resize(w, h);

  /*
  img.loadPixels();
  for(var x = 0 ; x < img.width ; x++ ){
    for(var y = 0 ; y < img.height; y++){
     this.writeColor(img,x,y,255,0,0,255)
    }
  }
  this.img.updatePixels();
  */

  poblacion = new Poblacion(w,h,numero_individuos)

}

function draw() {
 background(255)
 /*
 hijo.ver(w*2,0)
 ana.ver(0,0)
 pedro.ver(w,0)
 */

 console.log("Generacion : "+generacion)
 console.log("Seleccion mas aptos generacion : "+generacion)

 poblacion.seleccionMasAptos(img)
 console.log("Creando generacion : "+(generacion+1))
 poblacion.crearNuevaGeneracion(tasa)
 poblacion.verMejor(0)
 poblacion.verEstaditicas(generacion)

 img.resize(300,300)
 image(img,400,0)




 generacion++


}

class nave3D{

  constructor(posicion_inicial){

    this.posicion = posicion_inicial ;
    this.velocidad = new p5.Vector(random(-1,1),random(-1,1),random(-1,1)) ;
    this.aceleracion = new p5.Vector(0,0,0) ;
    this.ruta = []
    this.incremento = 10
    this.velocidad.mult(this.incremento)
    this.fdMax = 0.03
    this.alfa = random(0,PI)
    this.teta = random(0,2*PI)

  }

  moverse(){
    this.velocidad.add(this.aceleracion)
    this.posicion.add(this.velocidad)
    this.aceleracion.mult(0)
  }

  aplicarFuerza(f){
    this.aceleracion.add(f)
  }

  diriguir(target,importancia){

   var vd = target.copy().sub(this.posicion.copy())
   vd.normalize()
   vd.mult(this.incremento)

   var v_copy = this.velocidad.copy() ;
   var constante = this.incremento
   var fuerza_diriguidora = new p5.Vector.sub(vd,this.velocidad.copy())

   this.aplicarFuerza(fuerza_diriguidora.limit(this.fdMax).mult(importancia))

  }

  movimientoAleatorio(){

    var centro = this.posicion.copy().add(this.velocidad.copy().normalize().mult(100))
    var Ralfa = random(-0.5,0.5)
    var Rteta = random(-0.5,0.5)
    stroke(0,0,255)
    point(centro.x,centro.y,centro.z)
    var r = 50
    this.alfa += Ralfa
    this.teta += Rteta
    var x = r*sin(this.alfa)*cos(this.teta)+centro.x
    var y = r*sin(this.alfa)*sin(this.teta)+centro.y
    var z = r*cos(this.alfa)+centro.z
    stroke(0,0,255)
    point(x,y,z)
    line(centro.x,centro.y,centro.z,x,y,z)
    this.diriguir(new p5.Vector(x,y,z))

  }

  sgn(x){
    if (x > 0){
      return 1
    } else if (x == 0 ){
      return 0
    }else{
      return -1
    }
  }

  ZAngulo(vector){

    var x = vector[0];
    var y = vector[1];
    var z = vector[2];
    var angulo = 0 ;

    if ( x > 0 & y > 0 ){
      angulo = atan(y/x)
    }else if(x > 0 & y < 0){
      angulo = 2*PI + atan(y/x)
    }else if( x == 0 ){
      angulo = (PI/2)*this.sgn(y)
    }else{
      angulo = PI + atan(y/x)
    }
    return angulo
  }

  YAngulo(vector){

    var x = vector[0];
    var y = vector[1];
    var z = vector[2];

    if (z > 0){
      return atan(sqrt(x*x+y*y)/z)
    }else if(z == 0){
      return PI/2
    }else{
      return PI+atan(sqrt(x*x+y*y)/z)
    }

  }

  ejes(){
    stroke(0)
    line(0,0,0,100,0,0)
    stroke(255,0,0)
    point(100,0,0)
    stroke(0)
    line(0,0,0,0,100,0)
    stroke(0,255,0)
    point(0,100,0)
    stroke(0)
    line(0,0,0,0,0,100)
    stroke(0,0,255)
    point(0,0,100)
  }

  ver(){

    var inc = 20 ;
    var A = [inc/2,inc/2,inc*2]
    var B = [0,0,0]
    var C = [inc,0,0]
    var D = [0,inc,0]

    var centro = [inc/2,inc/2,inc/2];
    var puntos = [A,B,C,D]

     stroke(0)
     push();


     var anZ = this.ZAngulo([this.velocidad.x,this.velocidad.y,this.velocidad.z])
     var anY = this.YAngulo([this.velocidad.x,this.velocidad.y,this.velocidad.z])

     translate(this.posicion.x,this.posicion.y,this.posicion.z)
     stroke(255,0,0)
     var v_cp = this.velocidad.copy()
     v_cp.normalize()
     line(0,0,0,v_cp.x*inc*2,v_cp.y*inc*2,v_cp.z*inc*2)
     rotateZ(anZ)
     rotateY(-(PI/2)+anY)

     rotateY(PI/2)
     rotateZ(-PI/4)

     stroke(255,0,0)
     translate(-centro[0],-centro[1],-centro[2])

     //point(centro[0],centro[1],centro[2])

     stroke(0)
     beginShape();
     vertex(A[0],A[1],A[2]);
     vertex(B[0],B[1],B[2]);
     endShape();
     beginShape();
     vertex(A[0],A[1],A[2]);
     vertex(C[0],C[1],C[2]);
     endShape();
     beginShape();
     vertex(A[0],A[1],A[2]);
     vertex(D[0],D[1],D[2]);
     endShape();
     beginShape();
     vertex(B[0],B[1],B[2]);
     vertex(C[0],C[1],C[2]);
     endShape();
     beginShape();
     vertex(B[0],B[1],B[2]);
     vertex(D[0],D[1],D[2]);
     endShape();
     beginShape();
     vertex(C[0],C[1],C[2]);
     vertex(D[0],D[1],D[2]);
     endShape();
     pop();

  }

  verRuta(){
    this.ruta.push(this.posicion.copy())

    for( var i = 0 ; i < this.ruta.length ; i++ ){

        stroke(255,0,0)
        point(this.ruta[i].x,this.ruta[i].y,this.ruta[i].z)
    }
  }

  separacion(otros,importancia){

    var sum = new p5.Vector(0,0,0)
    var navesEnRango = 0
    var rangoseparacion = 25*2
    for(var i = 0 ; i < otros.length ; i++){

        var naveActual = otros[i]
        var dist = new p5.Vector.sub(this.posicion.copy(),naveActual.posicion.copy())
        var distancia = dist.mag()

        if (naveActual != this && distancia < rangoseparacion ){

          dist.normalize()
          dist.div(distancia)
          sum.add(dist)
          navesEnRango++
        }
    }

    var fd ;
    if(navesEnRango > 0){
      sum.div(navesEnRango)
      var vd = sum.setMag(this.incremento)
      var fd = new p5.Vector.sub(vd,this.velocidad.copy())
      fd.limit(this.fdMax)

    }else{
      fd = new p5.Vector(0,0,0)
    }
    this.aplicarFuerza(fd.mult(importancia))
  }

  alineacion(otros,importancia){

    var navesEnRango = 0
    var rangoAlineacion = 50*2
    var sum = new p5.Vector(0,0,0)
    for(var i = 0 ; i < otros.length ; i++){

        var naveActual = otros[i]
        var velocidad_ = otros[i].velocidad.copy()
        var dist = new p5.Vector.sub(this.posicion.copy(),naveActual.posicion.copy())
        var distancia = dist.mag()

        if(naveActual != this && distancia < rangoAlineacion){
          sum.add(velocidad_.normalize())
          navesEnRango++
        }
    }
    var fd ;
    if(navesEnRango > 0){
      sum.div(navesEnRango)
      var vd = sum.setMag(this.incremento)
      var fd = new p5.Vector.sub(vd,this.velocidad.copy())
      fd.limit(this.fdMax)

    }else{
      fd = new p5.Vector(0,0,0)
    }
    this.aplicarFuerza(fd.mult(importancia))


  }

  agrupacion(otros,importancia){

    var navesEnRango = 0
    var sum = new p5.Vector(0,0,0)
    var rangoAgrupacion = 75*2

    for(var i = 0 ; i < otros.length ; i++){

        var naveActual = otros[i]
        var posicion_ = otros[i].posicion.copy()
        var dist = new p5.Vector.sub(this.posicion.copy(),naveActual.posicion.copy())
        var distancia = dist.mag()

        if(naveActual != this && distancia < rangoAgrupacion){
          sum.add(posicion_)
          navesEnRango++
        }
    }
    var fd ;
    if(navesEnRango > 0){
      sum.div(navesEnRango)
      this.diriguir(sum,importancia)
    }



  }

  floking(otros,imporatancias){
   this.separacion(otros,imporatancias[0])
   this.alineacion(otros,imporatancias[1])
   this.agrupacion(otros,imporatancias[2])
  }

  bordes(){

    if (this.posicion.x > windowWidth ){
        this.posicion.x = 0


    }
    if (this.posicion.x < 0 ){
        this.posicion.x = windowWidth

    }
    if (this.posicion.y > windowWidth ){
        this.posicion.y = 0


    }
    if (this.posicion.y < 0 ){
        this.posicion.y = windowWidth


    }
    if (this.posicion.z > windowWidth ){
        this.posicion.z = 0


    }
    if (this.posicion.z < 0 ){
        this.posicion.z = windowWidth


    }
  }

  esquivarChoque(){

    var radio = 1876 - 200 ;
    var posicion_ = this.posicion.copy()
    var v = this.velocidad.copy()
    var importancia = 40

    if( posicion_.mag() > radio ){
          posicion_.mult(-random(1));
          var vd = posicion_.setMag(this.incremento) ;
          var fuerza_diriguidora = new p5.Vector.sub(vd,this.velocidad.copy()) ;
          this.aplicarFuerza(fuerza_diriguidora.limit(this.fdMax).mult(importancia)) ;
    }

  }


}

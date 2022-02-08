
class  Cohete {

   constructor(){

     this.posicion = createVector(random(0,width),random(0,height))
     this.incremento = 15
     this.ver = true
     this.velocidad = createVector(random(-1,1),random(-1,1)).setMag(this.incremento)
     this.maxF = 0.03
     this.velocidad.mult(this.incremento)
     this.acelarecion = createVector(0,0)
     this.rango = 25
   }

   moverse(){
       this.velocidad.add(this.acelarecion)
       this.velocidad.limit(this.incremento)
       this.posicion.add(this.velocidad)
       this.acelarecion.mult(0)
   }

   bordes(){
     if (this.posicion.x > width ){
         this.posicion.x = 0
     }
     if (this.posicion.x < 0){
        this.posicion.x = width
     }

     if (this.posicion.y > height ){
         this.posicion.y =  0
     }
     if (this.posicion.y < 0){
       this.posicion.y =  height

     }
   }

   aplicarFuerza(fuerza){
    this.acelarecion.add(fuerza) ;
   }

   verCohete(){

     stroke(0)
     strokeWeight(1);
     push()
       translate(this.posicion.x,this.posicion.y)
       rotate(this.velocidad.heading())
       fill(255)

       this.r = 5
       fill(255,255,255,20)
       noStroke(0)

        fill(255)

       stroke(0)
       triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);


     pop()


   }

   diriguir(target){

      var dist = p5.Vector.sub(target,this.posicion.copy())
      var vd = dist.copy().normalize()
      vd.mult(this.incremento)
      var f_d = p5.Vector.sub(vd.copy() , this.velocidad.copy() );
      return f_d.limit(this.maxF)


   }

   separeracion(otros){
     var rangoseparacion = 25
     var sum = new p5.Vector(0,0)
     var n = 0

     for(var i = 0 ; i < otros.length ; i++ ){

           var dist = new p5.Vector.sub(this.posicion.copy(),otros[i].posicion)
           var distacia = dist.copy().mag()

           if (otros[i] != this && otros[i] != this && distacia < rangoseparacion ){
             dist.normalize()
             dist.div(distacia)
             sum.add(dist)
             n = n + 1
           }
     }

     var fd ;
     if(n > 0){
       sum.div(n)
       var vd = sum.setMag(this.incremento)
       var fd = new p5.Vector.sub(vd,this.velocidad.copy())
       fd.limit(this.maxF)

     }else{
       fd = new p5.Vector(0,0)
     }
     return fd


   }

   alineacion(otros){
     var rangoAlineacion = 50
     var navesEnRango = 0
     var sum = new p5.Vector(0,0,0)
     for(var i = 0 ; i < otros.length ; i++){

         var naveActual = otros[i]
         var velocidad_ = otros[i].velocidad.copy()
         var dist = new p5.Vector.sub(this.posicion.copy(),naveActual.posicion.copy())
         var distancia = dist.mag()

         if(otros[i] != this && naveActual != this && distancia < rangoAlineacion){
           sum.add(velocidad_.normalize())
           navesEnRango++
         }
     }
     var fd ;
     if(navesEnRango > 0){
       sum.div(navesEnRango)
       var vd = sum.setMag(this.incremento)
       var fd = new p5.Vector.sub(vd,this.velocidad.copy())
       fd.limit(this.maxF)

     }else{
       fd = new p5.Vector(0,0)
     }
     return fd


   }

   agrupacion(otros){
    var rangoCohesion = 50
    var navesEnRango = 0
    var sum = new p5.Vector(0,0,0)

    for(var i = 0 ; i < otros.length ; i++){

        var naveActual = otros[i]
        var posicion_ = otros[i].posicion.copy()
        var dist = new p5.Vector.sub(this.posicion.copy(),naveActual.posicion.copy())
        var distancia = dist.mag()

        if(otros[i] != this && naveActual != this && distancia < rangoCohesion){
          sum.add(posicion_)
          navesEnRango++
        }
    }
    var fd ;
    if(navesEnRango > 0){
      sum.div(navesEnRango)
      return this.diriguir(sum)
    }
      return new p5.Vector(0,0)

  }

   despejarVision(otros){

    var navesEnRango = 0
    var sum = new p5.Vector(0,0)
    var apertura = 60 ;

    var derecha = []
    var izquierda = []
    var sumAngulo = 0

    for(var i = 0 ; i < otros.length ; i++){

      var posicion_otro = otros[i].posicion.copy()
      var posicion_Actual = this.posicion.copy()
      var velocidad_Actual = this.velocidad.copy()

      var dist = new p5.Vector.sub(posicion_otro,posicion_Actual)
      var angulo = velocidad_Actual.angleBetween(dist);
      var enRango = dist.mag() < this.rango*10 && abs(angulo) < radians(apertura)

      if (enRango) {

         if (angulo>=0){
           izquierda.push(otros[i])
         }else{
           derecha.push(otros[i])
         }
         navesEnRango++
         sumAngulo+=angulo
    }

    }

    var vd = this.velocidad.copy()

    if (izquierda.length > derecha.length) {

        vd.rotate(radians(-sumAngulo/navesEnRango))
    }else{
        vd.rotate(radians(sumAngulo/navesEnRango))
    }
    vd.setMag(this.incremento)

    var fd ;
    if(navesEnRango > 0){

      var fd = new p5.Vector.sub(vd,this.velocidad.copy())
      fd.limit(this.maxF)

    }else{
      fd = new p5.Vector(0,0)
    }
    return fd


  }






}

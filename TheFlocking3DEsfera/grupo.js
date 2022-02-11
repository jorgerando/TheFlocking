class Grupo{

   constructor(n){

     this.numeroIndividuos = n
     this.grupo = []

     for (var individuo = 0 ; individuo < this.numeroIndividuos ; individuo++){
         var pi = new p5.Vector(random(-windowWidth/2,windowWidth/2),random(-windowWidth/2,windowWidth/2),random(-windowWidth/2,windowWidth/2))
         this.grupo.push( new nave3D(pi))
     }

   }

   activar(importancias){
     for (var individuo = 0 ; individuo < this.numeroIndividuos ; individuo++){
          var elemento = this.grupo[individuo]
          elemento.moverse()
          elemento.ver()
          //elemento.bordes()
          elemento.floking(this.grupo,importancias)
          elemento.esquivarChoque()
     }

   }








}

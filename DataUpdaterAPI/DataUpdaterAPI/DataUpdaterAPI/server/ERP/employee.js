class  Employee{
    // class where we can create an object so we can send it as JSON to data access layer

    constructor(em_codigo,em_descritivo,em_posx,em_posy,em_posz,photo){

      this.em_codigo = em_codigo;
      this.em_descritivo = em_descritivo;
      this.em_posx = em_posx;
      this.em_posy = em_posy;
      this.em_posz = em_posz;
      this.photo = photo;
    
    }


    toString(){
      return this.em_codigo + " with description :" + this.em_descritivo + " is located in position ("+this.em_posx+","+this.em_posy+ ","
      +this.em_posz+")";
    }


    returnCode(){
      return this.em_codigo;
    }

    returnDescription(){
      return this.em_descritivo;
    }

    returnPositionX(){
      return this.em_posx;
    }

    returnPositionY(){
      return this.em_posy;
    }

    returnPositionZ(){
      return this.em_posz;
    }

    returnPhoto(){
      return this.photo;
    }

  }
  
  module.exports = Employee;
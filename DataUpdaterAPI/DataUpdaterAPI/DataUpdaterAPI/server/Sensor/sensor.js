class Sensor{
    //class to get the data so we can send to the database in the data access layer
    constructor(timestamp,value){
        this.timestamp = timestamp;
        this.value = value;
    }

    returnTime(){
        return this.timestamp;
    }

    returnValue(){
        return this.value;
    }

}

module.exports = Sensor;
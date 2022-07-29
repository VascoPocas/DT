class Equipment{
    // cass for the equipment to send as JSON to the data access layer
    constructor(sec_descritivo,equipmentId,equipmentPositionX,equipmentPositionY, equipmentPositionZ,equipmentDirection,equipmentName,
        equipmentSeriesNumber,equipmentModel,equipmentStatus,equipmentBrand,equipmentManufacturer,equipmentWeight,equipmentHeight,equipmentSection){
        this.sec_descritivo = sec_descritivo;
            this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.equipmentPositionX = equipmentPositionX;
        this.equipmentPositionY = equipmentPositionY;
        this.equipmentPositionZ = equipmentPositionZ;
        this.equipmentDirection = equipmentDirection;
        this.equipmentSeriesNumber = equipmentSeriesNumber;
        this.equipmentSection = equipmentSection;
        this.equipmentModel= equipmentModel;
        this.equipmentStatus = equipmentStatus;
        this.equipmentBrand = equipmentBrand;
        this.equipmentManufacturer = equipmentManufacturer;
        this.equipmentWeight = equipmentWeight;
        this.equipmentHeight = equipmentHeight;
    }


    




}

module.exports = Equipment;
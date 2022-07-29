class  Lote {
// class lote to send as JSOn
    constructor(art_codigo,art_descritivo,arm_loc_pos_x,arm_loc_pos_y,arm_loc_pos_z){
        this.art_codigo = art_codigo;
        this.art_descritivo = art_descritivo;
        this.arm_loc_pos_x = arm_loc_pos_x;
        this.arm_loc_pos_y = arm_loc_pos_y;
        this.arm_loc_pos_z = arm_loc_pos_z;
    }


}

  
module.exports = Lote;
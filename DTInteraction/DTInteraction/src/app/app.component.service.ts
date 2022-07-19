import {
  Vector3,Scene,
  Engine,
  SceneLoader,
  MeshBuilder,
  Color3,
  HemisphericLight,
  ArcRotateCamera,
  Tools,
  Matrix,
  int,
  AbstractMesh,
  UniversalCamera,
  WebXRDefaultExperience,
  Angle,
  Space,
  Vector2,
  Animatable,
  Ray,
  PickingInfo,
  Nullable,
  DynamicTexture,
  StandardMaterial,
  CreatePlane} from '@babylonjs/core';
  import '@babylonjs/loaders';
  import { AdvancedDynamicTexture, Button, Control, Grid, GUI3DManager, HolographicSlate, Image, Rectangle, Slider, StackPanel, TextBlock, TextWrapping } from '@babylonjs/gui';
  import { HttpClient } from '@angular/common/http';

import { IDados } from './dados';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IDadosERP } from './dadosERP';
import  * as ICameraInput from './CameraInputs';
import { IDadosLote } from './dadosLote';
import { IDadosLoteDB } from './IDadosLotesDB';
import { IDadosEmployee } from './dataEmployee';
import * as echarts from 'echarts';
import { IDadosSensors } from './dadosSensors';


const  echartsScript = document.createElement("script"); 
echartsScript.src = "https://cdn.jsdelivr.net/npm/echarts@5.3.3/dist/echarts.min.js";
document.head.appendChild(echartsScript);
export class AppComponentService {
  
  scene!: Scene;
  scene2!: Scene;
  engine: Engine
  camera!: UniversalCamera;
  fpscamera!: ArcRotateCamera;
  num: int;
  open: boolean = false;
  canvas!: HTMLCanvasElement;
  advancedTexture!: AdvancedDynamicTexture;
  button1!: Button;
  data!: IDados[];
  manager!: GUI3DManager;
  bioSlate!: HolographicSlate;
  xrPromise!: WebXRDefaultExperience;
  isPicked: string | undefined = "";
  AnimationMeshes!: Animatable[];
  logoMesh!: any;
  datasERP!: IDadosERP[];
  dataLote!: IDadosLote[];
  controllers!: any[];
  _keys!: any[];
  keysLeft!: number[];
  keysRight!: number[];
  sensibility!: number;
  dataLoteDB!: IDadosLoteDB[];
  dataEmployee!: IDadosEmployee[];
  ray!: Ray;
  hit!: Nullable<PickingInfo>;
  lastMachine!: Nullable<AbstractMesh>;
  dataChart: number[] = [];
  timeChart: string[] = [];
  dadosSensores!: IDadosSensors[];
  min = Number.MAX_SAFE_INTEGER;
  max = Number.MIN_SAFE_INTEGER;
  avg = 0;
 
  


  constructor(private http : HttpClient){
  
    this.num=0;
// Get the canvas DOM element
  this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;


// Load the 3D engine
this.engine = new Engine(this.canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

}



async startAll(dados: IDados[], dadosERP: IDadosERP[], dadosLote : IDadosLote[], dadosLoteDb : IDadosLoteDB[],dadosEmp : IDadosEmployee[], dadosSensors : IDadosSensors[]){
this.data=dados;
this.datasERP = dadosERP;
this.dataLote = dadosLote;
this.dataLoteDB = dadosLoteDb;
this.dataEmployee = dadosEmp;
this.dadosSensores = dadosSensors;
this.scene = this.createScene(this.canvas);
this.scene2 = this.createAxis();

   
  this.data.forEach(element => {
    this.createEquipment(element,this.scene);
  }); 
  this.dataLoteDB.forEach( element => {
    this.createLote(element);
  })
  this.dataEmployee.forEach(element => {
    this.createEmployee(element);
  })
  this.createWarehouse(this.scene);

  var  xrPromise = await this.scene.createDefaultXRExperienceAsync();

    //button for the VR experience
    var buttonbox = document.createElement('div');
    buttonbox.id = "buttonbox";
    buttonbox.style.position = "absolute";
    buttonbox.style.bottom = "60px";
    buttonbox.style.zIndex='10000';
    buttonbox.style.left = "95%";
    
    buttonbox.style.backgroundImage = 'url(../assets/exit.png)';
    buttonbox.style.backgroundRepeat = "no-repeat";
    buttonbox.style.backgroundSize = "contain";
    buttonbox.style.width = "40px";
    buttonbox.style.height = "40px";
    buttonbox.style.display = "block";
    document.body.appendChild(buttonbox);

    xrPromise.baseExperience.sessionManager.onXRFrameObservable.add(() => {
      // set the height at the first frame
     xrPromise.baseExperience.camera.position.y = 150;
      
  })
     document.getElementById("buttonbox")!.addEventListener("click",function () {
       xrPromise.baseExperience.exitXRAsync();
     });

     

    //controller input
    xrPromise.input.onControllerAddedObservable.add((controller) => {
      const tmpRay = new Ray(controller.pointer.absolutePosition,controller.pointer.forward,1000);
      var hit;
      var tmpMesh: AbstractMesh | undefined;
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'left') {
                  const xr_ids = motionController.getComponentIds();
                  let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                  triggerComponent.onButtonStateChangedObservable.add(() => {
                      if(triggerComponent.pressed){
                          controller.getWorldPointerRayToRef(tmpRay, true);
                          
                          hit = this.scene.pickWithRay(tmpRay);

                          if (hit!.pickedMesh !=undefined){
                              tmpMesh = hit!.pickedMesh;
                              console.log("name:"+hit!.pickedMesh.name);
                              //tmpMesh.parent= controller.grip;//tmpMesh is set on inappropriate position.
                              //tmpMesh.setParent(motionController.rootMesh);
                          }
                      
                      //released button
                      }else{
                          if (tmpMesh !=undefined){
                            // tmpMesh.parent= null;
                              //tmpMesh.setParent(null);
                          }
                      
                      }
                  });

            }

        })

    });


    this.scene.onPointerDown = async (evt) =>{

      this.ray = this.scene.createPickingRay( this.scene.pointerX, this.scene.pointerY, Matrix.Identity(), this.camera);
      this.hit=  this.scene.pickWithRay(this.ray);
      if (this.hit!.pickedMesh && this.hit!.pickedMesh.name != "Material2") {
            
          if(this.hit!.pickedMesh.metadata.type == "equipment"){
            this.lastMachine = this.hit!.pickedMesh;
            this.createSlateMachine(null);
          }else if (this.hit!.pickedMesh.metadata.type == "lote") {
            this.createSlateLote();
          }else if ( this.hit!.pickedMesh.metadata.type == "employee"){
            this.createSlateEmployee();
          }    
          
        }
    }
        
   

   // run the render loop
this.engine.runRenderLoop( () =>  {
  this.scene.render();
  this.scene2.render();
});
  
}




createScene =  (canvas: HTMLCanvasElement) => {


const  scene = new Scene(this.engine);
//create camera
this.camera = new UniversalCamera("camera", new Vector3(1400,1300,-1300), scene);
scene.activeCameras?.push(this.camera);
this.camera.attachControl(canvas,true);
this.camera.setTarget( new Vector3(0,0,0));

// This creates a GUI3DManager for 3D controls
this.manager = new GUI3DManager(scene);

// This section shows how to use a HolographicSlate with scrolling
this.bioSlate = new HolographicSlate("bioSlate");


const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
//camera.inputs.clear



this.navigationMenu(scene);

this.camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
this.camera.inputs.addMouseWheel(); 
// Connect to camera:
this.camera.inputs.add(new ICameraInput.FreeCameraKeyboardWalkInput);
        

    return scene;



} 


navigationMenu = (scene: Scene) => {
// GUI
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var resetButton = Button.CreateSimpleButton("resetButton","Reset Button");
    resetButton.width = "150px"
    resetButton.height = "40px";
    resetButton.color = "white";
    resetButton.cornerRadius = 20;
    resetButton.background = "green";
    
        

    resetButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    resetButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    resetButton.onPointerUpObservable.add(() => {
      this.camera.position = new Vector3(1400,1300,-1300);
      this.camera.setTarget(new Vector3(0,0,0));
      this.fpscamera.alpha= Math.PI /2;
      this.fpscamera.beta = 0.1;
    });
    advancedTexture.addControl(resetButton); 


    var button = Button.CreateSimpleButton("button_on_off", "OFF");
    button.width = 0.1;
    button.height = "40px";
    button.color = "red";
    button.background = "transparent";
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    
    var panel = new StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);
    panel.color="red";
    var header3 = new TextBlock();
    header3.text = "Axis X: 0 deg";
    header3.height = "30px";
    header3.color = "red";
    panel.addControl(header3);

    var slider3 = new Slider();
    slider3.minimum = -Math.PI;
    slider3.maximum = Math.PI;
    slider3.value = 0;
    slider3.height = "20px";
    slider3.width = "200px";
    slider3.color="red";
    slider3.onValueChangedObservable.add( (value) => {
        header3.text = "Axis X: " + (Tools.ToDegrees(value) | 0) + " deg";
        if (this.camera) {
            this.camera.rotation.x = value;
        }
        
    });
    panel.addControl(slider3);

    var button2 = Button.CreateSimpleButton("button_on_off", "OFF");
    button2.width = 0.1;
    button2.height = "40px";
    button2.color = "green";
    button2.background = "transparent";
    button2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    
    var panel2= new StackPanel();
    panel2.width = "220px";
    panel2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel2);
    panel2.color="green";
    var header2 = new TextBlock();
    header2.text = "Axis Y: 0 deg";
    header2.height = "30px";
    header2.color = "green";
    panel.addControl(header2);

    var slider2 = new Slider();
    slider2.minimum = -Math.PI;
    slider2.maximum = Math.PI;
    slider2.value = 0;
    slider2.height = "20px";
    slider2.width = "200px";
    slider2.color= "green";
    slider2.onValueChangedObservable.add( (value) => {
        header2.text = "Axis Y: " + (Tools.ToDegrees(value) | 0) + " deg";
        if (this.camera) {
            this.camera.rotation.y = value;
        }
    });
    panel.addControl(slider2);


    var button1 = Button.CreateSimpleButton("button_on_off", "OFF");
    button1.width = 0.1;
    button1.height = "40px";
    button1.color = "blue";
    button1.background = "transparent";
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    
    var panel1 = new StackPanel();
    panel1.width = "220px";
    panel.color= "blue";
    panel1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel1);

    var header1 = new TextBlock();
    header1.text = "Axis Z: 0 deg";
    header1.height = "30px";
    header1.color = "blue";
    panel.addControl(header1);

    var slider1 = new Slider();
    slider1.minimum = -Math.PI;
    slider1.maximum = Math.PI;
    slider1.value = 0;
    slider1.height = "20px";
    slider1.width = "200px";
    slider1.color = "blue";

    
    slider1.onValueChangedObservable.add( (value) => {
        header1.text = "Axis Z: " + (Tools.ToDegrees(value) | 0) + " deg";
        if (this.camera) {
            this.camera.rotation.z = value;
        }
    });
    panel.addControl(slider1);
      
        
      
    
  
}

createAxis =  () => {
 const  scene = new Scene(this.engine);
 scene.autoClear = false;
 this.fpscamera = new ArcRotateCamera("Camera", 
 -Math.PI / 2, 
 7 * Math.PI / 16, 
 10, 
 new Vector3(0, 0, 0), 
 scene);
 var light2 = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);   
 this.fpscamera.inputs.remove(this.fpscamera.inputs.attached['mousewheel']); 
 scene.activeCamera!.viewport.x = 0.85;
 scene.activeCamera!.viewport.y = 0.8;
 scene.activeCamera!.viewport.width = 0.2;
 scene.activeCamera!.viewport.height = 0.2;

 


 // show axis
 var showAxis = (size : number) => {
     const myPoints =  [
         new Vector3(0, 0, 0),
         new Vector3(size, 0, 0)
     ];

     const myPoints1 =  [
         new Vector3(0, 0, 0),
         new Vector3(0, size, 0)
     ];
     const myPoints2 =  [
         new Vector3(0, 0, 0),
         new Vector3(0,0, size)
     ];
     var axisX = MeshBuilder.CreateLines("axisX", {  points  : myPoints}, scene);
     axisX.color = new Color3(1, 0, 0);

     var axisY = MeshBuilder.CreateLines("axisY", { points : myPoints1}, scene);
     axisY.color = new Color3(0, 1, 0);

     var axisZ = MeshBuilder.CreateLines("axisZ", {points : myPoints2}, scene);
     axisZ.color = new Color3(0, 0, 1);
     
     
     scene.onPointerDown = () => {
         var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(),this.fpscamera);

         var hit = scene.pickWithRay(ray);
         if (hit!.pickedMesh) {
             if(hit!.pickedMesh.id == "axisX"){
               this.camera.position = new Vector3(250,200,0);
               this.camera.setTarget(new Vector3(1,200,0));
               this.fpscamera.alpha = 0.1;
               this.fpscamera.beta = Math.PI/2;
               
             }else if ( hit!.pickedMesh.id == "axisY"){
               
               this.camera.position = new Vector3(0,1000,0);
               this.camera.setTarget(new Vector3(0,1,0));
               this.fpscamera.alpha= Math.PI /2;
               this.fpscamera.beta = 0.1;
             }else if ( hit!.pickedMesh.id == "axisZ"){  
               
               this.camera.position = new Vector3(0,200,250);
               this.camera.setTarget(new Vector3(0,200,1));
               this.fpscamera.alpha =Math.PI/2;
               this.fpscamera.beta =Math.PI/2;
             }
         }
     }

 };

 this.fpscamera.setTarget(Vector3.Zero());
 this.fpscamera.attachControl(this.canvas,true);

 showAxis(2);

  return scene;



}



dataBaseData() :Observable<IDados[]>{
 return this.http.get<IDados[]>('http://localhost:3000/api/sql/equipment').pipe(tap(data => console.log('All' + JSON.stringify(data))));
 
}

dataERP() :Observable<IDadosERP[]>{
 return this.http.get<IDadosERP[]>('https://cft52.sistrade.com/api/recs').pipe(tap(data => console.log('All' + JSON.stringify(data))));
 
}

dataERPLote() :Observable<IDadosLote[]>{
  return this.http.get<IDadosLote[]>('https://cft52.sistrade.com/api/Lotes').pipe(tap(data => console.log('All' + JSON.stringify(data))));
  
}


dataERPDBLote() :Observable<IDadosLoteDB[]>{
  return this.http.get<IDadosLoteDB[]>('http://localhost:3000/api/sql/lotes').pipe(tap(data => console.log('All' + JSON.stringify(data))));
  
}

dataERPEmployee() :Observable<IDadosEmployee[]>{
  return this.http.get<IDadosEmployee[]>('https://cft52.sistrade.com/api/Employees').pipe(tap(data => console.log('All' + JSON.stringify(data))));
  
}

dataSensors() :Observable<IDadosSensors[]>{
  return this.http.get<IDadosSensors[]>('https://cft52.sistrade.com/api//Sensors?dataInicio=07-19-2022":14:00').pipe(tap(data => console.log('All' + JSON.stringify(data))));
  
}


 async createWarehouse(scene : Scene): Promise<void> {

    // import the facility 
    const { meshes } = await SceneLoader.ImportMeshAsync("","../assets/models/warehouse_building/","scene.gltf",scene);
    //ALL OBJECTS  
    var route = meshes[0];
    route.isPickable= false;
    route.name = "Material2";
    route.position = new Vector3(860,0,1443);
  

}

async createEquipment(numb : IDados,scene : Scene): Promise<void> {
  
    //imports the equipments
    const  meshes  = await SceneLoader.ImportMeshAsync("","../assets/models/ventis_3015_aj/","scene.gltf",scene);
    
    //ALL objects 
    meshes.meshes[0].getChildMeshes().forEach( m => { m.id = numb.equipmentId.toString();
                                                m.metadata = {type:"equipment", x: numb.posX, y:numb.posY,z:numb.posZ}; });
    
    //var route= meshes.meshes[0].clone("equip",null);
    meshes.meshes[0].scaling = new Vector3(.03,.03,.03);
    this.datasERP.forEach( element => {
      if (element.equipmentId == numb.equipmentId.toString()) {
        meshes.meshes[0].setAbsolutePosition(new Vector3(element.equipmentPositionX,element.equipmentPositionY,element.equipmentPositionZ));
        meshes.meshes[0].name = element.equipmentName;
      }
    })
    

    meshes.meshes[0].isPickable= true;
    
    
    if(numb.direction != null){
    var rotation = Angle.FromDegrees(numb.direction).radians();
    meshes.meshes[0].rotate(new Vector3(0,1,0),rotation,Space.LOCAL);
    } 
    
   


}


createSlateMachine(mesh : AbstractMesh | null) : void {
  var hitMesh: Nullable<AbstractMesh>;
        if (mesh != null) {
          hitMesh = mesh;
          this.isPicked = "";
          
        }else{
          hitMesh  = this.hit!.pickedMesh;
        }
      
        this.data.forEach(async element => {
            
            if(element.equipmentId.toString() == hitMesh!.id && this.isPicked != hitMesh!.id){
              
              var x = this.scene.animationGroups[Number.parseInt(hitMesh!.id)-1].isStarted;
              if(x == true){
                this.scene.animationGroups[Number.parseInt(hitMesh!.id)-1].stop();
              
              }
              
              // resets the rotation and aspect of the slate so it can be right in front of the camera
              if(this.bioSlate.node == null){
                this.bioSlate = new HolographicSlate("bioSlate");
                
              }

              var shown = [element.seriesNumber,element.model,element.status,element.brand,element.manufacturer,element.height,element.weight];

              this.bioSlate.resetDefaultAspectAndPose(true);
              this.manager.addControl(this.bioSlate);
              this.bioSlate.dimensions = new Vector2(100, 100);
              this.bioSlate.position = new Vector3(hitMesh!.metadata.x,hitMesh!.metadata.y + 180, hitMesh!.metadata.z);
              this.bioSlate.title = "Machine Information";
              this.bioSlate.titleBarHeight = 1.5;
              this.camera.setTarget(this.bioSlate.position);

              var bioGrid = new Grid("bioGrid");

              this.createButtons(bioGrid);
             
              var bioText = new TextBlock("bioText");
              bioText.width = 1;
              bioText.height = 0.2;
              bioText.fontSize = 54;
              bioText.color = "white";
              bioText.textWrapping = TextWrapping.WordWrap;
              bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
              bioText.setPadding("0%", "5%", "0%", "0%");
              bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
              bioText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
              bioText.text = element.name;
              bioText.top = 50;

              bioGrid.addControl(bioText);
              for (let index = 6 ; index < element.columns.length; index++){
                const info = element.columns[index];
                bioText = new TextBlock("bioText");
                bioText.width = 0.4;
                bioText.height = 0.1;
                bioText.color = "white";
                bioText.textWrapping = TextWrapping.WordWrap;
                bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                bioText.setPadding("0%", "5%", "0%", "5%");
                bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                bioText.top = -100 + (index-6) * 50;
                bioText.text = info + ":";

                bioGrid.addControl(bioText);

                bioText = new TextBlock("bioText");
                bioText.width = 0.6;
                bioText.height = 0.1;
                bioText.color = "white";
                bioText.textWrapping = TextWrapping.WordWrap;
                bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                bioText.setPadding("0%", "5%", "0%", "0%");
                bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
                bioText.top = -100 + (index-6) * 50;
                bioText.text = shown[index-6].toString();
                
                bioGrid.addControl(bioText);
              }
              
              bioGrid.background = "#4e5159";
              this.bioSlate.mesh?.lookAt(new Vector3(this.camera.position.x,this.camera.position.y,this.camera.position.z));
              this.bioSlate.mesh?.addRotation(0,Math.PI,0);
              this.bioSlate.content = bioGrid;
              this.bioSlate._contentMaterial.alpha = 0.5;
              
              
              this.isPicked = hitMesh!.id;
              
            }else if (element.equipmentId.toString() == hitMesh!.id && this.isPicked == hitMesh!.id && mesh == null){
              
              this.isPicked="";
              this.bioSlate.dispose();
              this.scene.animationGroups[Number.parseInt(hitMesh!.id)-1].play(true);
            }
        });              
        
}

async createLote(numb : IDadosLoteDB) {
  //imports the equipments
  const  meshes  = await SceneLoader.ImportMeshAsync("","../assets/models/cargo_crate/","scene.gltf",this.scene);

  //ALL objects  
  meshes.meshes[0].getChildMeshes().forEach( m => { m.id = numb.art_codigo.toString();
                                              m.metadata = {type:"lote", x: numb.arm_loc_pos_x, y:numb.arm_loc_pos_y,z:numb.arm_loc_pos_z};  });

  
  var route = meshes.meshes[0];
  
  this.dataLote.forEach( element => {
    if (element.art_codigo == numb.art_codigo.toString()) {
      route.setAbsolutePosition(new Vector3(element.arm_loc_pos_x,element.arm_loc_pos_y + 50,element.arm_loc_pos_z));
      route.name = element.art_descritivo;
    }
  })
  route.metadata = "lote";
  route.isPickable= true;

}


createSlateLote() : void {

    
    
        this.dataLoteDB.forEach(async element => {
            
            if(element.art_codigo.toString() == this.hit!.pickedMesh?.id && this.isPicked != this.hit!.pickedMesh?.id){

              
              this.isPicked = this.hit!.pickedMesh?.id;
              // resets the rotation and aspect of the slate so it can be right in front of the camera
              if(this.bioSlate.node == null){
                this.bioSlate = new HolographicSlate("bioSlate");
                
              }

              var shown = [element.art_descritivo,element.arm_loc_pos_x,element.arm_loc_pos_y,element.arm_loc_pos_z];

              this.bioSlate.resetDefaultAspectAndPose(true);
              this.manager.addControl(this.bioSlate);
              this.bioSlate.dimensions = new Vector2(100, 100);
              this.bioSlate.position = new Vector3(this.hit!.pickedMesh.metadata.x,this.hit!.pickedMesh.metadata.y + 180, this.hit!.pickedMesh.metadata.z);
              this.bioSlate.title = "Lote Information";
              this.bioSlate.titleBarHeight = 1.5;
              this.camera.setTarget(new Vector3(this.hit!.pickedMesh.position.x,this.hit!.pickedMesh.position.y+ 100,this.hit!.pickedMesh.position.z)); 
              var bioGrid = new Grid("bioGrid");
              var bioText = new TextBlock("bioText");
              bioText.width = 1;
              bioText.height = 0.2;
              bioText.color = "white";
              bioText.textWrapping = TextWrapping.WordWrap;
              bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
              bioText.setPadding("0%", "5%", "0%", "0%");
              bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
              bioText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
              bioText.text = element.art_descritivo;

              bioGrid.addControl(bioText);
              
              for (let index = 1 ; index < element.columns.length; index++){
                const info = element.columns[index];
                bioText = new TextBlock("bioText");
                bioText.width = 0.4;
                bioText.height = 0.1;
                bioText.color = "white";
                bioText.textWrapping = TextWrapping.WordWrap;
                bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                bioText.setPadding("0%", "5%", "0%", "5%");
                bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                bioText.top = -150 + (index) * 50;
                bioText.text = info + ":";

                bioGrid.addControl(bioText);

                bioText = new TextBlock("bioText");
                bioText.width = 0.6;
                bioText.height = 0.1;
                bioText.color = "white";
                bioText.textWrapping = TextWrapping.WordWrap;
                bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                bioText.setPadding("0%", "5%", "0%", "0%");
                bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
                bioText.top =-150 + (index) * 50;
                bioText.text = shown[index-1].toString();
                
                bioGrid.addControl(bioText);
              }
              
              bioGrid.background = "#4e5159";
              this.bioSlate.mesh?.setDirection(new Vector3(-this.camera.position.x,-this.camera.position.y,-this.camera.position.z));
              this.bioSlate.content = bioGrid;
              this.bioSlate._contentMaterial.alpha = 0.5;
              
              
              
            }else if (element.art_codigo.toString() == this.hit!.pickedMesh?.id && this.isPicked == this.hit!.pickedMesh?.id){
              
              this.isPicked="";
              this.bioSlate.dispose();
            }
        });              
        

}

async createEmployee(numb : IDadosEmployee) {
//imports the equipments
const  meshes  = await SceneLoader.ImportMeshAsync("","../assets/models/black_uniform_woman_employee/","scene.gltf",this.scene);

//ALL objects  
meshes.meshes[0].getChildMeshes().forEach( m => { m.id = numb.em_codigo;
                                            m.metadata = {type:"employee", x: numb.em_posx, y:numb.em_posy,z:numb.em_posz};  });


var route = meshes.meshes[0];
route.scaling = new Vector3(50,70,50);
this.dataEmployee.forEach( element => {
  if (element.em_codigo == numb.em_codigo) {
    route.setAbsolutePosition(new Vector3(element.em_posx,element.em_posy-62,element.em_posz));
    route.name = element.em_descritivo;
  }
})
route.metadata = "employee";
route.isPickable= true;

}

createSlateEmployee() {
      this.dataEmployee.forEach(async element => {
                  
        if(element.em_codigo.toString() == this.hit!.pickedMesh?.id && this.isPicked != this.hit!.pickedMesh?.id){

          
          this.isPicked = this.hit!.pickedMesh?.id;
          // resets the rotation and aspect of the slate so it can be right in front of the camera
          if(this.bioSlate.node == null){
            this.bioSlate = new HolographicSlate("bioSlate");
            
          }

          var shown = [element.em_descritivo, element.em_posx,element.em_posy,element.em_posz];

          this.bioSlate.resetDefaultAspectAndPose(true);
          this.manager.addControl(this.bioSlate);
          this.bioSlate.dimensions = new Vector2(100, 100);
          this.bioSlate.position = new Vector3(this.hit!.pickedMesh.metadata.x,Number.parseInt(this.hit!.pickedMesh.metadata.y) + 100, this.hit!.pickedMesh.metadata.z);
          this.bioSlate.title = "Employee Information";
          this.bioSlate.titleBarHeight = 1.5;
          this.camera.setTarget(new Vector3(this.hit!.pickedMesh.position.x,this.hit!.pickedMesh.position.y+ 100,this.hit!.pickedMesh.position.z)); 
          var bioGrid = new Grid("bioGrid");
          var bioText = new TextBlock("bioText");
          bioText.width = 1;
          bioText.height = 0.2;
          bioText.color = "white";
          bioText.fontSize = 45;
          bioText.textWrapping = TextWrapping.WordWrap;
          bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
          bioText.setPadding("0%", "5%", "0%", "0%");
          bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
          bioText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
          bioText.text = element.em_descritivo;
          element.columns = ["em_descritivo","em_posx","em_posy","em_posz","photo"];
          bioGrid.addControl(bioText);
          //mudar no access data para receber os employees
          for (let index = 1 ; index < 4; index++){
            const info = element.columns[index];
            bioText = new TextBlock("bioText");
            bioText.width = 0.4;
            bioText.height = 0.1;
            bioText.color = "white";
            bioText.textWrapping = TextWrapping.WordWrap;
            bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            bioText.setPadding("0%", "5%", "0%", "5%");
            bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            bioText.top = -200 + (index) * 50;
            bioText.text = info + ":";

            bioGrid.addControl(bioText);

            bioText = new TextBlock("bioText");
            bioText.width = 0.6;
            bioText.height = 0.1;
            bioText.color = "white";
            bioText.textWrapping = TextWrapping.WordWrap;
            bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            bioText.setPadding("0%", "5%", "0%", "0%");
            bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            bioText.top =-200 + (index) * 50;
            bioText.text = shown[index].toString();
            
            bioGrid.addControl(bioText);
          }
          console.log(element.photo);
          var img =  new Image("imagemEmployee",element.photo);
          img.width = 0.8;
          img.height = 0.5;
          img.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
          bioGrid.addControl(img);

          
          bioGrid.background = "#4e5159";
          this.bioSlate.mesh?.setDirection(new Vector3(-this.camera.position.x,-this.camera.position.y,-this.camera.position.z));
          this.bioSlate.content = bioGrid;
          this.bioSlate._contentMaterial.alpha = 0.5;
          
          
          
        }else if (element.em_codigo.toString() == this.hit!.pickedMesh?.id && this.isPicked == this.hit!.pickedMesh?.id){
          
          this.isPicked="";
          this.bioSlate.dispose();
        }
    });              

}

createButtons(bioGrid: Grid) {
var textButton = new TextBlock("textButton");
textButton.width = 1;
textButton.height = 1;
textButton.fontSize = 26;
textButton.color = "black";
textButton.textWrapping = TextWrapping.WordWrap;
textButton.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton.setPadding("0%", "5%", "0%", "0%");
textButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton.text = "Information";


var bioButton = new Button("buttonInfo");
bioButton.addControl(textButton);
bioButton.width = 0.5;
bioButton.height = 0.1;
bioButton.color = "#4e5159";
bioButton.background = "#4e5159";
bioButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
bioButton.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT;
bioButton.onPointerClickObservable.add( () =>{
    bioGrid.clearControls();
    this.createSlateMachine(this.lastMachine);
    bioGrid.background = "#4e5159";
    
});


bioGrid.addControl(bioButton);



var textButton1 = new TextBlock("textButton");
textButton1.width = 1;
textButton1.height = 1;
textButton1.fontSize = 26;
textButton1.color = "black";
textButton1.textWrapping = TextWrapping.WordWrap;
textButton1.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton1.setPadding("0%", "5%", "0%", "0%");
textButton1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton1.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
textButton1.text = "Data";

var bioBtn = new Button("buttonData");
bioBtn.addControl(textButton1);
bioBtn.width = 0.5;
bioBtn.height = 0.1;
bioBtn.color = "orange";
bioBtn.background = "orange";
bioBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
bioBtn.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
bioBtn.onPointerClickObservable.add( () =>{
    //this.bioSlate.dimensions = new Vector2(100, 200);
    bioGrid.clearControls();
    
    this.createDataChart(bioGrid);
    this.createButtons(bioGrid);
    bioGrid.background = "orange";

});
bioGrid.addControl(bioBtn);

}

createDataChart(bioGrid : Grid) {
this.bioSlate.dimensions = new Vector2(200,200);
this.bioSlate.position.y+=100;
this.bioSlate.content = bioGrid;
var element!: IDados;
this.data.forEach(elem => {
  if(elem.equipmentId.toString() == this.lastMachine?.id){
    element = elem;
  }
})

var textMachine = new TextBlock("textDataChart");
textMachine.width = 1;
textMachine.height = 1;
textMachine.fontSize = 36;
textMachine.color = "black";
textMachine.textWrapping = TextWrapping.WordWrap;
textMachine.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
textMachine.setPadding("0%", "0%", "0%", "5%");
textMachine.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
textMachine.top = -150;
textMachine.text = "Equipment: " + element.name;
bioGrid.addControl(textMachine);


this.createChart(bioGrid);



var textChart = new TextBlock("textDataChart");
textChart.width = 1;
textChart.height = 1;
textChart.fontSize = 22;
textChart.color = "black";
textChart.textWrapping = TextWrapping.WordWrap;
textChart.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
textChart.setPadding("0%", "0%", "0%", "5%");
textChart.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
textChart.top = -100;
textChart.text = "Min: "+this.min+"ºC         Max: "+ this.max +"ºC       Avg: "+this.avg.toFixed(2)+"ºC";
bioGrid.addControl(textChart);



}



createChart(bioGrid: Grid){
  this.dadosSensores.forEach(elements => {
    
    this.timeChart.push(elements.timestamp);
    this.dataChart.push(elements.value);
    if(this.max < elements.value){
      this.max = elements.value;
    }
    if(this.min > elements.value){
      this.min = elements.value;
    }
    this.avg = this.avg + elements.value;
  })
  this.avg = this.avg/ this.dadosSensores.length;
  var dataUrl;
  var plane = CreatePlane("plane", {width: 6, height: 6}, this.scene);
  plane.position = new Vector3(this.bioSlate.position.x, this.bioSlate.position.y,this.bioSlate.position.z);
    plane.isVisible = false;
    const echartsCanvas = document.createElement("canvas");
    echartsCanvas.width = 1024;
    echartsCanvas.height = 1024;
    echartsCanvas.style.width = echartsCanvas.width + "px";
    echartsCanvas.style.height = echartsCanvas.height + "px";

    // Example chart from the echarts "Get Started" doc: https://echarts.apache.org/handbook/en/get-started/        
    // Initialize the echarts instance based on the prepared dom
    var myChart = echarts.init(echartsCanvas);

    // Specify the configuration items and data for the chart
    var option = {
      xAxis: {
        type: 'category',
        data: this.timeChart
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.dataChart,
          type: 'line',
          smooth: true
        }
      ]
    };

    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);

    // Wait until the echarts canvas is rendered
    myChart.on('finished', () => {
     
        const echartsTexture = new DynamicTexture("echartsTexture", echartsCanvas, this.scene, true);
        echartsTexture.update();

        const echartsMaterial = new StandardMaterial("echartsMaterial", this.scene);
        echartsMaterial.emissiveTexture = echartsTexture;
        plane.material = echartsMaterial;
       
        dataUrl = echartsCanvas.toDataURL("image/jpeg",1);
        console.log(dataUrl);
        var img = new Image("img",dataUrl);
        img.height = 0.6;
        
        img.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        bioGrid.addControl(img);
        
    });

}

}
import {
    Vector3,Scene,
    Engine,
    SceneLoader,
    MeshBuilder,
    Color3,
    Color4,
    HemisphericLight,
    FreeCamera,
    ArcRotateCamera,
    Tools,
    Mesh,
    Matrix,
    Camera,
    ThinMaterialHelper,
    WebXRState,
    StandardMaterial,
    WebXRFeatureName,
    int,
    AbstractMesh,
    UniversalCamera,
    WebXRDefaultExperience,
    WebXRExperienceHelper,
    WebXRSessionManager,
    Angle,
    Space,
    Vector2,
    FollowBehavior,
    Animatable,
    BabylonFileLoaderConfiguration,
    ActionManager,
    PointerEventTypes,
    Axis,
    Ray,
    PointerDragBehavior,
    PickingInfo,
    Nullable} from '@babylonjs/core';
    import '@babylonjs/loaders';
    import { AdvancedDynamicTexture, Button, Control, CylinderPanel, Grid, GUI3DManager, HolographicButton, HolographicSlate, Rectangle, Slider, StackPanel, TextBlock, TextWrapping } from '@babylonjs/gui';
    import { HttpClient } from '@angular/common/http';

import { IDados } from './dados';
import { Observable } from 'rxjs';
import { catchError, tap, map, elementAt } from 'rxjs/operators';
import { IDadosERP } from './dadosERP';
import  * as ICameraInput from './CameraInputs';
import { ThisReceiver } from '@angular/compiler';
import { IDadosLote } from './dadosLote';
import { IDadosLoteDB } from './IDadosLotesDB';
 
  
  
  
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
    isPicked: string = "";
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
    ray!: Ray;
    hit!: Nullable<PickingInfo>;

  
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

  async startAll(dados: IDados[], dadosERP: IDadosERP[], dadosLote : IDadosLote[], dadosLoteDb : IDadosLoteDB[]){
    this.data=dados;
    this.datasERP = dadosERP;
    this.dataLote = dadosLote;
    this.dataLoteDB = dadosLoteDb;
    this.scene = this.createScene(this.canvas);
    this.scene2 = this.createAxis();
    
       
      this.data.forEach(element => {
        this.createEquipment(element,this.scene);
      }); 
      this.dataLoteDB.forEach( element => {
        this.createLote(element);
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
                      console.log(xr_ids);
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
                
              console.log(this.hit!.pickedMesh);

              if(this.hit!.pickedMesh.metadata.type == "equipment"){
                  this.createSlateMachine();
              }else if (this.hit!.pickedMesh.metadata == "lote") {
                window.alert("Lote");
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
        button.color = "black";
        button.background = "transparent";
        button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        
        var panel = new StackPanel();
        panel.width = "220px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(panel);

        var header3 = new TextBlock();
        header3.text = "Axis X: 0 deg";
        header3.height = "30px";
        header3.color = "black";
        panel.addControl(header3);

        var slider3 = new Slider();
        slider3.minimum = -Math.PI;
        slider3.maximum = Math.PI;
        slider3.value = 0;
        slider3.height = "20px";
        slider3.width = "200px";

        var pval = 0;
        slider3.onValueChangedObservable.add( (value) => {
            //this.camera.setPivotMatrix(Matrix.Translation(2, 0, 0));
            header3.text = "Axis X: " + (Tools.ToDegrees(value) | 0) + " deg";
            if (this.camera) {
                this.camera.rotation.x = value;
            }
            pval = value;
        });
        panel.addControl(slider3);

        var button2 = Button.CreateSimpleButton("button_on_off", "OFF");
        button2.width = 0.1;
        button2.height = "40px";
        button2.color = "black";
        button2.background = "transparent";
        button2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        
        var panel2= new StackPanel();
        panel2.width = "220px";
        panel2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(panel2);

        var header2 = new TextBlock();
        header2.text = "Axis Y: 0 deg";
        header2.height = "30px";
        header2.color = "black";
        panel.addControl(header2);

        var slider2 = new Slider();
        slider2.minimum = -Math.PI;
        slider2.maximum = Math.PI;
        slider2.value = 0;
        slider2.height = "20px";
        slider2.width = "200px";

        var pval = 0;
        slider2.onValueChangedObservable.add( (value) => {
            //this.camera.setPivotMatrix(Matrix.Translation(2, 0, 0));
            header2.text = "Axis Y: " + (Tools.ToDegrees(value) | 0) + " deg";
            if (this.camera) {
                this.camera.rotation.y = value;
            }
            pval = value;
        });
        panel.addControl(slider2);


        var button1 = Button.CreateSimpleButton("button_on_off", "OFF");
        button1.width = 0.1;
        button1.height = "40px";
        button1.color = "black";
        button1.background = "transparent";
        button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        
        var panel1 = new StackPanel();
        panel1.width = "220px";
        panel1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(panel1);

        var header1 = new TextBlock();
        header1.text = "Axis Z: 0 deg";
        header1.height = "30px";
        header1.color = "black";
        panel.addControl(header1);

        var slider1 = new Slider();
        slider1.minimum = -Math.PI;
        slider1.maximum = Math.PI;
        slider1.value = 0;
        slider1.height = "20px";
        slider1.width = "200px";

        var pval = 0;
        slider1.onValueChangedObservable.add( (value) => {
            //this.camera.setPivotMatrix(Matrix.Translation(2, 0, 0));
            header1.text = "Axis Z: " + (Tools.ToDegrees(value) | 0) + " deg";
            if (this.camera) {
                this.camera.rotation.z = value;
            }
            pval = value;
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
        meshes.meshes[0].getChildMeshes().forEach( m => m.id = numb.equipmentId.toString())
        
        var route = meshes.meshes[0];
        route.scaling = new Vector3(.03,.03,.03);
        this.datasERP.forEach( element => {
          if (element.equipmentId == numb.equipmentId.toString()) {
            route.setAbsolutePosition(new Vector3(element.equipmentPositionX,element.equipmentPositionY,element.equipmentPositionZ));
            route.name = element.equipmentName;
          }
        })
        route.metadata ={type : "equipment"};
        
        route.isPickable= true;
        
        if(numb.direction != null){
        var rotation = Angle.FromDegrees(numb.direction).radians();
          route.rotate(new Vector3(0,1,0),rotation,Space.LOCAL);
        } 
        
       // this.createSlateMachine();


    }


    createSlateMachine() : void {

      this.scene.onPointerDown = async (evt) =>{

        this.ray = this.scene.createPickingRay( this.scene.pointerX, this.scene.pointerY, Matrix.Identity(), this.camera);
        this.hit=  this.scene.pickWithRay(this.ray);
        if (this.hit!.pickedMesh && this.hit!.pickedMesh.name != "Material2") {
              
            console.log(this.hit!.pickedMesh);


            this.data.forEach(async element => {
                
                if(element.equipmentId.toString() == this.hit!.pickedMesh?.id && this.isPicked != this.hit!.pickedMesh?.id){
                  var x = this.scene.animationGroups[Number.parseInt(this.hit!.pickedMesh.id)-1].isStarted;
                  if(x == true){
                    this.scene.animationGroups[Number.parseInt(this.hit!.pickedMesh.id)-1].stop();
                  
                  }
                  
                  this.isPicked = this.hit!.pickedMesh?.id;
                  // resets the rotation and aspect of the slate so it can be right in front of the camera
                  if(this.bioSlate.node == null){
                    this.bioSlate = new HolographicSlate("bioSlate");
                    
                  }

                  var shown = [element.seriesNumber,element.model,element.status,element.brand,element.manufacturer,element.height,element.weight];

                  this.bioSlate.resetDefaultAspectAndPose(true);
                  this.manager.addControl(this.bioSlate);
                  this.bioSlate.dimensions = new Vector2(100, 100);
                  this.bioSlate.position = new Vector3(this.hit!.pickedMesh.absolutePosition._x,this.hit!.pickedMesh.absolutePosition._y + 180, this.hit!.pickedMesh.absolutePosition._z);
                  this.bioSlate.title = "Machine Information";
                  this.bioSlate.titleBarHeight = 1.5;
                  this.camera.setTarget(this.bioSlate.position);

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
                  bioText.text = element.name;

                  bioGrid.addControl(bioText);
                  console.log(element);
                  for (let index = 6 ; index < element.columns.length; index++){
                    const info = element.columns[index];
                    bioText = new TextBlock("bioText");
                    bioText.width = 0.4;
                    bioText.height = 0.1;
                    bioText.color = "white";
                    bioText.textWrapping = TextWrapping.WordWrap;
                    bioText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                    bioText.setPadding("0%", "5%", "0%", "5%");
                    bioText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                    bioText.top = -150 + (index-6) * 50;
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
                    bioText.top =-150 + (index-6) * 50;
                    bioText.text = shown[index-6].toString();
                    
                    bioGrid.addControl(bioText);
                  }
                  
                  bioGrid.background = "#000080";
                  
                  this.bioSlate.content = bioGrid;
                  this.bioSlate._contentMaterial.alpha = 0.5;
                  
                  
                  
                }else if (element.equipmentId.toString() == this.hit!.pickedMesh?.id && this.isPicked == this.hit!.pickedMesh?.id){
                  
                  this.isPicked="";
                  this.bioSlate.dispose();
                  this.scene.animationGroups[Number.parseInt(this.hit!.pickedMesh.id)-1].play(true);
                }
            });              
            
          }
      }
    }
    
    async createLote(numb : IDadosLoteDB) {
      //imports the equipments
      const  meshes  = await SceneLoader.ImportMeshAsync("","../assets/models/cargo_crate/","scene.gltf",this.scene);

      //ALL objects  
      meshes.meshes[0].getChildMeshes().forEach( m => m.id = numb.art_codigo.toString())

      
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

    
  
  }
  
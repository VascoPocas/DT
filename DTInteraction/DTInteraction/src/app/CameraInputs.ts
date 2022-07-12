import { Engine, FreeCamera, ICameraInput, KeyboardEventTypes, KeyboardInfo, Nullable, Observer, Scene, UniversalCamera, Vector3 } from '@babylonjs/core'


export class FreeCameraKeyboardWalkInput implements ICameraInput<UniversalCamera>{
  public camera!: UniversalCamera
  public keysUp = [38]
  public keysDown = [40]
  public keysLeft = [37]
  public keysRight = [39]
  public keysMoveLeft = [65] ;
  public keysMoveRight = [68];
  public keyMoveUp =  [87];
  public keyMoveDown = [83];

  private _keys = new Array<number>();
  private _onCanvasBlurObserver!: Nullable<Observer<Engine>>;
  private _onKeyboardObserver!: Nullable<Observer<KeyboardInfo>>;
  private _engine!: Engine;
  private _scene!: Scene;

  attachControl(noPreventDefault?: boolean): void {
    if (this._onCanvasBlurObserver) {
      return;
    }

    this._scene = this.camera.getScene();
    this._engine = this._scene.getEngine();

    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys = [];
    });

    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      let evt = info.event;
      if (!evt.metaKey) {
        if (info.type === KeyboardEventTypes.KEYDOWN) {
          if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1 ||
            this.keysMoveRight.indexOf(evt.keyCode) !== -1 ||
            this.keyMoveDown.indexOf(evt.keyCode) !== -1 ||
            this.keysMoveLeft.indexOf(evt.keyCode) !== -1 ||
            this.keyMoveUp.indexOf(evt.keyCode) !== -1 ) {
            var index = this._keys.indexOf(evt.keyCode);
            if (index === -1) {
              this._keys.push(evt.keyCode);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }


        } else {
          if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
            this.keysDown.indexOf(evt.keyCode) !== -1 ||
            this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            this.keysRight.indexOf(evt.keyCode) !== -1 ||
            this.keysMoveRight.indexOf(evt.keyCode) !== -1 ||
            this.keyMoveDown.indexOf(evt.keyCode) !== -1 ||
            this.keysMoveLeft.indexOf(evt.keyCode) !== -1 ||
            this.keyMoveUp.indexOf(evt.keyCode) !== -1) {
            var index = this._keys.indexOf(evt.keyCode);

            if (index >= 0) {
              this._keys.splice(index, 1);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        }
      }
    });

  }

  detachControl(): void {
    if (this._scene) {
      if (this._onKeyboardObserver) {
        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
      }

      if (this._onCanvasBlurObserver) {
        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
      }
      this._onKeyboardObserver = null;
      this._onCanvasBlurObserver = null;
    }
    this._keys = [];
  }

  public checkInputs(): void {
    if (this._onKeyboardObserver) {
      var camera = this.camera;
      // Keyboard
      for (var index = 0; index < this._keys.length; index++) {
        var keyCode = this._keys[index];
        var speed = camera._computeLocalCameraSpeed();

        if (this.keysLeft.indexOf(keyCode) !== -1) {
          camera.rotation.y -= speed/2;
          camera._localDirection.copyFromFloats(0, 0, 0);
        
        } else if (this.keysUp.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, speed);
        
        } else if (this.keysRight.indexOf(keyCode) !== -1) {
          camera.rotation.y += speed/2;
          camera._localDirection.copyFromFloats(0, 0, 0);
        
        } else if (this.keysDown.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, -speed);
        }else if (this.keyMoveDown.indexOf(keyCode) !== -1){
          camera._localDirection.copyFromFloats(0,-speed*2,0);
        }else if (this.keyMoveUp.indexOf(keyCode) !== -1){
          camera._localDirection.copyFromFloats(0,speed*2,0);
        }else if (this.keysMoveLeft.indexOf(keyCode) !== -1){
          camera._localDirection.copyFromFloats(-speed*2,0,0);
        }else if (this.keysMoveRight.indexOf(keyCode) !== -1){
          camera._localDirection.copyFromFloats(speed*2,0,0);
        }

        if (camera.getScene().useRightHandedSystem) {
          camera._localDirection.z *= -1;
        }

        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
        Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
        camera.cameraDirection.addInPlace(camera._transformedDirection);
      }
    }
  }

  public getClassName(): string {
    return 'FreeCameraKeyboardWalkInput'
  }

  public _onLostFocus(): void {
    this._keys = [];
  }

  public getSimpleName(): string {
    return 'keyboard'
  }
}
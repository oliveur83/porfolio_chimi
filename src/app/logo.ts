import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Table } from './asset3D/table';
import { Sol } from './asset3D/sol';
import { Tube } from './asset3D/tube';
import { Micro } from './asset3D/micro';
import { Tableau } from './asset3D/tableau';
import { creerSceneAtome } from './asset3D/atome';
import { blouser } from './asset3D/blouser';

export class logo {
  private mouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(public container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0xbff0e2, 1);

    this.init();
  }

  init() {
    this.createCamera();
    this.addObjectsToScene();
    this.addEventListeners();
    this.animate();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(-10, 20, -15);
    this.camera.lookAt(0, 0, 0);
  }

  addObjectsToScene() {
    const micro = new Micro();
    micro.position.set(0, 5, 0);
    micro.name = 'micro';
    this.scene.add(micro);

    const sol = new Sol();
    sol.name = "sol";
    this.scene.add(sol);

    const table = new Table();
    table.name = "table";
    this.scene.add(table);

    const tube = new Tube();
    tube.position.set(5, 9, 0);
    tube.name = "tube";
    this.scene.add(tube);

    const tab = new Tableau();
    tab.name = 'tableau';
    tab.position.set(13, 20, -9);
    this.scene.add(tab);

    const blouserr = new blouser();
    blouserr.position.set(0, 10, 14.5);
    this.scene.add(blouserr);
  }

  addEventListeners() {
    document.addEventListener('mousedown', this.onMouseDownHandler.bind(this));
    document.addEventListener('mouseup', this.onMouseUpHandler.bind(this));
    document.addEventListener('mousemove', this.onMouseMoveHandler.bind(this));
    document.addEventListener('wheel', this.onWheelHandler.bind(this));
    document.addEventListener('click', this.onMouseClick.bind(this));
  }

  removeEventListeners() {
    document.removeEventListener('mousedown', this.onMouseDownHandler.bind(this));
    document.removeEventListener('mouseup', this.onMouseUpHandler.bind(this));
    document.removeEventListener('mousemove', this.onMouseMoveHandler.bind(this));
    document.removeEventListener('wheel', this.onWheelHandler.bind(this));
    document.removeEventListener('click', this.onMouseClick.bind(this));
  }

  onMouseClick(event: MouseEvent) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      console.log("je susi la ")
      const object = intersects[0].object;
      console.log(object)
      if (object.parent?.name === 'micro') {
        this.gotosceneatome();
      } else if (object.parent?.name === 'tableau') {

        this.gotoscenetableau();
      }
    }
  }

  gotosceneatome() {
    const micro = this.scene.getObjectByName('micro') as Micro;
    const targetPosition = micro.position.clone();

    new TWEEN.Tween(this.camera.position)
      .to({
        x: targetPosition.x - 4,
        y: targetPosition.y + 5,
        z: targetPosition.z,
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.camera.lookAt(targetPosition);
      })
      .onComplete(() => {
        // Supprimer l'ancienne scène et la caméra
        this.scene.clear();
        this.removeEventListeners();

        // Créer une nouvelle scène
        const nouvelleScene = creerSceneAtome();
        this.scene = nouvelleScene;

        // Réinitialiser et repositionner la caméra pour la nouvelle scène
        this.createCamera();
        this.camera.position.set(-15, 0, 25); // Ajustez ces coordonnées selon vos besoins
        this.camera.lookAt(-15, 0, 0);

        // Re-ajouter les événements si nécessaire
        this.addEventListeners();
      })
      .start();
  }

  gotoscenetableau() {
    const micro = this.scene.getObjectByName('micro') as Micro;
    const targetPosition = micro.position.clone();

    new TWEEN.Tween(this.camera.position)
      .to({
        x: targetPosition.x,
        y: targetPosition.y + 5,
        z: targetPosition.z + 10,
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.camera.lookAt(targetPosition);
      })
      .start();
  }

  onMouseDownHandler(event: MouseEvent) {
    this.mouseDown = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onMouseUpHandler() {
    this.mouseDown = false;
  }

  onMouseMoveHandler(event: MouseEvent) {
    if (this.mouseDown) {
      const deltaX = event.clientX - this.mouseX;
      const deltaY = event.clientY - this.mouseY;

      this.scene.rotation.y += deltaX * 0.01;
      // this.scene.rotation.x += deltaY * 0.01;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }

  onWheelHandler(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.camera.position.z += 0.5;
      this.camera.position.y -= 0.5;
      this.camera.position.x += 0.5;
    } else if (event.deltaY > 0) {
      this.camera.position.z -= 0.5;
      this.camera.position.x -= 0.5;
      this.camera.position.y += 0.5;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }
}

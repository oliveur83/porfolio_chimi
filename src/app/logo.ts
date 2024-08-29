import * as THREE from 'three';
import { Table } from './asset3D/table';
import { Sol } from './asset3D/sol';
import { Tube } from './asset3D/tube';
import { Micro } from './asset3D/micro';
import { Tableau } from './asset3D/tableau';
import { creerSceneAtome } from './asset3D/atome';
import * as TWEEN from '@tweenjs/tween.js';
import { blouser } from './asset3D/blouser';

export class logo {
  private mouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  constructor(public container: HTMLElement) {}

  init() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      
    
    let scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    camera.position.x = -0;
    camera.position.y = 10;
    camera.position.z = -15;
    camera.lookAt(0, 0, 0);

    const micro = new Micro();
    micro.position.set(0, 5, 0);
    micro.name = 'micro';
    scene.add(micro);
    const sol = new Sol();
    sol.name="sol"
    scene.add(sol);
    const table = new Table();
    table.name="table"
    scene.add(table);
    const tube = new Tube();
    tube.position.set(5, 9, 0);
    tube.name="tube"
    scene.add(tube);
    const tab = new Tableau();
    tab.name = 'tableau';
    tab.position.set(13, 20, -9);
    scene.add(tab);

    const blouserr =new blouser();
    blouserr.position.set(0, 10, 5);
    scene.add(blouserr);
    
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function onMouseClick(event: { clientX: number; clientY: number }) {
      // Mettre à jour les coordonnées de la souris en fonction de la position du clic
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(scene.children);
      if (
        intersects.length > 0 &&
        intersects[0].object.parent?.name == micro.name
      ) {
        gotosceneatome();
      } else if (
        intersects.length > 0
        // intersects[0].object.parent?.name == tab.name
      ) {
        gotoscenetableau();
      }
      
    }
    //-------------------------------------
    // Création du rendu
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(renderer.domElement);
    renderer.setClearColor(0xbff0e2,1);
    //------------------------------------------
    function gotosceneatome() {
      const targetPosition = micro.position.clone();
      const cameraTarget = new TWEEN.Tween(camera.position)
        .to(
          {
            x: targetPosition.x - 4,
            y: targetPosition.y + 5,
            z: targetPosition.z,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          camera.lookAt(targetPosition);
        });
      const nextAnimation = new TWEEN.Tween(camera.position)
        .to(
          {
            x: targetPosition.x - 2,
            y: targetPosition.y + 3.7,
            z: targetPosition.z,
          },
          500
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          const nouvelleScene = creerSceneAtome();
          scene.clear();
          scene.add(nouvelleScene);
          scene = nouvelleScene;
          camera.position.set(+20, 0, +20); 
          camera.lookAt(0, 0, 0); 
               // Désactiver les événements liés à la caméra pour bloquer les mouvements
      document.removeEventListener('mousedown', onMouseDownHandler);
      document.removeEventListener('mouseup', onMouseUpHandler);
      document.removeEventListener('mousemove', onMouseMoveHandler);
      document.removeEventListener('wheel', onWheelHandler);
        });
      cameraTarget.chain(nextAnimation);
      cameraTarget.start();
    }
    function gotoscenetableau() {
      const targetPosition = micro.position.clone();
      const cameraTarget = new TWEEN.Tween(camera.position)
        .to(
          {
            x: targetPosition.x,
            y: targetPosition.y + 5,
            z: targetPosition.z,
          },
          1000
        )

        .onUpdate(() => {
          camera.lookAt(20, 5, 0);
        })
        // .onComplete(() => {
        //   table.remove(tube);
        // });

      // Démarrer la première animation
      cameraTarget.start();
    }
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      renderer.render(scene, camera);
    }
    animate();
    const onMouseDownHandler = (event: MouseEvent) => {
      this.mouseDown = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    };
    
    const onMouseUpHandler = () => {
      this.mouseDown = false;
    };
    
    const onMouseMoveHandler = (event: MouseEvent) => {
      if (this.mouseDown) {
        const deltaX = event.clientX - this.mouseX;
        const deltaY = event.clientY - this.mouseY;
    
        scene.rotation.y += deltaX * 0.01;
        // scene.rotation.x += deltaY * 0.01;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    };
    
    const onWheelHandler = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        camera.position.z += 0.5;
        camera.position.y -= 0.5;
        camera.position.x += 0.5;
      } else if (event.deltaY > 0) {
        camera.position.z -= 0.5;
        camera.position.x -= 0.5;
        camera.position.y += 0.5;
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', onMouseDownHandler);
      document.addEventListener('mouseup', onMouseUpHandler);
      document.addEventListener('mousemove', onMouseMoveHandler);
      document.addEventListener('wheel', onWheelHandler);
    }
    window.addEventListener('click', onMouseClick, false);   
  }
}
}
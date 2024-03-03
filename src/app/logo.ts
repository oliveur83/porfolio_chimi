import * as THREE from 'three';
import { Table } from './asset3D/table';
import { Sol } from './asset3D/sol';
import { Tube } from './asset3D/tube';
import { Micro } from './asset3D/micro';
import { Tableau } from './asset3D/tableau';
import { creerSceneAtome } from './asset3D/atome';
import * as TWEEN from '@tweenjs/tween.js';

export class logo {
  private mouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  constructor(public container: HTMLElement) {}

  init() {
    // Création de la scène
    let scene = new THREE.Scene();
    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );

    camera.position.x = -20;
    camera.position.y = 20;
    camera.position.z = -20;
    camera.lookAt(0, 0, 0);
    //-------------------------------------------------------
    const sol = new Sol();
    scene.add(sol);
    const table = new Table();
    scene.add(table);
    const micro = new Micro();
    micro.position.set(0, 5, 0);
    micro.name = 'toto';
    scene.add(micro);

    const tube = new Tube();
    tube.position.set(5, 9, 0);
    table.add(tube);
    const tab = new Tableau();
    tab.name = 'tata';
    tab.position.set(14, 14, -10);
    table.add(tab);

    var raycaster = new THREE.Raycaster();

    var mouse = new THREE.Vector2();

    function onMouseClick(event: { clientX: number; clientY: number }) {
      // Mettre à jour les coordonnées de la souris en fonction de la position du clic
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.children, true);

      if (
        intersects.length > 0 &&
        intersects[0].object.parent?.name == micro.name
      ) {
        toto();
      } else if (
        intersects.length > 0 &&
        intersects[0].object.parent?.name == tab.name
      ) {
        tata();
      }
    }
    window.addEventListener('click', onMouseClick, false);

    //-------------------------------------
    // Création du rendu
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(renderer.domElement);
    renderer.setClearColor(0xc4e4f4, 1);
    //------------------------------------------
    function toto() {
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
          camera.position.x = -10;
        });
      cameraTarget.chain(nextAnimation);

      cameraTarget.start();
    }
    function tata() {
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
        .onComplete(() => {
          table.remove(tube);
        });

      // Démarrer la première animation
      cameraTarget.start();
    }
    function animate() {
      requestAnimationFrame(animate);
      //scene.rotation.y += 0.01;
      TWEEN.update();
      renderer.render(scene, camera);
    }
    animate();
    document.addEventListener('mousedown', (event) => {
      this.mouseDown = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    document.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
      if (this.mouseDown) {
        const deltaX = event.clientX - this.mouseX;
        const deltaY = event.clientY - this.mouseY;

        scene.rotation.y += deltaX * 0.01;
        scene.rotation.x += deltaY * 0.01;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });
    document.addEventListener('wheel', (event) => {
      if (event.deltaY < 0) {
        camera.position.z += 0.5;
        camera.position.y -= 0.5;
        camera.position.x += 0.5;
      } else if (event.deltaY > 0) {
        camera.position.z -= 0.5;
        camera.position.x -= 0.5;
        camera.position.y += 0.5;
      }
    });
  }
}

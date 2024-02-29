import * as THREE from 'three';
import { Table } from './asset3D/table';
import { Sol } from './asset3D/sol';
import { Tube } from './asset3D/tube';
import { Micro } from './asset3D/micro';
import { Tableau } from './asset3D/tableau';
import { creerSceneAtome } from './asset3D/atome';
import * as TWEEN from '@tweenjs/tween.js';
//x ro uge , bleu y
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
    const sol = new Sol(); // Supposons que sol est une classe qui crée le modèle 3D
    scene.add(sol);
    const table = new Table();
    scene.add(table);
    const micro = new Micro();
    micro.position.set(0, 5, 0); // Supposons que sol est une classe qui crée le modèle 3D
    table.add(micro);
    document.addEventListener('click', toto);
    const tube = new Tube(); // Supposons que Tube est une classe qui crée le modèle 3D
    tube.position.set(5, 9, 0); // Supposons que sol est une classe qui crée le modèle 3D
    table.add(tube);
    const tab = new Tableau(); // Supposons que sol est une classe qui crée le modèle 3D
    tab.position.set(14, 14, -10); // Supposons que sol est une classe qui crée le modèle 3D
    table.add(tab);

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
        ) // Animez la caméra vers la position cible avec un décalage z pour qu'elle ne soit pas juste devant l'objet
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
        ) // Animez la caméra vers la position cible avec un décalage z pour qu'elle ne soit pas juste devant l'objet
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          const nouvelleScene = creerSceneAtome();
          scene.clear();
          scene.add(nouvelleScene);
          scene = nouvelleScene;
          camera.position.x=-10
        });
      cameraTarget.chain(nextAnimation);

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
    // Gestionnaire d'événements pour le début du clic de la souris
    document.addEventListener('mousedown', (event) => {
      this.mouseDown = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    // Gestionnaire d'événements pour la fin du clic de la souris
    document.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    // Gestionnaire d'événements pour le mouvement de la souris
    document.addEventListener('mousemove', (event) => {
      if (this.mouseDown) {
        const deltaX = event.clientX - this.mouseX;
        const deltaY = event.clientY - this.mouseY;

        // Ajuster la rotation de la scène en fonction du déplacement de la souris
        scene.rotation.y += deltaX * 0.01;
        scene.rotation.x += deltaY * 0.01;

        // Mettre à jour les coordonnées de la souris pour le prochain mouvement
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });
    // Gestionnaire d'événements pour la molette de la souris
    document.addEventListener('wheel', (event) => {
      // Si la molette est tournée vers le haut, avancez la caméra
      if (event.deltaY < 0) {
        camera.position.z += 0.5;
        camera.position.y -= 0.5;
        camera.position.x += 0.5; // ajustez la valeur selon votre préférence
      }
      // Si la molette est tournée vers le bas, reculez la caméra
      else if (event.deltaY > 0) {
        camera.position.z -= 0.5;
        camera.position.x -= 0.5;
        camera.position.y += 0.5; // ajustez la valeur selon votre préférence
      }
    });

    const materialX = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rouge pour l'axe x
    const materialY = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Vert pour l'axe y
    const materialZ = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Bleu pour l'axe z
    const geometryX = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe x
    const geometryY = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe y
    const geometryZ = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe z
    const axeX = new THREE.Mesh(geometryX, materialX);
    const axeY = new THREE.Mesh(geometryY, materialY);
    const axeZ = new THREE.Mesh(geometryZ, materialZ);
    axeX.rotation.z = Math.PI / 2; // Rotation de 90 degrés autour de l'axe z pour l'axe x
    axeY.rotation.x = -Math.PI / 2; // Rotation de -90 degrés autour de l'axe x pour l'axe y
    scene.add(axeX);
    scene.add(axeY);
    scene.add(axeZ);
  }
}

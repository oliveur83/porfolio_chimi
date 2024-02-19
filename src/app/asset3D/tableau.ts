import * as THREE from 'three';

export class Tableau extends THREE.Group {
  constructor() {
    super();

    var rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x800000 });
    // Matériaux
    const baseRadius = 0.05;
    const baseHeight = 2;
    const baseSegments = 32;
    // Nombre de cylindres à créer

    function creerCase(positionX: number, positionY: number) {
      const group = new THREE.Group();

      // Create cylinder geometries and meshes
      const baseB = new THREE.CylinderGeometry(
        baseRadius,
        baseRadius,
        baseHeight,
        baseSegments
      );
      const cyd = new THREE.Mesh(baseB, rectangleMaterial);
      const cyg = new THREE.Mesh(baseB, rectangleMaterial);
      const cyh = new THREE.Mesh(baseB, rectangleMaterial);
      const cyb = new THREE.Mesh(baseB, rectangleMaterial);

      // Set positions and rotations
      cyd.position.x = cyg.position.y + 2;
      cyh.rotation.z = Math.PI / 2;
      cyb.rotation.z = Math.PI / 2;
      cyh.position.x = cyg.position.x + 1;
      cyb.position.x = cyg.position.y + 1;
      cyh.position.y = cyg.position.y + 1;
      cyb.position.y = cyg.position.y - 1;

      // Add meshes to the group
      group.add(cyd);
      group.add(cyg);
      group.add(cyh);
      group.add(cyb);
      group.position.x = positionX;
      group.position.y = positionY;
      return group;
    }

    const tableau_per = [
      [true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, false, false, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true],
    ];
    // Boucle pour créer les cases
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 18; j++) {
        // Calcul des positions pour chaque case
        const positionX = j;
        const positionY = i;
        if (tableau_per[j][i]) {
          const nouvelleCase = creerCase(positionX, positionY);

          this.add(nouvelleCase);
        }
        // Créer une nouvelle case avec les positions calculées
      }
    }

    this.translateY(11);
    this.translateX(5);
    this.translateZ(-10);
    this.rotateX(3.14);
    this.rotateY(Math.PI/2);
  }
}

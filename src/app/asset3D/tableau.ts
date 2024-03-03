import * as THREE from 'three';

export class Tableau extends THREE.Group {
  constructor() {
    super();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    function createTextTexture(
      text: string,
      fontSize: number
    ): THREE.Texture | null {
      // Créer un canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
       return null;
      }

      context.font = fontSize + 'px Arial';
      const metrics = context.measureText(text);
      const textWidth = Math.ceil(metrics.width + 20.0);
      const textHeight = Math.ceil(fontSize + 10.0);
      canvas.width = textWidth;
      canvas.height = textHeight;
      context.font = 'bold ' + fontSize + 'px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.fillText(text, textWidth / 2, textHeight / 2);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    function createTextMesh(text: string, fontSize: number): THREE.Mesh {
      const texture = createTextTexture(text, fontSize);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(
          texture?.image.width / 60,
          texture?.image.height / 60
        ),
        material
      );
      return mesh;
    }
    const textMesh = createTextMesh(' tableau des compétences', 100);
    textMesh.position.y = -4;
    textMesh.position.z = 0;
    textMesh.position.x = 10;
    textMesh.rotation.z = Math.PI;
    textMesh.rotation.y = Math.PI;
    this.add(textMesh);
    var rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x800000 });
    const baseRadius = 0.05;
    const baseHeight = 2;
    const baseSegments = 32;

    function creerCase(positionX: number, positionY: number) {
      const group = new THREE.Group();
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

      cyd.position.x = cyg.position.y + 2;
      cyh.rotation.z = Math.PI / 2;
      cyb.rotation.z = Math.PI / 2;
      cyh.position.x = cyg.position.x + 1;
      cyb.position.x = cyg.position.y + 1;
      cyh.position.y = cyg.position.y + 1;
      cyb.position.y = cyg.position.y - 1;

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

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 18; j++) {
        const positionX = j;
        const positionY = i;
        if (tableau_per[j][i]) {
          const nouvelleCase = creerCase(positionX, positionY);

          this.add(nouvelleCase);
        }
      }
    }

    this.translateY(11);
    this.translateX(5);
    this.translateZ(-10);
    this.rotateX(3.14);
    this.rotateY(Math.PI / 2);

    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000 });
    const tableMaterialmur = new THREE.MeshBasicMaterial({ color: 0x00008b }); 

    const tableTopGeometry = new THREE.BoxGeometry(20, 0.2, 10);
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.rotateX(Math.PI / 2);
    tableTop.translateX(10);
    tableTop.translateZ(-4);
    tableTop.translateY(1);
    this.add(tableTop);
  }
}

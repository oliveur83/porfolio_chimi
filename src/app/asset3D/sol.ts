import * as THREE from 'three';

export class Sol extends THREE.Group {
  constructor() {
    super();
    //-----------couleur ---------------------
    const couleur_sol = new THREE.MeshBasicMaterial({ color: 0x000 });
    const couleur_mur = new THREE.MeshBasicMaterial({ color: 0x00008b });
    //-----------structure---------------------
    const structure_rectangle = new THREE.BoxGeometry(30, 0.2, 30);
    //-----------creation sol ---------------------
    const tableTop = new THREE.Mesh(structure_rectangle, couleur_sol);
    tableTop.position.y = 1;
    tableTop.name = 'toto2';
    //-----------creation des deux mur  ---------------------
    const tableleft = new THREE.Mesh(structure_rectangle, couleur_mur);
    const tablelright = new THREE.Mesh(structure_rectangle, couleur_mur);
    
    tableleft.rotateX(Math.PI / 2);
    tableleft.translateY(15);
    tableleft.translateZ(-15);
    tablelright.rotateZ(Math.PI / 2);
    tablelright.translateY(-15);
    tablelright.translateX(15);
    tableleft.name = 'toto1';
    tablelright.name = 'toto3';

    this.add(tableTop);
    this.add(tableleft);
    this.add(tablelright);
    this.translateY(-1);
  }
}
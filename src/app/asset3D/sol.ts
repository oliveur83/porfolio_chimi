import * as THREE from 'three';

export class Sol extends THREE.Group {
    constructor() {
        super();

        // Matériaux
        const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000 }); // Gris clair
        const tableMaterialmur = new THREE.MeshBasicMaterial({ color:0x00008B }); // Gris clair

        // Création de la table
        const tableTopGeometry = new THREE.BoxGeometry(30, 0.2, 30);
        const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
        tableTop.position.y = 1; // Positionnez le haut de la table à une hauteur appropriée
        this.add(tableTop);
        this.translateY(-1) 
        
        const tableleft = new THREE.Mesh(tableTopGeometry, tableMaterialmur);
        const tablelright = new THREE.Mesh(tableTopGeometry, tableMaterialmur);
       tableleft.rotateX(Math.PI/2)
       tableleft.translateY(15)
       tableleft.translateZ(-15)
       tablelright.rotateZ(Math.PI/2)
       tablelright.translateY(-15) 
       tablelright.translateX(15)
        this.add(tableleft);
       this.add(tablelright);
        
    }
}


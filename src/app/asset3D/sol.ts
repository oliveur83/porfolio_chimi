import * as THREE from 'three';

export class Sol extends THREE.Group {
    constructor() {
        super();
        const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000 }); 
        const tableMaterialmur = new THREE.MeshBasicMaterial({ color:0x00008B }); 
        const tableTopGeometry = new THREE.BoxGeometry(30, 0.2, 30);
        const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
        tableTop.position.y = 1; 
        tableTop.name="toto2"
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
       tableleft.name="toto1"
       tablelright.name="toto3"
        this.add(tableleft);
       this.add(tablelright);
        
    }
}


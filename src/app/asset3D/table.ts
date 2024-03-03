import * as THREE from 'three';

export class Table extends THREE.Group {
  constructor() {
    super();

    // ------------couleur-------------------
    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc }); 
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); 
    //--------------structure-----------------
    const tableTopGeometry = new THREE.BoxGeometry(20, 5, 10);
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.position.y = 2.5; 
    const edges = new THREE.EdgesGeometry(tableTopGeometry);
    const line = new THREE.LineSegments(edges, edgeMaterial);
    this.add(tableTop);
    tableTop.add(line);
    
  }
}

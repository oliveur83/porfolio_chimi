import * as THREE from 'three';

export class Table extends THREE.Group {
    constructor() {
        super();

        // Matériaux
        const tableMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC }); // Gris clair
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Contour noir
        const tableTopGeometry = new THREE.BoxGeometry(20, 5, 10);
        const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
        tableTop.position.y = 2.5; // Positionnez le haut de la table à une hauteur appropriée
        this.add(tableTop);
        const edges = new THREE.EdgesGeometry(tableTopGeometry);
        const line = new THREE.LineSegments(edges, edgeMaterial);
        tableTop.add(line);

    }
}


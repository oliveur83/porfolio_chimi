import * as THREE from 'three';

export class Tube extends THREE.Group {
    constructor() {
        super();

// Matériaux
const glassMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 });
const liquidMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.9 });
const bouchonMaterial = new THREE.MeshBasicMaterial({ color: 0x800000, transparent: true, opacity: 0.7 });

// Création du tube en verre
const tubeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32); // Le diamètre de 1 unité et la hauteur de 2 unités
const tubeMesh = new THREE.Mesh(tubeGeometry, glassMaterial);
tubeMesh.position.set(0, -1, 0);
this.add(tubeMesh);

// Création du liquide dans le tube
const liquidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 2, 32); // Légèrement plus petit que le tube en verre
const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
liquidMesh.position.set(0, -1.1, 0); // Positionnez le liquide au centre du tube
this.add(liquidMesh);

// Ajout des bouchons en haut et en bas du tube
const capGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const topCapMesh = new THREE.Mesh(capGeometry, bouchonMaterial);
topCapMesh.position.set(0, 0.5, 0); // Positionnez le bouchon supérieur
this.add(topCapMesh);
//------------------------------------------------------------


// Matériaux
const glassMaterialgreen = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 });
const liquidMaterialgreen = new THREE.MeshBasicMaterial({ color: 0x0000FF, transparent: true, opacity: 0.9 });
const bouchonMaterialgreen = new THREE.MeshBasicMaterial({ color: 0x800000, transparent: true, opacity: 0.7 });
const tubeGeometrygreen = new THREE.CylinderGeometry(0.5, 0.5, 3, 32); // Le diamètre de 1 unité et la hauteur de 2 unités
const tubeMeshgreen = new THREE.Mesh(tubeGeometrygreen , glassMaterialgreen );
tubeMeshgreen.position.set(0, -1, 2);
this.add(tubeMeshgreen);
const liquidGeometrygreen = new THREE.CylinderGeometry(0.45, 0.45, 2, 32); // Légèrement plus petit que le tube en verre
const liquidMeshgreen = new THREE.Mesh(liquidGeometrygreen , liquidMaterialgreen );
liquidMeshgreen.position.set(0, -1.1, 2); // Positionnez le liquide au centre du tube
this.add(liquidMeshgreen);
const capGeometrygreen = new THREE.SphereGeometry(0.5, 32, 32);
const topCapMeshgreen = new THREE.Mesh(capGeometrygreen , bouchonMaterialgreen );
topCapMeshgreen.position.set(0, 0.5, 2); // Positionnez le bouchon supérieur
this.add(topCapMeshgreen);

//----------------------------------------------------------------
const glassMaterialred = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 });
const liquidMaterialred = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 0.9 });
const bouchonMaterialred = new THREE.MeshBasicMaterial({ color: 0x800000, transparent: true, opacity: 0.7 });
const tubeGeometryred = new THREE.CylinderGeometry(0.5, 0.5, 3, 32); // Le diamètre de 1 unité et la hauteur de 2 unités
const tubeMeshred = new THREE.Mesh(tubeGeometryred, glassMaterialred);
tubeMeshred.position.set(0, -1, -2);
this.add(tubeMeshred);
const liquidGeometryred = new THREE.CylinderGeometry(0.45, 0.45, 2, 32); // Légèrement plus petit que le tube en verre
const liquidMeshred = new THREE.Mesh(liquidGeometryred, liquidMaterialred);
liquidMeshred.position.set(0, -1.1, -2); // Positionnez le liquide au centre du tube
this.add(liquidMeshred);
const capGeometryred = new THREE.SphereGeometry(0.5, 32, 32);
const topCapMeshred = new THREE.Mesh(capGeometryred, bouchonMaterialred);
topCapMeshred.position.set(0, 0.5, -2); // Positionnez le bouchon supérieur
this.add(topCapMeshred);

var rectangleGeometry = new THREE.BoxGeometry(2, 0.1, 10);
var rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x800000 });
var rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
this.add(rectangle);
const baseA = new THREE.CylinderGeometry(0.45, 0.45, 4, 32); // Légèrement plus petit que le tube en verre
const liquidMeshredA = new THREE.Mesh(baseA, rectangleMaterial);
liquidMeshredA.position.set(0, -2, -4); // Positionnez le liquide au centre du tube
this.add(liquidMeshredA);
const baseB = new THREE.CylinderGeometry(0.45, 0.45, 4, 32); // Légèrement plus petit que le tube en verre
const liquidMeshredB = new THREE.Mesh(baseB, rectangleMaterial);
liquidMeshredB.position.set(0, -2, +4); // Positionnez le liquide au centre du tube
this.add(liquidMeshredB);

}
}


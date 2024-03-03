import * as THREE from 'three';

export class Micro extends THREE.Group {
  constructor() {
    super();
    // ---------------couleurs
    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Gris clair
    const pyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Gris clair
    //---------------structure
    const tableTopGeometry = new THREE.BoxGeometry(4, 1, 4);

    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    const pyramidGeometry = new THREE.CylinderGeometry(0, 2, 3, 4, 1, false);
    pyramidGeometry.translate(0, 1.5, 0);
    pyramidGeometry.rotateY(70);
    const pyramid = new THREE.Mesh(pyramidGeometry, pyMaterial);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2, 0);

    const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(-1, 3, 0);
    cylinder.rotateZ(+45);

    // cercle dans le tube
    const cylinderGeometrytu = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
    const cylinderMaterialtu = new THREE.MeshBasicMaterial({ color: 0x000 }); // Vert
    const cylindertu = new THREE.Mesh(cylinderGeometrytu, cylinderMaterialtu);
    cylindertu.position.set(-1.6, 3.5, 0);
    cylindertu.rotateZ(+45);

    this.add(tableTop);
    this.add(pyramid);
    this.add(sphere);
    this.add(cylinder);
    this.add(cylindertu);
    this.translateY(2);
  }
}

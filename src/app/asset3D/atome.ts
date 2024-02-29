import * as THREE from 'three';

export function creerSceneAtome(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const emittingSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const emittingSphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }); // Utilisation de MeshBasicMaterial avec 'emissive' pour la lumière
  const emittingSphereMaterialb = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });

  //function pour crée les electron
  const num_electron = 5;
  const tab_electron: any[] = [];
  for (let i = 0; i < num_electron; i++) {
    const normalSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x0000ff }) // Utilisation de MeshStandardMaterial pour les ombres
    );
    scene.add(normalSphere);
    tab_electron.push(normalSphere);
  }

  //sphere neutron proton
  for (let i = 0; i < 10; i++) {
    const emittingSphere = new THREE.Mesh(
      emittingSphereGeometry,
      emittingSphereMaterial
    );
    const emittingSphereb = new THREE.Mesh(
      emittingSphereGeometry,
      emittingSphereMaterialb
    );
    const x1 = Math.random() * 3;
    const y1 = Math.random() * 3;
    const x2 = Math.random() * 3;
    const y2 = Math.random() * 3;
    const z1 = Math.random() * 3;
    const z2 = Math.random() * 3;
    emittingSphere.position.set(x1 + 1, y1 + 1, z1); // sphère émettant de la lumière
    emittingSphereb.position.set(x2 + 1, y2 + 1, z2);
    scene.add(emittingSphere);
    scene.add(emittingSphereb);
    // Création d'une lumière ponctuelle pour simuler la lumière émise par la sphère
    const emittingSphereLight = new THREE.PointLight(0xffffff, 100, 10); // Couleur, intensité, distance
    emittingSphereLight.position.copy(emittingSphere.position); // Position de la lumière égale à la position de la sphère émettant de la lumière
    scene.add(emittingSphereLight);
    // Configuration des ombres
    emittingSphere.castShadow = true;
  }
  // Création de la trainer
  var particleGeometry = new THREE.BufferGeometry();
  var positions = [];

  for (var i = 0; i < 1000; i++) {
    var x = 0; // Remplacez ces valeurs par les coordonnées initiales souhaitées
    var y = 10;
    var z = 0;
    positions.push(x, y, z);
  }
  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  // Créer le matériau des particules
  var particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });

  var particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  var trailMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 20,
  });

  for (let i = 0; i < num_electron; i++) {
    var trailGeometry = new THREE.BufferGeometry();
    var trailVertices: number[] = [];
    trailVertices.push(0, 0, 0);
    trailGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(trailVertices, 3)
    );
    var trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);
  }

  var trailGeometry = new THREE.BufferGeometry();
  var trailVertices: number[] = [];
  trailVertices.push(0, 0, 0);
  trailGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(trailVertices, 3)
  );

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;
  scene.add(camera);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var trailLine = new THREE.Line(trailGeometry, trailMaterial);
  scene.add(trailLine);

  function animate() {
    requestAnimationFrame(animate);
    var radius = 5;
    for (let i = 0; i < num_electron; i++) {
      // Rayon de l'orbite
      const speed = 1.5;

      const time = performance.now() * 0.001;

      const x = Math.cos(time * speed) * radius;
      const y = Math.sin(time * speed * 2) * radius;
      const z = Math.sin(time * speed) * radius;
      const normalsphere = tab_electron[i];
      normalsphere.position.set(z, y, x);
      radius = radius + 1;
      // Mettre à jour la position de la traînée
      var spherePosition = normalsphere.position.clone(); // Obtenir la position actuelle de la sphère
      trailVertices.push(spherePosition.x, spherePosition.y, spherePosition.z); // Ajouter la nouvelle position à la traînée
      trailGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(trailVertices, 3)
      ); 
      if (trailVertices.length > 300) {
        trailVertices.splice(0, 3); 
        trailGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(trailVertices, 3)
        ); 
      }
    }
  }
  animate();

  // // Configuration des ombres de la lumière ponctuelle
  // emittingSphereLight.castShadow = true;
  // emittingSphereLight.shadow.mapSize.width = 1024;
  // emittingSphereLight.shadow.mapSize.height = 1024;
  // const materialX = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rouge pour l'axe x
  // const materialY = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Vert pour l'axe y
  // const materialZ = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Bleu pour l'axe z
  // const geometryX = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe x
  // const geometryY = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe y
  // const geometryZ = new THREE.CylinderGeometry(0.1, 0.1, 100, 32); // Axe z
  // const axeX = new THREE.Mesh(geometryX, materialX);
  // const axeY = new THREE.Mesh(geometryY, materialY);
  // const axeZ = new THREE.Mesh(geometryZ, materialZ);
  // axeX.rotation.z = Math.PI / 2; // Rotation de 90 degrés autour de l'axe z pour l'axe x
  // axeY.rotation.x = -Math.PI / 2; // Rotation de -90 degrés autour de l'axe x pour l'axe y
  // scene.add(axeX);
  // scene.add(axeY);
  // scene.add(axeZ);
  return scene;
}

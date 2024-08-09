import * as THREE from 'three';

export function creerSceneAtome(): THREE.Scene {
  //création de la scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa86c66);
  // geometrie pour les preton & neutron 
  const sphere_neutron_proton = new THREE.SphereGeometry(1, 32, 32);
  // luminosite emise 
  const light_blue = new THREE.MeshBasicMaterial({
    color: 0xdb321b,
  }); 
  const light_red = new THREE.MeshBasicMaterial({
    color: 0x406aac,
  });
  //function pour crée les electron
  const nbr_electron = 10;
  const tab_electron: any[] = [];
  for (let i = 0; i < nbr_electron; i++) {
    const electron = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x2951ab }) // Utilisation de MeshStandardMaterial pour les ombres
    );
    scene.add(electron);
    tab_electron.push(electron);
  }
const nbr_neutron_proton=10
  //sphere neutron proton
  for (let i = 0; i < nbr_neutron_proton; i++) {
    const sphere_proton = new THREE.Mesh(
      sphere_neutron_proton,
      light_blue
    );
    const sphere_neutron = new THREE.Mesh(
      sphere_neutron_proton,
      light_red
    );
    const x1 = Math.random() * 3;
    const y1 = Math.random() * 3;
    const x2 = Math.random() * 3;
    const y2 = Math.random() * 3;
    const z1 = Math.random() * 3;
    const z2 = Math.random() * 3;
    sphere_proton.position.set(x1 + 1, y1 + 1, z1); 
    sphere_neutron.position.set(x2 + 1, y2 + 1, z2);
    scene.add(sphere_proton);
    scene.add(sphere_neutron);
    // Création d'une lumière ponctuelle pour simuler la lumière émise par la sphère
    const sphere_protonLight = new THREE.PointLight(0x596172, 100, 10); // Couleur, intensité, distance
    sphere_protonLight.position.copy(sphere_proton.position); // Position de la lumière égale à la position de la sphère émettant de la lumière
    scene.add(sphere_protonLight);
    // Configuration des ombres
    sphere_proton.castShadow = true;
  }

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    // deplacement electron 
    var radius = 5;
    for (let i = 0; i < nbr_electron; i++) {
      // Rayon de l'orbite
      const speed = 0.1+0.1*i;

      const time = performance.now() * 0.001;

      const x = Math.cos(time * speed*2) * radius;
      const y = Math.sin(time * speed * 4) * radius;
      const z = Math.sin(time * speed*6) * radius;
      const electron = tab_electron[i];
      electron.position.set(z, y, x);
      radius = radius + 1;
      
    }
  }
  animate();

  return scene;
}

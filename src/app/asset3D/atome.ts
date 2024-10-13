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
  const nbr_neutron_proton = 10;
  //sphere neutron proton
  for (let i = 0; i < nbr_neutron_proton; i++) {
    const sphere_proton = new THREE.Mesh(sphere_neutron_proton, light_blue);
    const sphere_neutron = new THREE.Mesh(sphere_neutron_proton, light_red);
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

    context.font = `${fontSize}px Arial`;
    const lines = text.split('\n');
    const lineHeight = fontSize + 10;

    // Calculer la largeur et la hauteur du texte en fonction des lignes
    const textWidth =
      Math.max(
        ...lines.map((line) => Math.ceil(context.measureText(line).width))
      ) + 20.0;
    const textHeight = lineHeight * lines.length;

    canvas.width = textWidth;
    canvas.height = textHeight;

    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff';

    // Dessiner chaque ligne sur le canvas
    lines.forEach((line, index) => {
      context.fillText(line, textWidth / 2, (index + 0.5) * lineHeight);
    });

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
  const textMesh = createTextMesh(
    'mes compétence en atome \n - Sérieux \n - Connaissances théoriques en chimie \n - Analyse chimique \n - Compétences en laboratoire \n - Méthodes de synthèse \n - Compétences en mathématiques et physique \n - Compétences en résolution de problèmes \n - Informatique et modélisation \n - Communication scientifique \n - Travail en équipe et gestion de projet \n - Sécurité et règlementation',
    100
  );

  textMesh.translateX(-35);

  scene.add(textMesh);
  //  // Fonction pour créer un tube pour chaque axe avec une épaisseur
  //     function createAxisCylinder(start: THREE.Vector3, end: THREE.Vector3, color: number, radius: number) {
  //         const path = new THREE.LineCurve3(start, end); // Définir le chemin entre les points
  //         const tubeGeometry = new THREE.TubeGeometry(path, 20, radius, 8, false); // Créer un tube autour du chemin
  //         const tubeMaterial = new THREE.MeshBasicMaterial({ color: color }); // Matériau coloré
  //         const cylinder = new THREE.Mesh(tubeGeometry, tubeMaterial); // Créer le maillage
  //         return cylinder;
  //     }

  //     // Créer des tubes pour chaque axe
  //     const xAxis = createAxisCylinder(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0), 0xff0000, 0.1); // Rouge pour X
  //     const yAxis = createAxisCylinder(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0), 0x00ff00, 0.1); // Vert pour Y
  //     const zAxis = createAxisCylinder(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 10), 0x0000ff, 0.1); // Bleu pour Z

  //     // Ajouter les cylindres à la scène
  //     scene.add(xAxis);
  //     scene.add(yAxis);
  //     scene.add(zAxis);
  function animate() {
    requestAnimationFrame(animate);
    // deplacement electron
    var radius = 5;
    for (let i = 0; i < nbr_electron; i++) {
      // Rayon de l'orbite
      const speed = 0.1 + 0.1 * i;

      const time = performance.now() * 0.001;

      const x = Math.cos(time * speed * 2) * radius;
      const y = Math.sin(time * speed * 4) * radius;
      const z = Math.sin(time * speed * 6) * radius;
      const electron = tab_electron[i];
      electron.position.set(z, y, x);
      radius = radius + 1;
    }
  }
  animate();

  return scene;
}

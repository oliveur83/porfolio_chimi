import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class logo {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId!: number;

  // Objets pour l'animation
  private rotavapFlask!: THREE.Group;
  private magneticVortex!: THREE.Mesh;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public init(): void {
    // 1. Scène & Caméra (Chaleureuse, low-poly style)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfcf8f2); // Fond crème doux
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 500; // Hauteur par défaut si le CSS charge mal
    // 2. Rendu (WebGLRenderer)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // 1. Un champ de vision réduit (fov) pour zoomer sans déformer
    this.camera = new THREE.PerspectiveCamera(
      25, // Un fov petit (ex: 25 au lieu de 50/75) donne cet effet "isometric/macro" avec du relief
      width / height,
      0.1,
      1000
    );
    this.camera.position.set(17, 7, 10);

    // 2. Initialisation des OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

    // 3. Définir le point visé par le contrôleur (vers le mur du fond)
    this.controls.target.set(0, 3.5, -2);
    this.controls.update(); //

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Éclairage (Chaleureux et contrasté pour le verre)
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(12, 18, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // 5. Construction de TOUT le laboratoire
    this.createLaboratory();

    window.addEventListener('resize', this.onWindowResize);
    this.animate();
  }

  private createLaboratory(): void {
    // Sol de laboratoire (Teinte pastel orange/pêche)
    const floorGeo = new THREE.BoxGeometry(14, 0.2, 14);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0xffdfd3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Murs d'angle (Gris bleu apaisant)
    const wallMat = new THREE.MeshPhongMaterial({ color: 0x9fbcd3 });

    // Mur du fond
    const wallBack = new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 0.4),
      wallMat
    );
    wallBack.position.set(0, 5, -7);
    wallBack.receiveShadow = true;
    this.scene.add(wallBack);

    // Mur de gauche
    const wallLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 10, 14),
      wallMat
    );
    wallLeft.position.set(-7, 5, 0);
    wallLeft.receiveShadow = true;
    this.scene.add(wallLeft);

    // --- TOUS LES POSTERS & TABLEAUX MURAUX ---
    this.createPeriodicTable(); // Sur le mur de gauche
    this.createSafetyPoster(); // Sur le mur de gauche, côté porte
    this.createCalculationBoard(); // Sur le mur du fond
    this.createMolecularDrawings(); // Sur le mur du fond, style graffiti chimique

    // --- LA PAILLASSE (Workbench) ---
    const tableGroup = new THREE.Group();

    // Plateau principal (blanc épais, low-poly)
    const boardGeo = new THREE.BoxGeometry(8, 0.25, 3.2);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xf5f6fa,
      roughness: 0.3,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 1.7; // Hauteur de paillasse
    board.castShadow = true;
    board.receiveShadow = true;
    tableGroup.add(board);

    // Dosseret arrière de protection
    const splashBoard = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.6, 0.15),
      boardMat
    );
    splashBoard.position.set(0, 2.0, -1.45);
    splashBoard.castShadow = true;
    tableGroup.add(splashBoard);

    // Étagère surélevée en bois low-poly pour les réactifs
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0xcd853f,
      roughness: 0.8,
    }); // Bois chaud
    const shelfGeo = new THREE.BoxGeometry(7, 0.1, 0.8);
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 2.3, -1.2);
    shelf.castShadow = true;
    tableGroup.add(shelf);

    // Pieds de la paillasse (Métal gris brillant)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.7);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x7f8c8d,
      metalness: 0.8,
      roughness: 0.2,
    });
    const legPositions = [
      [-3.6, 0.85, -1.3],
      [3.6, 0.85, -1.3],
      [-3.6, 0.85, 1.3],
      [3.6, 0.85, 1.3],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });
    tableGroup.position.set(0, 0.1, -0.6);
    this.scene.add(tableGroup);

    // --- LA CHIMISTE STYLE AVATAR ---
    this.createChemistCharacter();

    // --- TOUS LES ACCESSOIRES SCIENTIFIQUES AVANCÉS & VERRERIE ---
    // Matériau de verre standard (Low-poly jaugé)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35, // Plus opaque pour le low-poly
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });

    // Matériaux de liquides colorés
    const liqGreen = new THREE.MeshPhongMaterial({
      color: 0x2be4a0,
      shininess: 100,
    });
    const liqPink = new THREE.MeshPhongMaterial({
      color: 0xff5c8a,
      shininess: 100,
    });
    const liqBlue = new THREE.MeshPhongMaterial({
      color: 0x24a0ff,
      shininess: 100,
    });
    const liqAmber = new THREE.MeshPhongMaterial({
      color: 0xffaa00,
      shininess: 100,
    });

    // --- TOUS LES ACCESSOIRES SCIENTIFIQUES REPOSITIONNÉS SUR LA TABLE ---
    // (Hauteur Y ajustée à 1.93 pour qu'ils ne s'enfoncent plus dans le plateau)

    // 1. LE SUPER MICROSCOPE
    const superMicroscope = this.createSuperMicroscope();
    superMicroscope.position.set(-0.3, 1.93, -0.6);
    this.scene.add(superMicroscope);

    // 2. RACK DE TUBES À ESSAI
    const testTubeRack = this.createTestTubeRack(
      glassMat,
      liqBlue,
      liqAmber,
      liqGreen
    );
    testTubeRack.position.set(2.4, 1.93, -0.3);
    this.scene.add(testTubeRack);

    // 3. BRÛLEUR BUNSEN ET SON BECHER CHAUD
    const bunsenBurner = this.createBunsenBurner();
    bunsenBurner.position.set(-2.0, 1.93, -0.4);
    this.scene.add(bunsenBurner);

    // 4. L'ÉVAPORATEUR ROTATIF ("Rotavap")
    const rotavap = this.createRotaryEvaporator(glassMat);
    rotavap.position.set(0.6, 1.93, -1.1);
    this.scene.add(rotavap);

    // 5. AGITATEUR MAGNÉTIQUE CHAUFFANT
    const magStirrer = this.createMagneticStirrer(glassMat, liqPink);
    magStirrer.position.set(1.4, 1.93, -0.3);
    this.scene.add(magStirrer);

    // 6. BALANCE DE PRÉCISION (Vitrée)
    const balance = this.createPrecisionBalance(glassMat);
    balance.position.set(-1.0, 1.93, -0.3);
    this.scene.add(balance);

    // 7. ZONE INFORMATIQUE ET CARNET DE LABO
    const laptop = this.createLaptop();
    laptop.position.set(-2.8, 1.93, -0.3);
    this.scene.add(laptop);

    // Carnet de labo ouvert posé sur la table
    const notebookGeo = new THREE.BoxGeometry(0.6, 0.05, 0.45);
    const notebookMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const notebook = new THREE.Mesh(notebookGeo, notebookMat);
    notebook.position.set(-2.3, 1.95, 0.1); // Légèrement plus haut (1.95) pour l'épaisseur
    notebook.rotation.y = 0.3;
    notebook.castShadow = true;
    this.scene.add(notebook);

    // 8. VERRERIE DE STOCKAGE SUR L'ÉTAGÈRE DU HAUT
    this.createStorageGlassware(glassMat, liqGreen, liqPink, liqBlue, liqAmber);
  }

  // --- MÉTHODES PRIVÉES DE CONSTRUCTION DÉTAILLÉE ---

  // Crée un grand tableau périodique mural stylisé
  private createPeriodicTable(): void {
    const tableGroup = new THREE.Group();
    const cols = 10;
    const rows = 5;
    const cellSize = 0.5;
    const gap = 0.09;
    const colors = [0xff7675, 0x74b9ff, 0x55efc4, 0xffeaa7, 0xa29bfe];

    // Fond du tableau noir low-poly
    const boardBg = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 3.4, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x2d3436 })
    );
    boardBg.position.set(0, 0, 0.05);
    boardBg.castShadow = true;
    tableGroup.add(boardBg);

    // Cellules colorées stylisées
    for (let r = 0; r < rows; r++) {
      for (
        let c = 0;
        c < cols;
        r === 0 && c > 0 && c < cols - 1 ? (c = cols - 1) : c++
      ) {
        const color = colors[(r + c) % colors.length];
        const cellGeo = new THREE.BoxGeometry(cellSize, cellSize, 0.05);
        const cellMat = new THREE.MeshPhongMaterial({ color: color });
        const cell = new THREE.Mesh(cellGeo, cellMat);

        const posX = (c - (cols - 1) / 2) * (cellSize + gap);
        const posY = (rows - 1 - r - (rows - 1) / 2) * (cellSize + gap);

        cell.position.set(posX, posY, 0.12);
        tableGroup.add(cell);
      }
    }

    // Positionnement sur le mur de gauche
    tableGroup.rotation.y = Math.PI / 2;
    tableGroup.position.set(-6.75, 5.5, -2.8);
    this.scene.add(tableGroup);
  }

  // Affiche de sécurité avec pictogrammes et consignes
  private createSafetyPoster(): void {
    const poster = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMatRed = new THREE.MeshBasicMaterial({ color: 0xff4757 });
    const textMatBlack = new THREE.MeshBasicMaterial({ color: 0x111111 });

    // Tableau blanc
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.5, 1.8),
      baseMat
    );
    poster.add(board);

    // Titre "SÉCURITÉ"
    const title = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.2, 0.8),
      textMatRed
    );
    title.position.set(0.02, 0.9, 0);
    poster.add(title);

    // Pictogrammes stylisés (simples formes géométriques colorées)
    const dangerGeo = new THREE.OctahedronGeometry(0.15); // Pictogramme danger
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const acidMat = new THREE.MeshBasicMaterial({ color: 0x22c1c3 });

    const pictflame = new THREE.Mesh(dangerGeo, flameMat);
    pictflame.position.set(0.04, 0.3, -0.4);
    poster.add(pictflame);

    const pictAcid = new THREE.Mesh(dangerGeo, acidMat);
    pictAcid.position.set(0.04, 0.3, 0.4);
    poster.add(pictAcid);

    // Rappel "LUNETTES"
    const safetyGogglesGeo = new THREE.BoxGeometry(0.14, 0.08, 0.45);
    const safetyGogglesMat = new THREE.MeshPhongMaterial({
      color: 0x00d2d3,
      transparent: true,
      opacity: 0.4,
    });
    const warningText = new THREE.Mesh(safetyGogglesGeo, safetyGogglesMat);
    warningText.position.set(0.03, -0.7, 0);
    poster.add(warningText);

    poster.position.set(-6.75, 5.5, 2.0); // Sur le mur de gauche, près de l'entrée
    this.scene.add(poster);
  }

  private createCalculationBoard(): void {
    const boardGroup = new THREE.Group();

    // Cadre en aluminium brillant
    const frameGeo = new THREE.BoxGeometry(4.5, 3.5, 0.12);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x7f8c8d,
      metalness: 0.9,
      roughness: 0.1,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    boardGroup.add(frame);

    // Surface du tableau blanc
    const surfaceGeo = new THREE.BoxGeometry(4.3, 3.3, 0.08);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
    });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.position.set(0, 0, 0.03);
    boardGroup.add(surface);

    // Feutres de couleurs pour les schémas
    const blackInk = new THREE.MeshBasicMaterial({ color: 0x1e272e });
    const blueInk = new THREE.MeshBasicMaterial({ color: 0x0984e3 });
    const redInk = new THREE.MeshBasicMaterial({ color: 0xd63031 });

    // Dessin 1 : Un cycle benzénique dessiné au feutre noir
    const drawGroup = new THREE.Group();

    // Création d'un hexagone de traits noirs
    const segments = 6;
    const radius = 0.5;
    for (let i = 0; i < segments; i++) {
      const angle1 = (i * Math.PI * 2) / segments;
      const angle2 = ((i + 1) * Math.PI * 2) / segments;

      const p1 = new THREE.Vector3(
        Math.cos(angle1) * radius,
        Math.sin(angle1) * radius,
        0
      );
      const p2 = new THREE.Vector3(
        Math.cos(angle2) * radius,
        Math.sin(angle2) * radius,
        0
      );

      const dist = p1.distanceTo(p2);
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(dist, 0.025, 0.01),
        blackInk
      );

      // Positionner au milieu du segment et tourner
      line.position.copy(p1).add(p2).multiplyScalar(0.5);
      line.rotation.z = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      line.position.z = 0.071; // Légèrement devant le tableau
      drawGroup.add(line);
    }

    // Double liaison dessinée en rouge à l'intérieur du cycle
    const doubleLink = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.02, 0.01),
      redInk
    );
    doubleLink.position.set(0.1, 0.2, 0.072);
    doubleLink.rotation.z = Math.PI / 6;
    drawGroup.add(doubleLink);

    // Équation ou annotation écrite en bleu à côté
    const eqLine1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.02, 0.01),
      blueInk
    );
    eqLine1.position.set(0.8, 0.1, 0.071);
    const eqLine2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.02, 0.01),
      blueInk
    );
    eqLine2.position.set(0.7, -0.1, 0.071);
    drawGroup.add(eqLine1, eqLine2);

    // Positionner les dessins sur la moitié gauche du tableau
    drawGroup.position.set(-1.0, 0.2, 0);
    boardGroup.add(drawGroup);

    // Dessin 2 : Une formule linéaire (graphe) sur la partie droite
    const formulaGroup = new THREE.Group();
    const fLine1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.025, 0.01),
      blackInk
    );
    fLine1.position.set(0, 0, 0.071);
    fLine1.rotation.z = 0.5;

    const fLine2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.025, 0.01),
      blackInk
    );
    fLine2.position.set(0.48, 0.14, 0.071);
    fLine2.rotation.z = -0.5;

    const oxygenOH = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.08, 0.01),
      redInk
    ); // Représente un "O" ou "OH" rouge
    oxygenOH.position.set(0.85, 0.0, 0.071);

    formulaGroup.add(fLine1, fLine2, oxygenOH);
    formulaGroup.position.set(1.0, -0.3, 0);
    boardGroup.add(formulaGroup);

    // Positionnement final sur le mur du fond
    boardGroup.position.set(-2.8, 5.5, -6.75);
    this.scene.add(boardGroup);
  }

  private createMolecularDrawings(): void {
    const posterGroup = new THREE.Group();

    // 1. Le cadre du poster en bois
    const frameGeo = new THREE.BoxGeometry(0.1, 2.8, 2.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.7,
    }); // Bois sombre
    const frame = new THREE.Mesh(frameGeo, frameMat);
    posterGroup.add(frame);

    // 2. Le fond du poster (papier un peu jauni rétro)
    const paperGeo = new THREE.BoxGeometry(0.12, 2.6, 2.0);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd6,
      roughness: 0.9,
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.position.x = 0.01;
    posterGroup.add(paper);

    // 3. La structure moléculaire en relief (modèle ball-and-stick)
    const molecule = new THREE.Group();
    const atomBlack = new THREE.MeshPhongMaterial({ color: 0x2c3e50 }); // Carbone
    const atomRed = new THREE.MeshPhongMaterial({ color: 0xff4757 }); // Oxygène
    const atomWhite = new THREE.MeshPhongMaterial({ color: 0xffffff }); // Hydrogène
    const stickMat = new THREE.MeshStandardMaterial({
      color: 0xbdc3c7,
      roughness: 0.5,
    }); // Liaisons

    // Helper pour ajouter un atome
    const addAtom = (
      x: number,
      y: number,
      z: number,
      r: number,
      mat: THREE.Material
    ) => {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
      atom.position.set(x, y, z);
      atom.castShadow = true;
      molecule.add(atom);
    };

    // Helper pour ajouter une liaison (cylindre) entre deux points
    const addStick = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const distance = p1.distanceTo(p2);
      const stickGeo = new THREE.CylinderGeometry(0.025, 0.025, distance, 8);
      const stick = new THREE.Mesh(stickGeo, stickMat);

      // Positionner et orienter le cylindre
      const position = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5);
      stick.position.copy(position);

      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      stick.quaternion.setFromUnitVectors(up, direction);

      stick.castShadow = true;
      molecule.add(stick);
    };

    // Définir les positions des atomes par rapport au centre du poster
    const p1 = new THREE.Vector3(0.08, 0.5, -0.4);
    const p2 = new THREE.Vector3(0.08, 0.5, 0.4);
    const p3 = new THREE.Vector3(0.08, -0.2, 0.6);
    const p4 = new THREE.Vector3(0.08, -0.7, 0.0);
    const p5 = new THREE.Vector3(0.08, -0.2, -0.6);
    const p6 = new THREE.Vector3(0.08, 0.9, 0.0); // Atome du haut

    // Dessiner les atomes
    addAtom(p1.x, p1.y, p1.z, 0.12, atomBlack);
    addAtom(p2.x, p2.y, p2.z, 0.12, atomBlack);
    addAtom(p3.x, p3.y, p3.z, 0.1, atomRed);
    addAtom(p4.x, p4.y, p4.z, 0.12, atomBlack);
    addAtom(p5.x, p5.y, p5.z, 0.1, atomRed);
    addAtom(p6.x, p6.y, p6.z, 0.08, atomWhite);

    // Dessiner les liaisons (le squelette)
    addStick(p1, p2);
    addStick(p2, p3);
    addStick(p3, p4);
    addStick(p4, p5);
    addStick(p5, p1);
    addStick(p1, p6);

    posterGroup.add(molecule);

    // Positionnement sur le mur de droite (pour remplacer les anciens cercles)
    posterGroup.rotation.y = -Math.PI / 2; // Face au mur de droite
    posterGroup.position.set(6, 5.5, -6.5);
    this.scene.add(posterGroup);
  }

  // Microscope haut de gamme
  private createSuperMicroscope(): THREE.Group {
    const micro = new THREE.Group();
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e272e,
      roughness: 0.5,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      metalness: 0.8,
      roughness: 0.2,
    });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3 }); // LED de rétroéclairage

    // Base
    const baseGeo = new THREE.BoxGeometry(0.8, 0.12, 1.0);
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.castShadow = true;
    micro.add(base);

    // Source de lumière (LED sur la base)
    const led = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.02),
      lightMat
    );
    led.position.set(0, 0.07, 0.15);
    micro.add(led);

    // Potence (Le bras incurvé en métal)
    const armGeo = new THREE.BoxGeometry(0.18, 1.1, 0.3);
    const arm = new THREE.Mesh(armGeo, darkMat);
    arm.position.set(0, 0.55, -0.3);
    arm.rotation.x = -0.15;
    arm.castShadow = true;
    micro.add(arm);

    // Platine porte-échantillon
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.05, 0.65),
      darkMat
    );
    stage.position.set(0, 0.45, 0.1);
    stage.castShadow = true;
    micro.add(stage);

    // Objectif rotatif (Tourelle à 3 objectifs)
    const turretGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const turret = new THREE.Mesh(turretGeo, metalMat);
    turret.position.set(0, 0.72, 0.15);
    micro.add(turret);

    const objGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.15);
    const obj1 = new THREE.Mesh(objGeo, darkMat);
    obj1.position.set(0.08, 0.62, 0.15);
    obj1.rotation.z = -0.2;
    const obj2 = new THREE.Mesh(objGeo, darkMat);
    obj2.position.set(-0.08, 0.62, 0.15);
    obj2.rotation.z = 0.2;
    micro.add(obj1, obj2);

    // Tube optique et oculaire incliné
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.5),
      metalMat
    );
    tube.position.set(0, 0.95, -0.05);
    tube.rotation.x = 0.45;
    micro.add(tube);

    const eyepiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.15),
      darkMat
    );
    eyepiece.position.set(0, 1.18, -0.15);
    eyepiece.rotation.x = 0.45;
    micro.add(eyepiece);

    // Molettes de mise au point (Vis macrométrique)
    const knobGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08);
    knobGeo.rotateZ(Math.PI / 2);
    const knobL = new THREE.Mesh(knobGeo, metalMat);
    knobL.position.set(-0.13, 0.6, -0.3);
    const knobR = new THREE.Mesh(knobGeo, metalMat);
    knobR.position.set(0.13, 0.6, -0.3);
    micro.add(knobL, knobR);

    return micro;
  }

  // Rack en bois avec 3 tubes à essai jaugés
  private createTestTubeRack(
    glassMat: THREE.Material,
    liqB: THREE.Material,
    liqA: THREE.Material,
    liqG: THREE.Material
  ): THREE.Group {
    const rack = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xcd853f,
      roughness: 0.8,
    }); // Bois chaud

    // Structure du support low-poly
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.5), woodMat);
    base.position.y = 0.04;
    const topPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.06, 0.5),
      woodMat
    );
    topPlate.position.y = 0.65;
    const pillarL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.65, 0.4),
      woodMat
    );
    pillarL.position.set(-0.7, 0.325, 0);
    const pillarR = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.65, 0.4),
      woodMat
    );
    pillarR.position.set(0.7, 0.325, 0);
    rack.add(base, topPlate, pillarL, pillarR);

    // Tubes à essai (Style Low-poly jaugé)
    const tubeGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.7, 12);
    const tubeBottomGeo = new THREE.SphereGeometry(0.09, 12, 12);

    const tubesMaterials = [liqB, liqA, liqG];
    const liquidsHeights = [0.4, 0.55, 0.3];

    for (let i = 0; i < 3; i++) {
      const tubeGroup = new THREE.Group();

      // Verre du tube
      const glassBody = new THREE.Mesh(tubeGeo, glassMat);
      const glassBottom = new THREE.Mesh(tubeBottomGeo, glassMat);
      glassBottom.position.y = -0.35;
      tubeGroup.add(glassBody, glassBottom);

      // Liquide coloré à l'intérieur
      const liqMat = tubesMaterials[i];
      const liqHeight = liquidsHeights[i];
      const liquidGeo = new THREE.CylinderGeometry(0.08, 0.08, liqHeight, 12);
      const liquid = new THREE.Mesh(liquidGeo, liqMat);
      liquid.position.y = -0.35 + liqHeight / 2;

      const liquidBottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        liqMat
      );
      liquidBottom.position.y = -0.35;

      tubeGroup.add(liquid, liquidBottom);

      // Positionnement dans le rack
      tubeGroup.position.set(-0.4 + i * 0.4, 0.38, 0);
      rack.add(tubeGroup);
    }

    return rack;
  }

  // Brûleur Bunsen et son bécher chaud
  private createBunsenBurner(): THREE.Group {
    const burnerGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      metalness: 0.8,
      roughness: 0.2,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd2ab62,
      metalness: 0.9,
      roughness: 0.35,
    });

    // Socle low-poly
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.3, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x2f3640 })
    );
    base.position.y = 0.04;
    burnerGroup.add(base);

    // Tube vertical
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.7),
      metalMat
    );
    tube.position.y = 0.45;
    burnerGroup.add(tube);

    // Flamme low-poly glowing (2 cônes)
    const flameMat1 = new THREE.MeshBasicMaterial({
      color: 0x00a8ff,
      transparent: true,
      opacity: 0.6,
    });
    const flameMat2 = new THREE.MeshBasicMaterial({
      color: 0xeccc68,
      transparent: true,
      opacity: 0.8,
    });

    const flame1 = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.25, 12),
      flameMat1
    );
    flame1.position.y = 0.9;
    const flame2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.14, 12),
      flameMat2
    );
    flame2.position.y = 0.85;
    burnerGroup.add(flame1, flame2);

    // Bécher chaud posé à côté (Style low-poly)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
      metalness: 0.1,
    });
    const liqAmber = new THREE.MeshPhongMaterial({
      color: 0xffaa00,
      shininess: 100,
    });

    const becherGroup = new THREE.Group();
    const bodyBecher = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.6, 16),
      glassMat
    );
    const liqBecher = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.42, 16),
      liqAmber
    );
    liqBecher.position.y = -0.09;

    becherGroup.add(bodyBecher, liqBecher);
    becherGroup.position.set(0.6, 0.3, 0);
    burnerGroup.add(becherGroup);

    return burnerGroup;
  }

  // Évaporateur Rotatif ("Rotavap") détaillé
  private createRotaryEvaporator(glassMat: THREE.Material): THREE.Group {
    const rotavap = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x7f8c8d,
      metalness: 0.8,
    });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    const liquidMatBlue = new THREE.MeshPhongMaterial({ color: 0x24a0ff });

    // Bain-marie (Socle chauffant glowing rouge low-poly)
    const bathBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16),
      baseMat
    );
    const bathWaterMat = new THREE.MeshBasicMaterial({
      color: 0xff4757,
      transparent: true,
      opacity: 0.7,
    });
    const bathWater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.15, 16),
      bathWaterMat
    );
    bathWater.position.y = 0.1;
    rotavap.add(bathBase, bathWater);

    // Potence et mécanisme low-poly
    const potentGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const potent = new THREE.Mesh(potentGeo, metalMat);
    potent.position.set(-0.6, 0.6, 0);
    rotavap.add(potent);

    // Moteur low-poly oblique
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.4),
      baseMat
    );
    motor.position.set(-0.35, 0.9, 0.2);
    motor.rotation.x = -0.6; // Inclinaison oblique
    rotavap.add(motor);

    // --- PARTIE EN ROTATION (Ballon et tube optique) ---
    this.rotavapFlask = new THREE.Group();

    // Tube de liaison oblique
    const optTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.6),
      glassMat
    );
    optTube.rotation.x = -0.6;
    optTube.position.set(0, -0.3, 0);
    this.rotavapFlask.add(optTube);

    // Ballon à fond rond low-poly (partiellement immergé)
    const flask = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      glassMat
    );
    flask.position.set(0, -0.6, 0);
    this.rotavapFlask.add(flask);

    const liqFlask = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      liquidMatBlue
    );
    liqFlask.position.set(0, -0.62, 0);
    this.rotavapFlask.add(liqFlask);

    this.rotavapFlask.position.set(-0.35, 0.9, 0.2); // Ancré au moteur
    rotavap.add(this.rotavapFlask);

    // Serpentin de condensation low-poly (sur l'étagère derrière)
    const condenseurGroup = new THREE.Group();
    const condenserColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1.1),
      glassMat
    );
    condenseurGroup.add(condenserColumn);

    const coiledTubeMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.015, 8, 30, Math.PI * 6),
      coiledTubeMat
    );
    coil.rotation.x = Math.PI / 2;
    coil.position.y = -0.3;
    condenseurGroup.add(coil);

    condenseurGroup.position.set(0.2, 0.8, -0.1); // Sur l'étagère bois low-poly
    rotavap.add(condenseurGroup);

    return rotavap;
  }

  // Agitateur Magnétique Chauffant avec vortex interactif
  private createMagneticStirrer(
    glassMat: THREE.Material,
    liqPink: THREE.Material
  ): THREE.Group {
    const stirrer = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      roughness: 0.4,
    });
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.7,
    });
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });

    // Socle low-poly jaugé
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.9), baseMat);
    stirrer.add(base);

    // Plaque chauffante low-poly noire
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.03, 0.7),
      plateMat
    );
    plate.position.y = 0.09;
    stirrer.add(plate);

    // Boutons rotatifs low-poly (x2)
    const knobGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12);
    const knobHeat = new THREE.Mesh(knobGeo, knobMat);
    knobHeat.position.set(-0.25, 0, 0.4);
    const knobStir = new THREE.Mesh(knobGeo, knobMat);
    knobStir.position.set(0.25, 0, 0.4);
    stirrer.add(knobHeat, knobStir);

    // --- LE BÉCHER AVEC VORTEX ---
    const vortexGroup = new THREE.Group();
    // Verre bécher low-poly
    const glassBecher = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.6, 16),
      glassMat
    );

    // Vortex liquide (TubeGeo déformé et en rotation)
    const points = [];
    for (let i = 0; i < 12; i++) {
      points.push(
        new THREE.Vector3(Math.cos(i) * 0.18, i * 0.04, Math.sin(i) * 0.18)
      );
    }
    const vortexCurve = new THREE.CatmullRomCurve3(points);
    this.magneticVortex = new THREE.Mesh(
      new THREE.TubeGeometry(vortexCurve, 30, 0.06, 8, false),
      liqPink
    );

    // Barreau aimanté (petite box Geo au fond)
    const magBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.03, 0.03),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    magBar.position.y = -0.28;

    vortexGroup.add(glassBecher, this.magneticVortex, magBar);
    vortexGroup.position.y = 0.4;
    stirrer.add(vortexGroup);

    return stirrer;
  }

  // Balance Analytique de Précision vitrée
  private createPrecisionBalance(glassMat: THREE.Material): THREE.Group {
    const balance = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      metalness: 0.8,
    });

    // Socle Balance low-poly
    const baseBalance = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.18, 1.0),
      baseMat
    );
    balance.add(baseBalance);

    // Plateau de pesée low-poly métal
    const pan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.03),
      metalMat
    );
    pan.position.y = 0.11;
    balance.add(pan);

    // Cage vitrée low-poly fermée
    const cageGeo = new THREE.BoxGeometry(0.86, 0.6, 0.96);
    const cage = new THREE.Mesh(cageGeo, glassMat);
    cage.position.y = 0.42;
    balance.add(cage);

    // Cadre alu de la cage
    const cageFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.65, 1.0),
      metalMat
    );

    return balance;
  }

  // Ordinateur portable avec graphiques
  private createLaptop(): THREE.Group {
    const laptop = new THREE.Group();
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x3d3d3d,
      roughness: 0.5,
    }); // Gris sombre
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x1e272e }); // Noir allumé

    // Base clavier low-poly
    const keyboardBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.04, 0.65),
      casingMat
    );
    keyboardBase.castShadow = true;
    laptop.add(keyboardBase);

    // Écran low-poly allumé
    const screen = new THREE.Group();
    const screenFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.6, 0.03),
      casingMat
    );
    const screenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.52),
      screenMat
    );
    screenDisplay.position.set(0, 0, 0.017);
    screen.add(screenFrame, screenDisplay);

    // Simulation graphiques (pics de chromatographie low-poly boxes)
    const graphMatRed = new THREE.MeshBasicMaterial({ color: 0xff4757 });
    const graphMatBlue = new THREE.MeshBasicMaterial({ color: 0x24a0ff });

    const graphPic1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.3, 0.01),
      graphMatRed
    );
    graphPic1.position.set(-0.25, -0.05, 0.02);
    const graphPic2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.45, 0.01),
      graphMatBlue
    );
    graphPic2.position.set(0.1, 0, 0.02);
    screen.add(graphPic1, graphPic2);

    screen.position.set(0, 0.3, -0.32);
    screen.rotation.x = 0.2; // Angle écran ouvert
    laptop.add(screen);

    return laptop;
  }

  // Verrerie de stockage diverse sur l'étagère bois low-poly
  private createStorageGlassware(
    glassMat: THREE.Material,
    liqG: THREE.Material,
    liqP: THREE.Material,
    liqB: THREE.Material,
    liqA: THREE.Material
  ): void {
    const glasswareGroup = new THREE.Group();
    const ballFlaskGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const flaskNeckGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16);

    const materials = [liqG, liqP, liqB, liqA];

    // Alignement de 4 ballons sur l'étagère bois low-poly
    for (let i = 0; i < 4; i++) {
      const flaskGroup = new THREE.Group();

      const glassBody = new THREE.Mesh(ballFlaskGeo, glassMat);
      const glassNeck = new THREE.Mesh(flaskNeckGeo, glassMat);
      glassNeck.position.y = 0.3;
      flaskGroup.add(glassBody, glassNeck);

      // Liquide coloré
      const liqMat = materials[i % materials.length];
      const liquidBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.23, 16, 16),
        liqMat
      );
      liquidBody.position.y = -0.02;
      flaskGroup.add(liquidBody);

      flaskGroup.position.set(-1.8 + i * 1.2, 0.3, 0);
      glasswareGroup.add(flaskGroup);
    }

    // Ajout d'une éprouvette graduée stylisée
    const cylinderGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 12);
    const cylinder = new THREE.Mesh(cylinderGeo, glassMat);
    const liqCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.6, 12),
      liqG
    );
    liqCylinder.position.y = -0.15;
    cylinder.add(liqCylinder);
    cylinder.position.set(3.0, 0.5, 0);
    glasswareGroup.add(cylinder);

    glasswareGroup.position.set(0, 2.3, -1.8); // Posé sur l'étagère bois low-poly
    this.scene.add(glasswareGroup);
  }

  // La Chimiste (Même code, repositionnée)
  private createChemistCharacter(): void {
    const chemist = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdbac,
      roughness: 0.6,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.8,
    });
    const coatMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.7,
    });

    // 1. JAMBES ET CHAUSSURES
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 12);
    const shoeGeo = new THREE.BoxGeometry(0.3, 0.2, 0.45);
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });

    const leftLeg = new THREE.Mesh(legGeo, darkMat);
    leftLeg.position.set(-0.35, 0.6, 0);
    leftLeg.castShadow = true;
    chemist.add(leftLeg);

    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.35, 0.1, 0.1);
    leftShoe.castShadow = true;
    chemist.add(leftShoe);

    const rightLeg = new THREE.Mesh(legGeo, darkMat);
    rightLeg.position.set(0.35, 0.6, 0);
    rightLeg.castShadow = true;
    chemist.add(rightLeg);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.35, 0.1, 0.1);
    rightShoe.castShadow = true;
    chemist.add(rightShoe);

    // 2. CORPS / BLOUSE
    const coatGeo = new THREE.CylinderGeometry(0.55, 0.75, 1.8, 12);
    const coat = new THREE.Mesh(coatGeo, coatMat);
    coat.position.y = 1.9;
    coat.castShadow = true;
    chemist.add(coat);

    const collarGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
    const collarMat = new THREE.MeshPhongMaterial({ color: 0xff4757 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 2.55, 0.42);
    collar.rotation.x = 0.2;
    chemist.add(collar);

    // 3. TÊTE
    const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 3.35;
    head.castShadow = true;
    chemist.add(head);

    const earGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.72, 3.35, 0);
    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(0.72, 3.35, 0);
    chemist.add(leftEar, rightEar);

    // SOURCILS
    const browGeo = new THREE.BoxGeometry(0.14, 0.03, 0.02);
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.position.set(-0.2, 3.55, 0.62);
    leftBrow.rotation.z = 0.1;
    leftBrow.rotation.y = 0.1;
    chemist.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.position.set(0.2, 3.55, 0.62);
    rightBrow.rotation.z = -0.1;
    rightBrow.rotation.y = -0.1;
    chemist.add(rightBrow);

    // YEUX STYLE CARTOON AVEC REFLETS
    const eyeGroupLeft = new THREE.Group();
    const eyeGroupRight = new THREE.Group();

    const eyeballGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 24);
    eyeballGeo.rotateX(Math.PI / 2);
    const eyeballMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
    });

    const leftPupil = new THREE.Mesh(eyeballGeo, eyeballMat);
    const rightPupil = new THREE.Mesh(eyeballGeo, eyeballMat);

    const sparkGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const spark1L = new THREE.Mesh(sparkGeo, sparkMat);
    spark1L.position.set(0.03, 0.03, 0.015);
    const spark2L = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 8, 8),
      sparkMat
    );
    spark2L.position.set(-0.03, -0.03, 0.015);
    eyeGroupLeft.add(leftPupil, spark1L, spark2L);

    const spark1R = new THREE.Mesh(sparkGeo, sparkMat);
    spark1R.position.set(0.03, 0.03, 0.015);
    const spark2R = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 8, 8),
      sparkMat
    );
    spark2R.position.set(-0.03, -0.03, 0.015);
    eyeGroupRight.add(rightPupil, spark1R, spark2R);

    eyeGroupLeft.position.set(-0.2, 3.38, 0.63);
    eyeGroupLeft.rotation.y = 0.15;
    chemist.add(eyeGroupLeft);

    eyeGroupRight.position.set(0.2, 3.38, 0.63);
    eyeGroupRight.rotation.y = -0.15;
    chemist.add(eyeGroupRight);

    // Joues roses
    const blushGeo = new THREE.PlaneGeometry(0.14, 0.07);
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xffa0a0,
      transparent: true,
      opacity: 0.5,
    });

    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.35, 3.22, 0.58);
    leftBlush.rotation.y = 0.3;
    chemist.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.35, 3.22, 0.58);
    rightBlush.rotation.y = -0.3;
    chemist.add(rightBlush);

    // Lunettes de protection
    const glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e272e,
      roughness: 0.4,
    });
    const lensMat = new THREE.MeshPhongMaterial({
      color: 0x00d2d3,
      transparent: true,
      opacity: 0.45,
      shininess: 120,
    });

    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.07, 0.06),
      frameMat
    );
    bar.position.set(0, 3.42, 0.69);
    glassesGroup.add(bar);

    const lensGeo = new THREE.BoxGeometry(0.3, 0.24, 0.04);

    const leftLens = new THREE.Mesh(lensGeo, lensMat);
    leftLens.position.set(-0.2, 3.36, 0.7);
    glassesGroup.add(leftLens);

    const rightLens = new THREE.Mesh(lensGeo, lensMat);
    rightLens.position.set(0.2, 3.36, 0.7);
    glassesGroup.add(rightLens);

    chemist.add(glassesGroup);

    // 4. CHEVELURE
    const hairGroup = new THREE.Group();

    const mainHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.74, 20, 20),
      hairMat
    );
    mainHair.position.set(0, 3.45, -0.05);
    hairGroup.add(mainHair);

    const bangsGeo = new THREE.BoxGeometry(0.9, 0.25, 0.25);
    const bangs = new THREE.Mesh(bangsGeo, hairMat);
    bangs.position.set(0, 3.78, 0.42);
    bangs.rotation.x = 0.22;
    hairGroup.add(bangs);

    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), hairMat);
    bun.position.set(0, 3.45, -0.7);
    hairGroup.add(bun);

    chemist.add(hairGroup);

    // 5. BRAS ET MAINS
    const shoulderGeo = new THREE.SphereGeometry(0.16, 12, 12);

    const leftShoulder = new THREE.Mesh(shoulderGeo, coatMat);
    leftShoulder.position.set(-0.68, 2.6, 0);
    chemist.add(leftShoulder);

    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.1, 12),
      coatMat
    );
    leftArm.position.set(-0.8, 2.1, 0.3);
    leftArm.rotation.z = 0.22;
    leftArm.rotation.x = -0.55;
    leftArm.castShadow = true;
    chemist.add(leftArm);

    const rightShoulder = new THREE.Mesh(shoulderGeo, coatMat);
    rightShoulder.position.set(0.68, 2.6, 0);
    chemist.add(rightShoulder);

    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.1, 12),
      coatMat
    );
    rightArm.position.set(0.8, 2.1, 0.3);
    rightArm.rotation.z = -0.22;
    rightArm.rotation.x = -0.55;
    rightArm.castShadow = true;
    chemist.add(rightArm);

    const handGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-0.68, 1.72, 0.75);
    chemist.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0.68, 1.72, 0.75);
    chemist.add(rightHand);

    // Positionnement face à la caméra / à la paillasse
    chemist.position.set(0, 0.1, 0.9);
    chemist.rotation.y = 2 * Math.PI;

    this.scene.add(chemist);
  }

  // --- ANIMATION FRAME LOOP ---
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();

    // 1. Animation de rotation du ballon de la Rotavap
    if (this.rotavapFlask) {
      this.rotavapFlask.rotation.y += 0.015; // Tourne oblique comme en vrai
    }

    // 2. Animation du vortex de l'agitateur magnétique
    if (this.magneticVortex) {
      this.magneticVortex.rotation.y += 0.1; // Tourne très vite
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize = (): void => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onWindowResize);

    // Nettoyage complet de la scène pour éviter les fuites de mémoire (GPU)
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.controls.dispose();
    this.renderer.dispose();
  }
}

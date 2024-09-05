import * as THREE from 'three';

export class Lunette extends THREE.Group {
    constructor() {
        super();
    
        // Matériaux pour les lunettes de sécurité
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Montures noires
        const lensMaterial = new THREE.MeshBasicMaterial({ color: 0x89CFF0, transparent: true, opacity: 0.5 }); // Lentilles semi-transparentes
    
        // Création des lentilles larges et enveloppantes
        const lensGeometry = new THREE.BoxGeometry(4, 2, 0.1); // Lentilles rectangulaires couvrant largement les yeux
        const lentillecentre = new THREE.BoxGeometry(2, 1, 0.1); 
        const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
        const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
        const centre = new THREE.Mesh(lentillecentre, lensMaterial);
        // Positionnement des lentilles
        leftLens.position.set(-2.2, 0, 0.1); // Lentille gauche
        rightLens.position.set(2.2, 0, 0.1); // Lentille droite
        centre.position.set(0,0.5,0.1)
        // Ajout des lentilles au groupe Lunette
        this.add(leftLens);
        this.add(rightLens);
        this.add(centre);
    
        // Création du cadre supérieur pour tenir les lentilles
        const frameTopGeometry = new THREE.BoxGeometry(8.5, 0.3, 0.2); // Cadre supérieur large pour un maintien solide
        const frameTop = new THREE.Mesh(frameTopGeometry, frameMaterial);
        frameTop.position.set(0, 1.1, 0); // Positionné au-dessus des lentilles
    
        // Ajout du cadre supérieur au groupe Lunette
        this.add(frameTop);
    
        // Création du pont entre les lentilles
        const bridgeGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.1); // Pont plus solide
        const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
        bridge.position.set(0, 0, 0); // Entre les deux lentilles
    
        // Ajout du pont au groupe Lunette
        this.add(bridge);
    
          // Création du pont entre les lentilles
          const cadre= new THREE.BoxGeometry(0.2, 0.1, 5); // Pont plus solide
          const cadregauche= new THREE.Mesh(cadre, frameMaterial);
          cadregauche.position.set(-4.2, 1, 2); // Entre les deux lentilles
          const cadredroite= new THREE.Mesh(cadre, frameMaterial);
          cadredroite.position.set(4.2, 1, 2); // Entre les deux lentilles
      
          // Ajout du pont au groupe Lunette
          this.add(cadregauche);
          this.add(cadredroite);
      

      }
}

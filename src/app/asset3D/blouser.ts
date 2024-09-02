import * as THREE from 'three';

export class blouser extends THREE.Group {
    constructor() {
        super();
        const couleur_sol = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const couleur_col = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const structure_rectangle = new THREE.BoxGeometry(5, 10, 1);
 const structure_rectangle_mache = new THREE.BoxGeometry(2, 5, 1);
 const structure_rectangle_col = new THREE.BoxGeometry(0.5, 2,1);
          
        //-----------structure---------------------
        const blouse = new THREE.Mesh(structure_rectangle, couleur_sol);
        const blouse_manche_droite = new THREE.Mesh(structure_rectangle_mache, couleur_sol);
        blouse_manche_droite.translateX(3.5)
        blouse_manche_droite.translateY(2.5)
        blouse_manche_droite.rotateZ(Math.PI / 4);
        const blouse_manche_gauche = new THREE.Mesh(structure_rectangle_mache, couleur_sol);
        blouse_manche_gauche.translateX(-3.5)
        blouse_manche_gauche.translateY(2.5)
        blouse_manche_gauche.rotateZ(-Math.PI / 4);
        const col_manche_gauche = new THREE.Mesh(structure_rectangle_col, couleur_col);
        const col_manche_droite = new THREE.Mesh(structure_rectangle_col, couleur_col);
        col_manche_gauche.translateY(3.8)
        col_manche_gauche.translateZ(-0.8)
        col_manche_droite.translateX(-2)
        col_manche_gauche.rotateZ(-Math.PI / 4);
        col_manche_droite.translateY(3.8)
        col_manche_droite.translateZ(-0.8)
        col_manche_droite.translateX(1)
        col_manche_droite.rotateZ(Math.PI / 4);
        this.add(col_manche_droite);
        this.add(col_manche_gauche);
        this.add(blouse_manche_droite);
        this.add(blouse_manche_gauche);
        this.add(blouse);
    }
}

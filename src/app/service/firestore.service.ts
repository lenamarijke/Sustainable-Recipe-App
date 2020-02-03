import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }


  createSavedRecipe(record) {
    return this.firestore.collection('users').add(record);
  }

  read_Recipes() {
    return this.firestore.collection('recipes').snapshotChanges();
  }

  update_Recipe(recipeId, recipe) {
    this.firestore.doc('recipes/' + recipeId).update(recipe);
  }

  delete_Recipe(recipeId) {
    this.firestore.doc('recipes/' + recipeId).delete();
  }
}

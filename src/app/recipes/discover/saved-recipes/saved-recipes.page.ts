import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { SavedRecipesService } from './saved-recipes.service';
import { SavedRecipe } from './saved-recipe.model';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-saved-recipes',
  templateUrl: './saved-recipes.page.html',
  styleUrls: ['./saved-recipes.page.scss'],
})

export class SavedRecipesPage implements OnInit, OnDestroy {
  isLoading = false;
  recipes: Observable<SavedRecipe[]>;

  constructor(
    private savedRecipesService: SavedRecipesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    if(this.savedRecipesService){
      this.recipes = this.savedRecipesService.getRecipes();
    }
    this.isLoading = false;
  }

  onDelete(recipeId: string, slidingItem: IonItemSliding) {

    slidingItem.close();
    console.log('Deleteing recipe', recipeId);
    this.alertCtrl.create({
      header: 'Are you sure?', 
      message: 'Do you want to delete this recipe?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      },
    ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
  }
}

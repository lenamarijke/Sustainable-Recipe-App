import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, AlertController, ActionSheetController, LoadingController} from '@ionic/angular';

import { RecipesService, Recipe } from '../../recipes.service';
import { SaveRecipeComponent } from '../saved-recipes/save-recipe/save-recipe.component';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-detail-recipes',
  templateUrl: './detail-recipes.page.html',
  styleUrls: ['./detail-recipes.page.scss'],
})
export class DetailRecipesPage implements OnInit {
   isLoading = false;

  recipe: Recipe = {
    title: '',
    score: '',
    scoreInfo: '',
    ingredients: [],
    instructions: [],
    imageUrl: '',
    state: true,
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipesService: RecipesService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.recipesService.getRecipe(id).subscribe(recipe => {
        this.recipe = recipe;
        this.isLoading = false;
      });
    }
  }

  onOrderRecipe() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
    console.log(this.recipe.id);
    this.createSavedRecipe();

    this.alertCtrl.create({
      header: 'Amazing!',
      message: 'A delicious dish has been ordered for you.',
      buttons: [{
        text: 'Thanks!',
        role: 'ok'
      }
    ]
    }).then(alertEl => {
      alertEl.present();
    });
    this.authService.getSavedRecipes(); 
    }
  }

  async createSavedRecipe() {

    const id = this.recipe.id;
    const title = this.recipe.title;
    const score = this.recipe.score;
    const scoreInfo = this.recipe.scoreInfo;
    const ingredients = this.recipe.ingredients;
    const instructions = this.recipe.instructions;
    const imageUrl = this.recipe.imageUrl;
    const state = this.recipe.state;
    const description = this.recipe.description;

    this.authService
      .addSavedRecipe(id, title, score, scoreInfo, ingredients, instructions, imageUrl, state, description);
  }

  onScoreInfo() {
    this.modalCtrl
      .create({
        component: SaveRecipeComponent,
        componentProps: { selectedRecipe: this.recipe }
      })
      .then(modalEl => {
            modalEl.present();
            return modalEl.onDidDismiss();
          });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/recipes/recipe.model';

@Component({
  selector: 'app-save-recipe',
  templateUrl: './save-recipe.component.html',
  styleUrls: ['./save-recipe.component.scss'],
})
export class SaveRecipeComponent implements OnInit {
  @Input() selectedRecipe: Recipe;
  @Input() selectedMode: 'select' | 'random';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSaveRecipe() {
    this.modalCtrl.dismiss({message: 'Bring your towel'}, 'confirm');
  }

}

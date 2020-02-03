import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRecipesPage } from './detail-recipes.page';

describe('DetailRecipesPage', () => {
  let component: DetailRecipesPage;
  let fixture: ComponentFixture<DetailRecipesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRecipesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

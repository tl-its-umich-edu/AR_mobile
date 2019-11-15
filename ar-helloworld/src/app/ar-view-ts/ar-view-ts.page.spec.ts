import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArViewTsPage } from './ar-view-ts.page';

describe('ArViewTsPage', () => {
  let component: ArViewTsPage;
  let fixture: ComponentFixture<ArViewTsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArViewTsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArViewTsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

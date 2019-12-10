import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArBusstopsPage } from './ar-busstops.page';

describe('ArBusstopsPage', () => {
  let component: ArBusstopsPage;
  let fixture: ComponentFixture<ArBusstopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArBusstopsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArBusstopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

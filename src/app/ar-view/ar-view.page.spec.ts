import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArViewPage } from './ar-view.page';

describe('ArViewPage', () => {
  let component: ArViewPage;
  let fixture: ComponentFixture<ArViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

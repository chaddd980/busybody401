import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShiftModalPage } from './shift-modal.page';

describe('ShiftModalPage', () => {
  let component: ShiftModalPage;
  let fixture: ComponentFixture<ShiftModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

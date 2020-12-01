import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StaffModalPage } from './staff-modal.page';

describe('StaffModalPage', () => {
  let component: StaffModalPage;
  let fixture: ComponentFixture<StaffModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

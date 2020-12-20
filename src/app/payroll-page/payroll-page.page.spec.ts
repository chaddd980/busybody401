import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayrollPagePage } from './payroll-page.page';

describe('PayrollPagePage', () => {
  let component: PayrollPagePage;
  let fixture: ComponentFixture<PayrollPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayrollPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

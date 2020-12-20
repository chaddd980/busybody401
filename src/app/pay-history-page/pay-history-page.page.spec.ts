import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayHistoryPagePage } from './pay-history-page.page';

describe('PayHistoryPagePage', () => {
  let component: PayHistoryPagePage;
  let fixture: ComponentFixture<PayHistoryPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayHistoryPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayHistoryPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

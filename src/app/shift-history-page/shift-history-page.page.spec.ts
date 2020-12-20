import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShiftHistoryPagePage } from './shift-history-page.page';

describe('ShiftHistoryPagePage', () => {
  let component: ShiftHistoryPagePage;
  let fixture: ComponentFixture<ShiftHistoryPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftHistoryPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftHistoryPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestChangeModalPage } from './request-change-modal.page';

describe('RequestChangeModalPage', () => {
  let component: RequestChangeModalPage;
  let fixture: ComponentFixture<RequestChangeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChangeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestChangeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

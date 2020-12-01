import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientModalPage } from './client-modal.page';

describe('ClientModalPage', () => {
  let component: ClientModalPage;
  let fixture: ComponentFixture<ClientModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

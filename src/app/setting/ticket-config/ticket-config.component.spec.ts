import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketConfigComponent } from './ticket-config.component';

describe('TicketConfigComponent', () => {
  let component: TicketConfigComponent;
  let fixture: ComponentFixture<TicketConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

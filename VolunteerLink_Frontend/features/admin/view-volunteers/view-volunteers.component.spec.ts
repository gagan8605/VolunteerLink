import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVolunteersComponent } from './view-volunteers.component';

describe('ViewVolunteersComponent', () => {
  let component: ViewVolunteersComponent;
  let fixture: ComponentFixture<ViewVolunteersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVolunteersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVolunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

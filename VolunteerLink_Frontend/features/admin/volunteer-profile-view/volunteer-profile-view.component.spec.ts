import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerProfileViewComponent } from './volunteer-profile-view.component';

describe('VolunteerProfileViewComponent', () => {
  let component: VolunteerProfileViewComponent;
  let fixture: ComponentFixture<VolunteerProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerProfileViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

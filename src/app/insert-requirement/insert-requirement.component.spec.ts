import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertRequirementComponent } from './insert-requirement.component';

describe('InsertRequirementComponent', () => {
  let component: InsertRequirementComponent;
  let fixture: ComponentFixture<InsertRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

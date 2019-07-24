import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEdemocracyProjectComponent } from './new-edemocracy-project.component';

describe('NewEdemocracyProjectComponent', () => {
  let component: NewEdemocracyProjectComponent;
  let fixture: ComponentFixture<NewEdemocracyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEdemocracyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEdemocracyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

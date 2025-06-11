import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAreaComponent } from './student-area.component';

describe('StudentAreaComponent', () => {
  let component: StudentAreaComponent;
  let fixture: ComponentFixture<StudentAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingScreenComponent } from './loding-screen.component';

describe('LodingScreenComponent', () => {
  let component: LodingScreenComponent;
  let fixture: ComponentFixture<LodingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

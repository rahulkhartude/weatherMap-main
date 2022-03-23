import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMainCComponent } from './my-main-c.component';

describe('MyMainCComponent', () => {
  let component: MyMainCComponent;
  let fixture: ComponentFixture<MyMainCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMainCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMainCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

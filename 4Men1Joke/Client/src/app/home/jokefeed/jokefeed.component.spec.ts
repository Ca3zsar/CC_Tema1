import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JokefeedComponent } from './jokefeed.component';

describe('JokefeedComponent', () => {
  let component: JokefeedComponent;
  let fixture: ComponentFixture<JokefeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JokefeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JokefeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktFeedComponent } from './mkt-feed.component';

describe('MktFeedComponent', () => {
  let component: MktFeedComponent;
  let fixture: ComponentFixture<MktFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

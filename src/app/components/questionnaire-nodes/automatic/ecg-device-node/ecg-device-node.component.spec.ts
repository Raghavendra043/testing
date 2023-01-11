import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgDeviceNodeComponent } from './ecg-device-node.component';

xdescribe('EcgDeviceNodeComponent', () => {
  //TODO: Consider adding automatic device node component tests from the old Angular project later on. These are however still tested manually.
  let component: EcgDeviceNodeComponent;
  let fixture: ComponentFixture<EcgDeviceNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgDeviceNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcgDeviceNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

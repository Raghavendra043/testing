import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { NodeRepresentation } from "@app/types/parser.type";
import { HeaderModule } from "@components/header/header.module";
import { NotificationsModule } from "@components/notifications/notifications.module";
import { TranslateModule } from "@ngx-translate/core";

import { BloodPressureManualDeviceNodeComponent } from "./blood-pressure-manual-device-node.component";

describe("BloodPressureManualDeviceNodeComponent", () => {
  let component: BloodPressureManualDeviceNodeComponent;
  let fixture: ComponentFixture<BloodPressureManualDeviceNodeComponent>;

  const node = {
    origin: {
      type: "Object",
      name: "106.BP#ORIGIN",
    },
    pulse: {
      type: "Integer",
      name: "106.BP#PULSE",
    },
    meanArterialPressure: {
      type: "Integer",
      name: "106.BP#MEAN_ARTERIAL_PRESSURE",
    },
    systolic: {
      type: "Integer",
      name: "106.BP#SYSTOLIC",
    },
    diastolic: {
      type: "Integer",
      name: "106.BP#DIASTOLIC",
    },
    helpText: "<b>now!</b>",
    helpImage: "http://localhost:8080/clinician/api/help-texts/1/image",
    text: "Blodtryk",
    comment: {
      name: "106.BP#COMMENT",
      type: "String",
      text: "I know it is a bit high",
    },
    nextFail: "AN_106_CANCEL",
    next: "ANSEV_108_D106",
    nodeName: "106",
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BloodPressureManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { "106": { BloodPressureDeviceNode: node } };
    //@ts-ignore
    component.scope = { hasOffendingValue: () => false };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();
    return representation;
  }

  it("should parse node", async () => {
    const representation: NodeRepresentation = await init();

    expect(representation).toBeDefined();
    expect(representation.nodeModel.heading).toBe("Blodtryk");
    expect(representation?.nodeModel?.comment?.name).toBe("106.BP#COMMENT");
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
    expect(representation.helpMenu).toBeDefined();
    expect(representation?.helpMenu?.text).toEqual("<b>now!</b>");
    expect(representation?.helpMenu?.image).toEqual(
      "http://localhost:8080/clinician/api/help-texts/1/image"
    );
  });

  it("should setup right button with click action", async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe("NEXT");
    expect(right?.nextNodeId).toBe("ANSEV_108_D106");
    expect(right?.validate).toBeDefined();
    expect(right?.click).toBeDefined();

    const scope: any = {
      outputModel: {},
      nodeModel: {},
    };
    //@ts-ignore
    expect(right.validate(scope)).toBe(false);

    const originJson = {
      manualMeasurement: {
        enteredBy: "citizen",
      },
    };

    scope.nodeModel = {
      origin: originJson,
      systolic: 122,
      diastolic: 95,
      meanArterialPressure: 108,
      pulse: 80,
    };

    component.nodeForm.setValue({
      systolic: "122",
      diastolic: "95",
      pulse: "80",
    });

    //@ts-ignore
    expect(right.validate(scope)).toBe(true);
    //@ts-ignore
    right.click(scope);

    const systolic = scope.outputModel["106.BP#SYSTOLIC"];
    expect(systolic.name).toBe("106.BP#SYSTOLIC");
    expect(systolic.type).toBe("Integer");
    expect(systolic.value).toBe(122);

    const diastolic = scope.outputModel["106.BP#DIASTOLIC"];
    expect(diastolic.name).toBe("106.BP#DIASTOLIC");
    expect(diastolic.type).toBe("Integer");
    expect(diastolic.value).toBe(95);

    const pulse = scope.outputModel["106.BP#PULSE"];
    expect(pulse.name).toBe("106.BP#PULSE");
    expect(pulse.type).toBe("Integer");
    expect(pulse.value).toBe(80);

    const origin = scope.outputModel["106.BP#ORIGIN"];
    expect(origin.name).toBe("106.BP#ORIGIN");
    expect(origin.type).toBe("Object");
    expect(origin.value).toEqual(originJson);

    const comment = scope.outputModel["106.BP#COMMENT"];
    expect(comment.name).toBe("106.BP#COMMENT");
    expect(comment.type).toBe("String");
    expect(comment.value).toBe("I know it is a bit high");
  });

  it("should setup left button", async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe("SKIP");
    expect(left?.nextNodeId).toBe("AN_106_CANCEL");
  });
});

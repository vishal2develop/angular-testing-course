import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(
    waitForAsync(() => {
      const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
        "findAllCourses",
      ]);
      TestBed.configureTestingModule({
        imports: [CoursesModule, NoopAnimationsModule],
        providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(HomeComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement;
          coursesService = TestBed.inject<CoursesService>(CoursesService);
        });
    })
  );

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // console.log(tabs);

    expect(tabs.length).toBe(1, "Unexpected no of tabs");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected no of tabs");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Unexpected no of tabs");
  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    // fakeAsync and flush() work together
    // flushlink. Simulates the asynchronous passage of time for the timers in the fakeAsync
    //  zone by draining the macrotask queue until it is empty.
    flush();
    const card_titles = el.queryAll(
      By.css(".mat-tab-body-active .mat-card-title")
    );
    expect(card_titles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(card_titles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));

  it(
    "should display advanced courses when tab clicked - async",
    waitForAsync(() => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();
      const tabs = el.queryAll(By.css(".mat-tab-label"));
      click(tabs[1]);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const card_titles = el.queryAll(
          By.css(".mat-tab-body-active .mat-card-title")
        );
        expect(card_titles.length).toBeGreaterThan(
          0,
          "Could not find card titles"
        );
        expect(card_titles[0].nativeElement.textContent).toContain(
          "Angular Security Course"
        );
      });
      // fakeAsync and flush() work together
      // flushlink. Simulates the asynchronous passage of time for the timers in the fakeAsync
      //  zone by draining the macrotask queue until it is empty.
    })
  );
});

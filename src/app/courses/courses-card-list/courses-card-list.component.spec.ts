import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let element: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({ imports: [CoursesModule] })
        .compileComponents()
        .then(() => {
          // Creating a component
          fixture = TestBed.createComponent(CoursesCardListComponent);
          // Getting an instance of compoennt
          component = fixture.componentInstance;
          element = fixture.debugElement;
        });
    })
  );

  it("should create the component", () => {
    expect(component).toBeTruthy();
    // console.log(component);
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const cards = element.queryAll(By.css(".course-card"));
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected no of coursess");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = element.query(By.css(".course-card:first-child"));
    const title = element.query(By.css("mat-card-title"));
    const image = element.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course-card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});

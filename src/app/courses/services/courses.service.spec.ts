import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import {
  COURSES,
  findLessonsForCourse,
  LESSONS,
} from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });
  it("should find all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      //   assert if returned data is correct or not
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "incorrect no of coursess");
      //   find a particular course
      const course = courses.find((course) => course.id === 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });
    // the find all courses api will return some data. To define that we use httpTestingController

    // Test only once GET call to /api/courses has been made
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    // specify the test data to be returned by our mock request
    // Only when flush call is made our mock http request will simulate a response
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should find course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      // Assert that the response is correct
      expect(course).toBeTruthy();
      // Assert that the course returned is indeed 12
      expect(course.id).toBe(12);
    });
    // To return test data
    // To make sure only one call to /api/courses/12 is made
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("should save course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Angular Testing Course Latest" },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    // Verify that the data we are trying to update is being added to the body of PUT request
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Angular Testing Course Latest" },
    };
    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the save course should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toBe(
      changes.titles.description
    );
    req.flush("save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });
    // For requests with query params match the url and not the params
    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );
    expect(req.request.method).toEqual("GET");
    // Matching query params
    // Note: body of http requests contains ony string and not other types
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    // Slicing for pagination
    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    // To make sure no unintended HTTP requests are getting triggered
    httpTestingController.verify();
  });
});

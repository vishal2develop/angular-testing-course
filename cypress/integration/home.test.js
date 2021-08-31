describe("Home Page", () => {
  beforeEach(() => {
    cy.server();
    cy.fixture("courses.json").as("CoursesJson");
    cy.route("/api/courses", "@CoursesJson").as("courses");
    cy.visit("/");
  });
  it("Should display all courses", () => {
    cy.contains("All Courses");
    cy.wait("@courses");
    cy.get(".mat-card").should("have.length", 9);
  });

  it("should display advanced courses", () => {
    cy.get(".mat-tab-label").should("have.length", 2);
    cy.get(".mat-tab-label").last().click();
    cy.get(".mat-tab-body-active .mat-card-title")
      .its("length")
      .should("be.gt", 1);

    cy.get(".mat-tab-body-active .mat-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});

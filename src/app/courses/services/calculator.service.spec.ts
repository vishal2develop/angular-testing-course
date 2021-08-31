import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calculator: CalculatorService, loggerSpy: any;
  beforeEach(() => {
    console.log("calling before each");

    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    // Configure testing module

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });
    calculator = TestBed.get(CalculatorService);
  });
  it("should add two numbers", () => {
    console.log("add");

    //   Fake implementation of logger service (mocking) and spying on log method

    const result = calculator.add(2, 2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
  it("should subtract two numbers", () => {
    console.log("subtract");

    const result = calculator.subtract(4, 2);
    expect(result).toBe(2);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});

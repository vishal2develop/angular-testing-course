import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs/internal/observable/of";
import { delay } from "rxjs/operators";

describe("Asynchronous Testing example", () => {
  it("Asynchronous Test example with jasmine done()", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log("running assertions");

      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });
  it("Async test example - setTimeout()", fakeAsync(() => {
    let test = false;
    setTimeout(() => {});
    setTimeout(() => {
      console.log("running assertions setTimeout()");

      test = true;
      expect(test).toBeTruthy();
    }, 1000);

    tick(1000);
    expect(test).toBeTruthy();
  }));

  it("Async test example - plain promise", fakeAsync(() => {
    let test = false;
    console.log("Creating a promise");

    // setTimeout(() => {
    //   console.log("setTimeout() 1 trigerred");
    // });

    // setTimeout(() => {
    //   console.log("setTimeout() 2 trigerred");
    // });
    // flush();

    // Creating an immediately resolved promise
    Promise.resolve()
      .then(() => {
        console.log("Promise1 evaluated sucessfully");
        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise2 evaluated sucessfully");
        test = true;
      });
    flushMicrotasks();
    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));

  it("Async test example - promise + setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      console.log("inside promise");

      counter += 10;
      setTimeout(() => {
        console.log("inside timeout");

        counter += 1;
      }, 1000);
    });
    expect(counter).toBe(0);
    // to trigger promise
    flushMicrotasks();
    expect(counter).toBe(10);
    // use either tick() or flush() to trigger setTimeout()
    tick(1000);
    flush();
    expect(counter).toBe(11);
  }));

  it("Async test example - Observables", fakeAsync(() => {
    let test = false;
    // creating observalbe - test$
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });
    tick(1000);

    console.log("Running test assertions");
    expect(test).toBeTruthy();
  }));
});

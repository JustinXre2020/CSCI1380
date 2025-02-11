/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');

test('(1 pts) student test', () => {
  // Fill out this test case...
  const service = {
    name: "Justin"
  };
  distribution.local.routes.put(service, "stest1", (e, c) => e ? console.error(e) : console.log(c));
  const name = distribution.local.routes.get("stest1")['name'];
  expect(name).toEqual("Justin");

  // Fill out this test case...
  const service2 = {
    add: (a, b) => a + b,
  };
  distribution.local.routes.put(service2, "ftest2", (e, c) => e ? console.error(e) : console.log(c));
  const add_func = distribution.local.routes.get("ftest2")['add'];
  expect(add_func(1, 2)).toEqual(3);
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const customConfig = global.moreStatus.sid;

  distribution.local.status.get('sid', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(customConfig);
    } catch (error) {
      done(error);
    }
  });

  distribution.local.status.get('invalidConfig', (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(v).toBeUndefined();
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  const node = distribution.node.config;
  const remote = {node: node, service: 'status', method: 'get'};
  const message = ['sid']; // Arguments to the method
  const id = distribution.util.id;

  distribution.local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(id.getSID(node));
    } catch (error) {
      done(error);
    }
  });

  const message2 = ["the value doesn't exist"];

  distribution.local.comm.send(message2, remote, (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const service = { name: 'testService' };
  const configuration = 'testConfig';

  // First, add the service to the route table
  distribution.local.routes.put(service, configuration, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(service);

      // Now, retrieve the service from the route table
      distribution.local.routes.get(configuration, (err, config) => {
        try {
          expect(err).toBeFalsy();
          expect(config).toBe(service);
        } catch (error) {
          done(error);
        }
      });
    } catch (error) {
      done(error);
    }
  });

  const configuration2 = 'testConfig2';

  distribution.local.routes.get(configuration2, (err, config) => {
    try {
      expect(err).toBeTruthy();
      expect(err.message).toBe(`'${configuration2}' doesn't exist!`);
      expect(config).toBeUndefined();
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
    // First, add the service to the route table
    const service = { name: 'testService' };
    const configuration = 'testConfig';

    distribution.local.routes.put(service, configuration, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(service);

        // Now, remove the service from the route table
        distribution.local.routes.rem(configuration, (err, config) => {
          try {
            expect(err).toBeFalsy();
            expect(config).toBe(configuration);
          } catch (error) {
            done(error);
          }
        });
      } catch (error) {
        done(error);
      }
    });

    const configuration2 = 'testConfig2';

    distribution.local.routes.rem(configuration2, (err, config) => {
      try {
        expect(err).toBeTruthy();
        expect(err.message).toBe(`${configuration2} doesn't exist!`);
        expect(config).toBe(configuration2);
        done();
      } catch (error) {
        done(error);
      }
    });
});

/* Test infrastructure */

let localServer = null;

beforeAll((done) => {
  distribution.node.start((server) => {
    localServer = server;
    done();
  });
});

afterAll((done) => {
  localServer.close();
  done();
});

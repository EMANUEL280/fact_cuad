var assert = require("chai").assert;
var test = require("../app/controllers/exampleUnitTest.js");

describe("Check audit sites level: ", function () {
	describe("Verify Functions: ", function () {
		it("Verify value returned", async function () {
			let x = await test.test();
			assert.typeOf(x, "string", "The returned value is a valid String");
		});
	});

});
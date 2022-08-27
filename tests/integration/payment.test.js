const request = require("supertest");

describe("payment route", () => {
    let server;
    beforeEach(() => {
        server = require("../../index");
    });

    afterEach(async () => {
        await server.close();
    });

    describe("GET /methods", () => {
        it("should return payment methods", async () => {
            const res = await request(server)
                .get("/api/payment/methods");
            expect(res.status).toBe(200);
        });
    });

    describe("GET /methods/:lang", () => {
        it("should return payment methods", async () => {
            const res = await request(server)
                .get("/api/payment/methods/pl");
            expect(res.status).toBe(200);
        });

        it("should return payment methods", async () => {
            const res = await request(server)
                .get("/api/payment/methods/en");
            expect(res.status).toBe(200);
        });
    });
})
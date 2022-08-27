const axios = require("axios").default;
const config = require("config");

const client = axios.create({
    baseURL: "https://konto.furgonetka.pl", // /oauth/authorize
});

class Auth {
    accessToken;
    refreshToken;

    async init() {
        const data = await this.#getToken();
        this.accessToken = data.access_token;
        this.refresh_token = data.refresh_token;
    };

    async update() {
        const data = await this.#updateToken();
        this.accessToken = data.access_token;
        this.refresh_token = data.refresh_token;
    };


    async #getToken() {
        const request = {
            grant_type: "password",
            username: config.get("furgonetka.username"),
            password: config.get("furgonetka.password"),
        };

        const headers = {
            Authorization: config.get("furgonetka.auth"),
        };

        try {
            const { data: result } = await client.post(
                "/oauth/token",
                request,
                headers
            );
            return result.data;
        } catch (error) {
            return error;
        }
    }

    async #updateToken() {
        const request = {
            grant_type: "refresh_token",
            username: config.get("furgonetka.username"),
            password: config.get("furgonetka.password"),
            refresh_token: this.refreshToken,
        };

        const headers = {
            Authorization: config.get("furgonetka.auth"),
        };

        try {
            const { data: result } = await client.post(
                "/oauth/token",
                request,
                headers
            );
            return result.data;
        } catch (error) {
            return error;
        }
    };

}

const auth = new Auth();

module.exports = auth;
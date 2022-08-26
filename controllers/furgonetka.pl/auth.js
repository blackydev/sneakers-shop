const axios = require("axios").default;

const client = axios.create({
    baseURL: "https://konto.furgonetka.pl", // /oauth/authorize
});

class auth {
    accessToken;
    refreshToken;

    async init() {
        const data = await this.#getToken();
        this.accessToken = data.access_token;
        this.refresh_token = data.refresh_token;
    };

    async #getToken() {
        const request = {
            grant_type: "password",
            username: "TODO: add username",
            password: config.get("furgonetka-password"),
        };

        const headers = {
            Authorization: authorization,
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

    };

}

module.exports = {

};
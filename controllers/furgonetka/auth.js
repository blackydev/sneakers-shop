const axios = require("axios").default;
const config = require("config");
const { setDaysInterval } = require("../../utils/timers");

const furgonetkaURL =
  process.env.NODE_ENV === "production"
    ? "https://api.furgonetka.pl"
    : "https://api-test.furgonetka.pl";

const authURL =
  process.env.NODE_ENV === "production"
    ? "https://konto.furgonetka.pl"
    : "https://konto-test.furgonetka.pl";

const authClient = axios.create({
  baseURL: authURL,
});

class AuthController {
  accessToken;
  #refreshToken;
  #clientId = config.get("furgonetka.clientId");
  #clientSecret = config.get("furgonetka.clientSecret");
  #username = config.get("furgonetka.username");
  #password = config.get("furgonetka.password");
  #authorization =
    "Basic " +
    Buffer.from(this.#clientId + ":" + this.#clientSecret).toString("base64");
  axiosClient;
  setAxiosClient = () => {
    this.axiosClient = axios.create({
      baseURL: furgonetkaURL,
      headers: { authorization: "Bearer " + this.accessToken },
    });
  };

  constructor() {
    if (!process.env.offline) this.init();
  }

  init = async () => {
    const data = await this.#createTokens();
    this.accessToken = data.access_token;
    this.#refreshToken = data.refresh_token;
    this.setAxiosClient();
    setDaysInterval(async () => {
      await this.#update();
      this.setAxiosClient();
    }, 29);
  };

  #update = async () => {
    const data = await this.#updateTokens();
    this.accessToken = data.access_token;
    this.#refreshToken = data.refresh_token;
  };

  #createTokens = async () => {
    try {
      const request = `grant_type=password&scope=api&username=${
        this.#username
      }&password=${this.#password}`;
      const header = {
        headers: {
          Authorization: this.#authorization,
        },
      };

      const { data } = await authClient.post("/oauth/token", request, header);
      return data;
    } catch (error) {
      throw new Error(
        "FATAL ERROR: Unsuccessful token download from furgonetka."
      );
    }
  };

  #updateTokens = async () => {
    try {
      const request = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.#refreshToken,
      });

      const header = {
        headers: {
          Authorization: this.#authorization,
        },
      };

      const { data } = await authClient.post("/oauth/token", request, header);
      return data;
    } catch (error) {
      throw new Error(
        "FATAL ERROR: Unsuccessful token refresh from furgonetka."
      );
    }
  };
}

const authController = new AuthController();

module.exports = authController;

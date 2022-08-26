const furgonetkaURL =
    process.env.NODE_ENV === "production"
        ? "https://api.furgonetka.pl"
        : "https://api-test.furgonetka.pl";

exports.module = {
    url: furgonetkaURL
};
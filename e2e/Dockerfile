# Playwright runner (browsers preinstalled). Records video + screenshots for
# each phase of the sovereign demo so the work can be visually verified.
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /e2e

# Trust optional extra CA certs (e.g. a corporate / egress TLS proxy). No-op
# when extra-cas/ holds no *.crt (the default).
COPY extra-cas/ /opt/extra-cas/
RUN cat /opt/extra-cas/*.crt > /opt/extra-cas.pem 2>/dev/null || touch /opt/extra-cas.pem
ENV NODE_EXTRA_CA_CERTS=/opt/extra-cas.pem

COPY package.json ./
RUN npm install --no-audit --no-fund
COPY playwright.config.ts ./
COPY tests ./tests

CMD ["npx", "playwright", "test"]

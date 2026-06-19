# Tiny one-shot container that applies SQL migrations (and optionally the dev
# example seed) against the sovereign Postgres once Storage has initialized.
FROM postgres:17-alpine
COPY docker/bootstrap/bootstrap.sh /usr/local/bin/bootstrap.sh
RUN chmod +x /usr/local/bin/bootstrap.sh
ENTRYPOINT ["/usr/local/bin/bootstrap.sh"]

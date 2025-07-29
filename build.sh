tar --exclude=node_modules -czf clipboard-server.tar.gz \
    config.json \
    package.json \
    package-lock.json \
    pnpm-lock.yaml \
    public \
    run.sh \
    server.js

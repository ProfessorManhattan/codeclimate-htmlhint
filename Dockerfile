FROM node:alpine AS codeclimate

WORKDIR /work

COPY local/codeclimate-htmlhint /usr/local/bin/codeclimate-htmlhint
COPY local/app-package.json package.json
COPY local/engine.json engine.json

RUN adduser --uid 9000 --gecos "" --disabled-password app \
    && apk --no-cache add --virtual build-deps \
    jq \
    && npm i -g \
    && rm package.json \
    && chown -Rf app:app /usr/lib/node_modules \
    && VERSION="$(htmlhint --version)" \
    && jq --arg version "$VERSION" '.version = $version' > /engine.json < ./engine.json \
    && rm ./engine.json \
    && apk del build-deps

USER app

VOLUME /code
WORKDIR /code

CMD ["codeclimate-htmlhint"]

ARG BUILD_DATE
ARG REVISION
ARG VERSION

LABEL maintainer="Megabyte Labs <help@megabyte.space>"
LABEL org.opencontainers.image.authors="Brian Zalewski <brian@megabyte.space>"
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.description="A slim HTMLHint linter / CodeClimate engine for GitLab CI"
LABEL org.opencontainers.image.documentation="https://github.com/megabyte-labs/codeclimate-htmlhint/blob/master/README.md"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.revision=$REVISION
LABEL org.opencontainers.image.source="https://github.com/megabyte-labs/codeclimate-htmlhint.git"
LABEL org.opencontainers.image.url="https://megabyte.space"
LABEL org.opencontainers.image.vendor="Megabyte Labs"
LABEL org.opencontainers.image.version=$VERSION
LABEL space.megabyte.type="codeclimate"

FROM codeclimate AS htmlhint

WORKDIR /work

USER root

RUN rm -rf /engine.json /usr/local/bin/codeclimate-htmlhint /usr/lib/node_modules

COPY --from=node:alpine /usr/lib/node_modules /usr/lib/node_modules

RUN npm i -g htmlhint

ENTRYPOINT ["htmlhint"]
CMD ["--version"]

LABEL space.megabyte.type="linter"

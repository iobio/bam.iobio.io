FROM anderspitman/iobio-gru-backend:latest

ARG bam_version=iobio-launch
#RUN git clone --depth 1 --branch ${bam_version} https://github.com/iobio/bam.iobio.io
RUN git clone --depth 1 --branch ${bam_version} https://github.com/anderspitman/bam.iobio.io /bam.iobio.io

WORKDIR /bam.iobio.io

RUN ["npm", "install"]
RUN ["npm", "run", "build-docker"]
RUN ["mv", "client", "/bam"]

RUN mkdir -p /bam/config

WORKDIR /iobio-gru-backend
RUN rm -rf /bam.iobio.io

EXPOSE 8000

ENTRYPOINT ["node", "src/index.js", "--tools-dir=/iobio-gru-backend/tool_bin", "--app-dir=/bam"]

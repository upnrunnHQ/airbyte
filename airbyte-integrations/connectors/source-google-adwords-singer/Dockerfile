FROM airbyte/integration-base-singer:dev

RUN apt-get update && apt-get install -y jq curl bash && rm -rf /var/lib/apt/lists/*

ENV CODE_PATH="source_google_adwords_singer"
ENV AIRBYTE_IMPL_MODULE="source_google_adwords_singer"
ENV AIRBYTE_IMPL_PATH="SourceGoogleAdwordsSinger"

WORKDIR /airbyte/integration_code
COPY $CODE_PATH ./$CODE_PATH
COPY setup.py ./
RUN pip install ".[main]"

LABEL io.airbyte.version=0.1.3
LABEL io.airbyte.name=airbyte/source-google-adwords-singer

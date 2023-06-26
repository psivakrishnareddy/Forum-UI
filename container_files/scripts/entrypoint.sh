#!/bin/sh
echo "Started Entrypoint..."
# Put entrypoint code here

# Function checks for the existence of the secrets file for specified secrets
# If one is not found the script will sleep and check again in an endless loop

secrets_base_dir="/run/secrets"

check_secrets() {
    local secret
    local secret_exists
    local sleep_cycle=10

    for secret in "$@"; do
        echo "Checking for secret: ${secret}"
        secret_exists="false"
        while [ "${secret_exists}" == "false" ]; do
            if [ ! -e "${secrets_base_dir}/${secret}" ]; then
                echo "ERROR: Secret '${secret}' is unavailable. Unable proceed"
                echo "Will sleep for ${sleep_cycle} secs and check again"
                sleep ${sleep_cycle}
                continue
            else
                secret_exists="true"
            fi
        done
    done
}

# The db password, Sendgrid API key and JWT token key are available as Docker secrets
if [ ! -z ${USE_DOCKER_SECRETS+x} ] && [ "${USE_DOCKER_SECRETS}" == "true" ]; then
    echo "Using Docker secrets. Checking if all required secrets are available. This does not validate the secrets themselves"
    check_secrets "${SBSD_ENV}_ui_auth0_client_id"
    AUTH0_CLIENT_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_ui_auth0_client_id)
    check_secrets "${SBSD_ENV}_ui_auth0_client_secret"
    AUTH0_CLIENT_SECRET=$(cat ${secrets_base_dir}/${SBSD_ENV}_ui_auth0_client_secret)
    check_secrets "${SBSD_ENV}_forum_googleanalytics_tracking_id"
    GOOGLE_ANALYTICS_TRACKING_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_forum_googleanalytics_tracking_id)
    export AUTH0_CLIENT_ID
    export AUTH0_CLIENT_SECRET
    export GOOGLE_ANALYTICS_TRACKING_ID
else
    echo "Not using Docker Secrets"
fi

# export BASE_URL="https\:\/\/$DOWNLOAD_SERVICE_URL\/forum\/api\/"

# export SED_SERVICE_URL="https\:\/\/$SERVICE_URL\/"
# export SED_AUTH0_RETURN_URL="https\:\/\/$AUTH0_RETURN_URL\/"
# export SED_AUTH0_BASE_URL="https\:\/\/$AUTH0_BASE_URL\/"
# export SED_AUTH0_CALLBACKURL="https\:\/\/$AUTH0_CALLBACKURL\/callback"
export SED_AUTH0_AUDIENCE="https\:\/\/$AUTH0_AUDIENCE\/api\/v2"
export SED_DOWNLOAD_SERVICE_URL="https\:\/\/$DOWNLOAD_SERVICE_URL"

sed -i 's/SED_DOWNLOAD_SERVICE_URL_VALUE/'"${SED_DOWNLOAD_SERVICE_URL}"'/' /usr/share/nginx/html/static/js/main.*.js
# sed -i 's/SED_SERVICE_URL_VALUE/'"${SED_SERVICE_URL}"'/' /usr/share/nginx/html/main.*.js
# sed -i 's/SED_AUTH0_RETURN_URL_VALUE/'"${SED_AUTH0_RETURN_URL}"'/' /usr/share/nginx/html/main.*.js
# sed -i 's/SED_AUTH0_BASE_URL_VALUE/'"${SED_AUTH0_BASE_URL}"'/' /usr/share/nginx/html/main.*.js
sed -i 's/SED_AUTH0_CLIENT_ID_VALUE/'"${AUTH0_CLIENT_ID}"'/' /usr/share/nginx/html/static/js/main.*.js
# sed -i 's/SED_AUTH0_CALLBACKURL_VALUE/'"${SED_AUTH0_CALLBACKURL}"'/' /usr/share/nginx/html/main.*.js
sed -i 's/SED_AUTH0_AUDIENCE_VALUE/'"${SED_AUTH0_AUDIENCE}"'/' /usr/share/nginx/html/static/js/main.*.js
sed -i 's/SED_AUTH0_DOMAIN_VALUE/'"${AUTH0_DOMAIN}"'/' /usr/share/nginx/html/static/js/main.*.js
# sed -i 's/SED_IS_LIVE_VALUE/'"${SED_IS_LIVE}"'/' /usr/share/nginx/html/main.*.js
# sed -i 's/SED_TRACKING_ID_VALUE/'"${TRACKING_ID}"'/' /usr/share/nginx/html/index.html
# sed -i 's/SED_DOWNLOAD_SERVICE_URL_VALUE/'"${SED_DOWNLOAD_SERVICE_URL}"'/' /usr/share/nginx/html/main.*.js
sed -i 's/FORUM_TRACKING_ID_VALUE/'"${GOOGLE_ANALYTICS_TRACKING_ID}"'/' /usr/share/nginx/html/index.html

echo "Entrypoint finished, running the container process now"
exec "$@"

#!/usr/bin/env bash

set -ef -o pipefail

function change_app_config() {
  app_env="$1"
  app_config_file="config/app/app-${app_env}.config.json"

  if [ -f "${app_config_file}" ]; then
    cp ${app_config_file} src/assets/config/app.config.json
    echo "App config file updated"
  else
    echo "App config file ${app_config_file} does not exist"
  fi
}

function change_oidc_config() {
  oidc_env="$1"
  oidc_config_file="config/oidc/oidc-${oidc_env}.config.json"

  if [ -f "${oidc_config_file}" ]; then
    cp ${oidc_config_file} src/assets/config/oidc.config.json
    echo "OIDC config file updated"
  else
    echo "OIDC config file ${oidc_config_file} does not exist"
  fi
}

case "$1" in
    app_config)
      change_app_config "$2"
      ;;

    oidc_config)
      change_oidc_config "$2"
      ;;

    *)
      {
        echo "I don't know this command: '$1'"
        exit 1
      } >&2
esac

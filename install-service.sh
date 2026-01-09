#!/usr/bin/env bash
set -euo pipefail

# Install this Next.js app as a systemd service
# Usage:
#   PORT=19847 SERVICE_USER=ankit SERVICE_NAME=todos ./install-service.sh
# Notes:
#   - Prefers Bun if available (bun.lock detected), falls back to npm.
#   - Avoid running the script with sudo; it will use sudo only for systemd steps.

# Configuration (can be overridden via env)
SERVICE_NAME=${SERVICE_NAME:-todos}
DESCRIPTION=${DESCRIPTION:-"Todos Next.js App"}
PORT=${PORT:-19847}
SERVICE_USER=${SERVICE_USER:-${SUDO_USER:-${USER}}}
WORKING_DIR=${WORKING_DIR:-"$(pwd)"}
TEMPLATE_PATH=${TEMPLATE_PATH:-"deploy/systemd/todos.service.template"}
DEST_UNIT="/etc/systemd/system/${SERVICE_NAME}.service"

# Resolve binaries (prefer Bun if present)
BUN_BIN=${BUN_BIN:-"$(command -v bun || true)"}
NODE_BIN=${NODE_BIN:-"$(command -v node || true)"}
NPM_BIN=${NPM_BIN:-"$(command -v npm || true)"}

PKG_MANAGER="npm"
if [[ -n "${BUN_BIN}" ]] && [[ -f bun.lock ]]; then
  PKG_MANAGER="bun"
fi

if [[ "${PKG_MANAGER}" == "bun" ]]; then
  echo "Using Bun for install/build/start"
else
  echo "Using npm for install/build/start"
  if [[ -z "${NPM_BIN}" ]]; then
    echo "Error: npm not found in PATH. Please install Node.js/npm or set NPM_BIN." >&2
    exit 1
  fi
fi

if [[ -z "${NODE_BIN}" ]]; then
  echo "Error: node not found in PATH. Please install Node.js or set NODE_BIN." >&2
  exit 1
fi

# Construct PATH for systemd environment (ensure relevant bins are included)
NODE_DIR="$(dirname "${NODE_BIN}")"
NPM_DIR="$(dirname "${NPM_BIN}")"
BUN_DIR="$(dirname "${BUN_BIN}")"
SERVICE_PATH=${SERVICE_PATH:-"${BUN_DIR}:${NODE_DIR}:${NPM_DIR}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"}

if [[ ! -f "${TEMPLATE_PATH}" ]]; then
  echo "Error: service template not found at ${TEMPLATE_PATH}" >&2
  exit 1
fi

# Install deps and build (production)
if [[ "${PKG_MANAGER}" == "bun" ]]; then
  echo "Installing dependencies with bun install..."
  "${BUN_BIN}" install --frozen-lockfile || "${BUN_BIN}" install
  echo "Building the app with bun..."
  "${BUN_BIN}" run build
else
  if [[ -f package-lock.json ]]; then
    echo "Installing dependencies with npm ci..."
    "${NPM_BIN}" ci
  else
    echo "Installing dependencies with npm install..."
    "${NPM_BIN}" install
  fi
  echo "Building the app with npm..."
  "${NPM_BIN}" run build
fi

echo "Stopping existing service if running (${SERVICE_NAME})..."
if systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
  sudo systemctl stop "${SERVICE_NAME}" || true
fi

# Render the unit from template
TMP_UNIT="tmp_rovodev_${SERVICE_NAME}.service"
cp "${TEMPLATE_PATH}" "${TMP_UNIT}"

# Escape slashes for sed replacements
esc() { printf '%s' "$1" | sed -e 's/[\\&/]/\\&/g'; }
# Alternative escaping that doesn't break complex paths
esc_simple() { printf '%s' "$1" | sed -e 's/&/\\&/g'; }

if [[ "${PKG_MANAGER}" == "bun" ]]; then
  EXECSTART_CMD="${BUN_BIN} run start"
else
  EXECSTART_CMD="${NPM_BIN} run start"
fi

# Use a different delimiter for paths to avoid escaping issues
sed -i \
  -e "s/%DESCRIPTION%/$(esc_simple "${DESCRIPTION}")/g" \
  -e "s/%SERVICE_NAME%/$(esc_simple "${SERVICE_NAME}")/g" \
  -e "s/%USER%/$(esc_simple "${SERVICE_USER}")/g" \
  -e "s#%WORKING_DIR%#${WORKING_DIR}#g" \
  -e "s/%PORT%/$(esc_simple "${PORT}")/g" \
  -e "s#%PATH%#${SERVICE_PATH}#g" \
  -e "s#%EXECSTART%#${EXECSTART_CMD}#g" \
  "${TMP_UNIT}"


echo "Installing systemd unit to ${DEST_UNIT}..."
sudo cp "${TMP_UNIT}" "${DEST_UNIT}"
rm -f "${TMP_UNIT}"


echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "Enabling and starting ${SERVICE_NAME}..."
sudo systemctl enable "${SERVICE_NAME}"
sudo systemctl start "${SERVICE_NAME}"

sleep 1

echo "Showing service status (press q to exit):"
sudo systemctl --no-pager --full status "${SERVICE_NAME}" || true

echo
cat <<EOF
Success! Service '${SERVICE_NAME}' deployed.
- URL: http://localhost:${PORT}
- Manage with:
    sudo systemctl status ${SERVICE_NAME}
    sudo systemctl restart ${SERVICE_NAME}
    sudo systemctl stop ${SERVICE_NAME}
    sudo journalctl -u ${SERVICE_NAME} -f

If you change the unit file, run:
    sudo systemctl daemon-reload && sudo systemctl restart ${SERVICE_NAME}
EOF

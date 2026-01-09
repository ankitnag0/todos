# Making the App Installable as a System Service (systemd)

## Overview
We made the app “installable” as a system service so it:
- Runs in the background
- Starts automatically at boot
- Is managed consistently via `systemctl`
- Logs via `journald`
- Serves on a fixed port (19847)

### What “installable” means here
- Installation is setting up a systemd unit that starts your Next.js production server (`next start`).
- The provided script builds the app, installs/enables the service, and starts it.
- After that, the app is accessible at http://localhost:19847, and the service is managed via `systemctl`.

## Prerequisites
- Linux system with systemd
- Node.js and npm available on the system (the service file references a specific Node path; see Customization)
- Permissions to run `sudo` for `systemctl` and copying to `/etc/systemd/system`

## Key Files in this Repo
- `install-service.sh`: Idempotent installer/updater that builds the app, installs the systemd unit, enables it, and starts it.
- `credential-manager.service`: The systemd service unit definition.
- `package.json`: Defines `start` and `start:production` scripts used by the service.

## How the installer works (`install-service.sh`)
1) Builds the app:
   - Runs `npm run build` to create a production build. If build fails, install aborts.

2) Stops existing service (if any):
   - `sudo systemctl stop credential-manager` (ignores errors if not running)

3) Installs/updates the service unit:
   - Copies `credential-manager.service` into `/etc/systemd/system/`

4) Reloads systemd:
   - `sudo systemctl daemon-reload`

5) Enables and starts:
   - `sudo systemctl enable credential-manager`
   - `sudo systemctl start credential-manager`

6) Confirms status:
   - Shows `sudo systemctl status credential-manager` and prints a success or failure message with next steps.

## The systemd unit explained (`credential-manager.service`)
- [Unit]
  - `Description`: A human-friendly name
  - `After`/`Wants=network.target`: Ensure the service starts after network availability

- [Service]
  - `Type=simple`: Runs in foreground and systemd tracks the process
  - `User=ankit`: The UNIX user the service runs as (customize as needed)
  - `WorkingDirectory=/home/ankit/ankit/notes/creds/manager`: The project directory (customize)
  - `Environment=NODE_ENV=production`, `PORT=19847`: Runtime env vars; port is set here
  - `Environment=PATH=...`: Ensures the Node/npm path exists when systemd runs the service
  - `ExecStart=/home/ankit/.../npm run start:production`: Starts Next.js in production (uses port 19847)
  - `Restart=always`, `RestartSec=10`: Auto-restart on crashes
  - `StandardOutput`/`StandardError=syslog` and `SyslogIdentifier=credential-manager`: Direct logs to journald

- [Install]
  - `WantedBy=multi-user.target`: Enables autostart at boot

## First-time installation
- Make the installer executable:
  - `chmod +x ./install-service.sh`
- Run it:
  - `./install-service.sh`
- If successful, access the app at:
  - `http://localhost:19847`

## Updating the service after code changes
- Run:
  - `./install-service.sh`
- This rebuilds, redeploys, and restarts the service.

## Service management
- Status:
  - `sudo systemctl status credential-manager`
- Start:
  - `sudo systemctl start credential-manager`
- Stop:
  - `sudo systemctl stop credential-manager`
- Restart:
  - `sudo systemctl restart credential-manager`
- Enable auto-start on boot:
  - `sudo systemctl enable credential-manager`
- Disable auto-start:
  - `sudo systemctl disable credential-manager`
- Follow logs:
  - `sudo journalctl -u credential-manager -f`

## Troubleshooting
- View recent logs:
  - `sudo journalctl -u credential-manager -n 50`
- Verify the app builds:
  - `npm run build`
- Try running production start manually:
  - `npm run start:production`
- Confirm paths and user in `credential-manager.service` are correct (`User`, `WorkingDirectory`, `PATH`, `ExecStart`)
- If you update the service file directly in `/etc/systemd/system`, run:
  - `sudo systemctl daemon-reload`
  - `sudo systemctl restart credential-manager`

## Uninstalling
- Stop and disable:
  - `sudo systemctl stop credential-manager`
  - `sudo systemctl disable credential-manager`
- Remove service file:
  - `sudo rm /etc/systemd/system/credential-manager.service`
- Reload systemd:
  - `sudo systemctl daemon-reload`

## Customization
- Change the port:
  - Edit `PORT` in `credential-manager.service` (`Environment=PORT=xxxx`) and optionally scripts in `package.json`
- Change user and working directory:
  - Update `User` and `WorkingDirectory` to the appropriate account and repository dir
- Node/npm path:
  - Ensure `PATH` points to a Node installation accessible to systemd. If Node is globally installed (e.g., `/usr/bin/node`), you can omit `PATH` or set a simpler one.
- Service name:
  - If you rename the service unit file, adjust commands accordingly (replace `credential-manager` with your service name).

## Security hardening
- Least-privilege user: Run the service under a dedicated system user without shell or home directory
- File permissions:
  - Restrict write permissions on service file and app directory to the service user/admins
- Network constraints:
  - Consider firewall rules if exposing beyond localhost
- systemd sandboxing (optional):
  - Add settings such as `ProtectSystem=strict`, `ProtectHome=true`, `PrivateTmp=true`, `NoNewPrivileges=true`, `RestrictAddressFamilies=AF_INET,AF_INET6`, etc., after testing compatibility.

## Verification checklist
- `systemctl status credential-manager` shows “active (running)”
- `curl http://localhost:19847` returns the app page
- `sudo journalctl -u credential-manager` shows healthy logs
- After reboot, the service comes up automatically

## Why this approach
- systemd gives reliable process supervision, autostart, logging, and consistency across Linux distributions with minimal runtime dependencies.
- Keeping the installation idempotent via `install-service.sh` makes updates simple and less error-prone.

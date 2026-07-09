# syntax=docker/dockerfile:1
###############################################################################
# Production image — TeddyBearClinic (static game + Credly certificate PHP)
#
# Tech stack : main app = static client-side game (jQuery + custom JS in js/,
#              index.html, audio/img/video incl. the TBC3.mp4 splash). The only
#              server-side code is certificate/ — a Credly digital-badge
#              integration (giveYourselfCredit.php etc.) + SaveData.php. No
#              database, no Composer. Several certificate/*.php use legacy `<?`
#              short tags -> short_open_tag is enabled below.
# Web server : Apache (php:8.3-apache) so certificate/.htaccess (the Shibboleth
#              <Files giveYourselfCredit.php> guard) is honored.
#
# Authentication: Shibboleth protects certificate/giveYourselfCredit.php
#   (reads $_SERVER mail/nickname/sn), enforced at the ingress / reverse proxy
#   (Ansible-managed). The `<IfModule mod_shib>` guard is inert without mod_shib.
#   The dev-only mock lives under .ddev/ and is excluded.
#
#   Credly API credentials + the badging service account are NOT baked in — they
#   are read from runtime environment variables (see .env.production.example):
#   CREDLY_API_KEY/SECRET/ACCESS_TOKEN/APP_ID and CREDLY_ACCOUNT_EMAIL/PASSWORD.
#   No secrets in the image.
#
# Runs non-root (www-data) on unprivileged port 8080.
###############################################################################
FROM php:8.3-apache

# --- Apache modules the app's .htaccess needs ---
RUN set -eux; \
    a2enmod rewrite headers

# --- Legacy certificate/*.php use PHP short-open tags (<? ... ?>) ---
RUN set -eux; \
    printf 'short_open_tag = On\n' > /usr/local/etc/php/conf.d/zzz-app.ini

# --- Run as a non-root user on an unprivileged port (8080) ---
RUN set -eux; \
    sed -ri 's/^Listen 80$/Listen 8080/' /etc/apache2/ports.conf; \
    sed -ri 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf

# --- Security hardening (suppress server tokens/signature, TRACE, ETag) ---
RUN set -eux; \
    { \
      echo 'ServerTokens Prod'; \
      echo 'ServerSignature Off'; \
      echo 'TraceEnable Off'; \
      echo 'FileETag None'; \
    } > /etc/apache2/conf-available/zzz-hardening.conf; \
    a2enconf zzz-hardening

# --- Docroot policy: parse .htaccess (AllowOverride All) for the Shibboleth
#     guard; no dir listing; pass the Credly runtime env vars through to PHP;
#     log to stdout/stderr ---
RUN set -eux; \
    { \
      echo '<Directory /var/www/html>'; \
      echo '    Options -Indexes +FollowSymLinks'; \
      echo '    AllowOverride All'; \
      echo '    Require all granted'; \
      echo '</Directory>'; \
      echo 'PassEnv CREDLY_API_DOMAIN CREDLY_API_KEY CREDLY_API_SECRET CREDLY_ACCESS_TOKEN CREDLY_APP_ID CREDLY_ACCOUNT_EMAIL CREDLY_ACCOUNT_PASSWORD'; \
      echo 'ErrorLog /dev/stderr'; \
      echo 'CustomLog /dev/stdout combined'; \
    } > /etc/apache2/conf-available/zzz-docroot.conf; \
    a2enconf zzz-docroot

# --- Application code. .dockerignore excludes .ddev/, .git/, .env*, Dockerfile,
#     the secret-bearing certificate/credly_bak.php backup, dev scripts
#     (getText.py, say.sh), the raw source assets and OS junk. ---
COPY --chown=www-data:www-data . /var/www/html/

# --- Permissions: read-only app tree owned by www-data. certificate/SaveData.php
#     appends players to a hardcoded absolute path outside the docroot; create it
#     writable (mount a volume there in production for persistence). NOTE: the
#     hardcoded /home/tltsecure/... path is a portability issue flagged for the
#     Azure migration (should be relative / env-driven). ---
RUN set -eux; \
    find /var/www/html -type d -exec chmod 0755 {} +; \
    find /var/www/html -type f -exec chmod 0644 {} +; \
    mkdir -p /home/tltsecure/apache2/htdocs/userData/TeddyBearClinic; \
    chown -R www-data:www-data /home/tltsecure/apache2/htdocs/userData; \
    chmod -R 0775 /home/tltsecure/apache2/htdocs/userData; \
    chown -R www-data:www-data /var/run/apache2 /var/log/apache2 /var/lock; \
    chmod -R g=u /var/run/apache2 /var/log/apache2 /var/lock

USER www-data
EXPOSE 8080
VOLUME ["/home/tltsecure/apache2/htdocs/userData/TeddyBearClinic"]

# php:apache base CMD = apache2-foreground

<?php
/**
 * Hardened local-dev Shibboleth authentication simulation for TeddyBearClinic.
 *
 * WHY: production runs Apache + mod_shib, which populates $_SERVER['mail'|'nickname'|
 * 'sn'|'cn']. DDEV has no mod_shib, so certificate/giveYourselfCredit.php (Shib-gated;
 * reads mail/nickname/sn) would see no identity. This seeds dummy attributes.
 *
 * SECURITY (see memory: shibboleth-dev-bypass-hardened-pattern):
 *   1. FENCED OFF — lives under .ddev/, wired via .ddev/php/dev.ini auto_prepend_file.
 *      Neither path is in the deployable tree, so it cannot run on the Azure servers.
 *   2. FAIL CLOSED — gated on an explicit, server-set APP_ENV that defaults to
 *      "production". Unless APP_ENV is local/development this is an immediate no-op.
 *   3. NON-DESTRUCTIVE — only fills attributes that are ABSENT.
 *   4. NO REAL CREDENTIALS — dummy values only, overridable via MOCK_* env vars.
 */

$appEnv = getenv('APP_ENV');
if ($appEnv === false || $appEnv === '') {
    $appEnv = $_SERVER['APP_ENV'] ?? 'production';
}
if (!in_array(strtolower($appEnv), ['local', 'development', 'dev'], true)) {
    return; // production / unknown -> do nothing, real Shibboleth is in charge
}

$mock = [
    'cn'       => getenv('MOCK_CN')       ?: 'teststudent',
    'mail'     => getenv('MOCK_MAIL')     ?: 'teststudent@stonybrook.edu',
    'nickname' => getenv('MOCK_NICKNAME') ?: 'Test',
    'sn'       => getenv('MOCK_SN')       ?: 'Student',
];
foreach ($mock as $key => $value) {
    if (empty($_SERVER[$key])) {
        $_SERVER[$key] = $value;
    }
}

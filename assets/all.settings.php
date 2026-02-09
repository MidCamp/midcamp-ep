<?php
/**
 * @file
 * amazee.io Drupal all environment configuration file.
 *
 * This file should contain all settings.php configurations that are needed by all environments.
 *
 * It contains some defaults that the amazee.io team suggests, please edit them as required.
 */

// Defines where the sync folder of your configuration lives. In this case it's inside
// the Drupal root, which is protected by amazee.io Nginx configs, so it cannot be read
// via the browser. If your Drupal root is inside a subfolder (like 'web') you can put the config
// folder outside this subfolder for an advanced security measure: '../config/sync'.
$settings['config_sync_directory'] = '../config/sync';

// Config splits configuration.
// Enable local split in DDEV, dev split on non-prod Lagoon environments, and prod split on prod.
if (getenv('IS_DDEV_PROJECT') === 'true') {
  // Local DDEV environment: enable local split, disable dev and prod.
  $config['config_split.config_split.local']['status'] = TRUE;
  $config['config_split.config_split.dev']['status'] = FALSE;
  $config['config_split.config_split.prod']['status'] = FALSE;
} elseif (getenv('LAGOON')) {
  if (getenv('LAGOON_ENVIRONMENT_TYPE') === 'production') {
    // Production environment: enable prod split, disable dev and local.
    $config['config_split.config_split.prod']['status'] = TRUE;
    $config['config_split.config_split.dev']['status'] = FALSE;
    $config['config_split.config_split.local']['status'] = FALSE;
  } else {
    // All other Lagoon environments (dev, staging, etc.): enable dev split, disable prod and local.
    $config['config_split.config_split.dev']['status'] = TRUE;
    $config['config_split.config_split.prod']['status'] = FALSE;
    $config['config_split.config_split.local']['status'] = FALSE;
  }
}

if (getenv('LAGOON_ENVIRONMENT_TYPE') !== 'main') {
    /**
     * Skip file system permissions hardening.
     *
     * The system module will periodically check the permissions of your site's
     * site directory to ensure that it is not writable by the website user. For
     * sites that are managed with a version control system, this can cause problems
     * when files in that directory such as settings.php are updated, because the
     * user pulling in the changes won't have permissions to modify files in the
     * directory.
     */
    $settings['skip_permissions_hardening'] = TRUE;
}

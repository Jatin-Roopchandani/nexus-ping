import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { Client as PgClient, Notification } from 'pg';
import nodemailer from 'nodemailer';

// Environment variables with validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
// EMAIL_TO removed

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('❌ SUPABASE_URL environment variable is not set');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  process.exit(1);
}

console.log('🔧 Initializing Supabase client...');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Initialize email transporter
let emailTransporter: nodemailer.Transporter | null = null;
if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) { // EMAIL_TO removed from check
  emailTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  console.log('📧 Email notifications enabled');
} else {
  console.log('⚠️ Email notifications disabled - missing email configuration');
}

interface Monitor {
  id: string;
  name: string;
  url: string;
  check_frequency: number;
  timeout: number;
  expected_status_code: number;
  is_active: boolean;
  ssl_check_enabled: boolean;
  created_at: string;
  updated_at: string;
  email_notifications: boolean;
  user_id: string; // <-- add user_id
}

// Helper to fetch user email
async function getUserEmail(user_id: string): Promise<string | null> {
  if (!user_id) return null;
  const { data: user, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', user_id)
    .single();
  if (error) {
    log(`❌ Failed to fetch user email for user_id ${user_id}: ${error.message}`, 'error');
    return null;
  }
  if (!user?.email) {
    log(`⚠️ No email found for user_id ${user_id}`, 'warn');
    return null;
  }
  return user.email;
}

// Email notification function with throttling
async function sendEmailNotification(monitor: Monitor, incidentType: string, errorMessage: string) {
  if (!emailTransporter) {
    log('📧 Email notification skipped - email not configured', 'debug');
    return;
  }

  if (!monitor.email_notifications) {
    log(`📧 Email notification skipped for ${monitor.name} - notifications disabled`, 'debug');
    return;
  }

  // Fetch user email from users table
  const userEmail = await getUserEmail(monitor.user_id);
  if (!userEmail) {
    log(`⚠️ Skipping email notification for ${monitor.name} - user email not found`, 'warn');
    return;
  }

  try {
    // Check if we should throttle this notification
    const { data: lastNotification, error: fetchError } = await supabase
      .from('incidents')
      .select('last_notified_at')
      .eq('monitor_id', monitor.id)
      .eq('type', incidentType)
      .eq('status', 'active')
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      log(`❌ Error checking last notification time: ${fetchError.message}`, 'error');
      return;
    }

    const now = new Date();
    const throttleHours = 4; // Send notification only once every 4 hours
    const throttleMs = throttleHours * 60 * 60 * 1000;

    if (lastNotification?.last_notified_at) {
      const lastNotified = new Date(lastNotification.last_notified_at);
      const timeSinceLastNotification = now.getTime() - lastNotified.getTime();
      
      if (timeSinceLastNotification < throttleMs) {
        const remainingHours = Math.ceil((throttleMs - timeSinceLastNotification) / (60 * 60 * 1000));
        log(`📧 Email notification throttled for ${monitor.name} - last sent ${Math.floor(timeSinceLastNotification / (60 * 60 * 1000))}h ago, will send again in ~${remainingHours}h`, 'debug');
        return;
      }
    }

    // Send the email
    const emailSubject = `🚨 Website Down Alert: ${monitor.name}`;
    const emailBody = `
      <h2>🚨 Website Monitoring Alert</h2>
      <p><strong>Website:</strong> ${monitor.name}</p>
      <p><strong>URL:</strong> <a href="${monitor.url}">${monitor.url}</a></p>
      <p><strong>Status:</strong> ${incidentType.toUpperCase()}</p>
      <p><strong>Error:</strong> ${errorMessage}</p>
      <p><strong>Time:</strong> ${now.toISOString()}</p>
      <hr>
      <p><em>This notification is throttled to once every ${throttleHours} hours to avoid spam.</em></p>
    `;

    const mailOptions = {
      from: EMAIL_FROM,
      to: userEmail,
      subject: emailSubject,
      html: emailBody,
    };

    await emailTransporter.sendMail(mailOptions);
    log(`📧 Email notification sent for ${monitor.name} to ${userEmail}`, 'info');

    // Update the last_notified_at timestamp
    const { error: updateError } = await supabase
      .from('incidents')
      .update({ last_notified_at: now.toISOString() })
      .eq('monitor_id', monitor.id)
      .eq('type', incidentType)
      .eq('status', 'active')
      .is('resolved_at', null);

    if (updateError) {
      log(`❌ Failed to update last_notified_at for ${monitor.name}: ${updateError.message}`, 'error');
    }

  } catch (emailError: any) {
    log(`❌ Failed to send email notification for ${monitor.name}: ${emailError.message}`, 'error');
  }
}

// Send recovery notification
async function sendRecoveryNotification(monitor: Monitor, durationMinutes: number) {
  if (!emailTransporter) {
    log('📧 Recovery email notification skipped - email not configured', 'debug');
    return;
  }

  if (!monitor.email_notifications) {
    log(`📧 Recovery email notification skipped for ${monitor.name} - notifications disabled`, 'debug');
    return;
  }

  // Fetch user email from users table
  const userEmail = await getUserEmail(monitor.user_id);
  if (!userEmail) {
    log(`⚠️ Skipping recovery email notification for ${monitor.name} - user email not found`, 'warn');
    return;
  }

  try {
    const emailSubject = `✅ Website Recovery: ${monitor.name}`;
    const emailBody = `
      <h2>✅ Website Recovery Alert</h2>
      <p><strong>Website:</strong> ${monitor.name}</p>
      <p><strong>URL:</strong> <a href="${monitor.url}">${monitor.url}</a></p>
      <p><strong>Status:</strong> ONLINE</p>
      <p><strong>Downtime Duration:</strong> ${durationMinutes} minutes</p>
      <p><strong>Recovery Time:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p><em>Your website is now back online!</em></p>
    `;

    const mailOptions = {
      from: EMAIL_FROM,
      to: userEmail,
      subject: emailSubject,
      html: emailBody,
    };

    await emailTransporter.sendMail(mailOptions);
    log(`📧 Recovery email notification sent for ${monitor.name} to ${userEmail}`, 'info');

  } catch (emailError: any) {
    log(`❌ Failed to send recovery email notification for ${monitor.name}: ${emailError.message}`, 'error');
  }
}

// Enhanced logging function
function log(message: string, level: 'info' | 'error' | 'warn' | 'debug' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    error: '❌',
    warn: '⚠️',
    debug: '🐛'
  }[level];
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// Global error handler
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  log(`Stack trace: ${error.stack}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

async function checkMonitor(monitor: Monitor) {
  const start = Date.now();
  let status: string = 'offline';
  let response_time: number | null = null;
  let status_code: number | null = null;
  let error_message: string | null = null;

  log(`🔍 Checking monitor: ${monitor.name} (${monitor.url})`, 'info');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    log(`⏰ Timeout reached for ${monitor.name} (${monitor.timeout}s)`, 'warn');
    controller.abort();
  }, monitor.timeout * 1000);

  try {
    log(`📡 Making HTTP request to: ${monitor.url}`, 'debug');
    
    const response = await fetch(monitor.url, { 
      method: 'GET', 
      signal: controller.signal,
      headers: {
        'User-Agent': 'UptimeMonitor/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    response_time = Date.now() - start;
    status_code = response.status;
    
    log(`📊 Response received for ${monitor.name}: Status ${status_code}, Time: ${response_time}ms`, 'debug');
    
    if (response.status === monitor.expected_status_code) {
      status = 'online';
      log(`✅ ${monitor.name} is ONLINE (Status: ${status_code}, Response Time: ${response_time}ms)`, 'info');

      // Incident resolution logic
      try {
        // Find all active incidents for this monitor (any type) that are not resolved
        const { data: activeIncidents, error: fetchActiveError } = await supabase
          .from('incidents')
          .select('id, started_at')
          .eq('monitor_id', monitor.id)
          .eq('status', 'active')
          .is('resolved_at', null);

        if (activeIncidents && activeIncidents.length > 0) {
          const now = new Date();
          for (const incident of activeIncidents) {
            const startedAt = new Date(incident.started_at);
            const durationMs = now.getTime() - startedAt.getTime();
            const durationMinutes = Math.round(durationMs / 60000);
            const { error: updateError } = await supabase
              .from('incidents')
              .update({
                resolved_at: now.toISOString(),
                status: 'Resolved',
                duration_minutes: durationMinutes,
              })
              .eq('id', incident.id);
            if (updateError) {
              log(`❌ Failed to resolve incident ${incident.id} for ${monitor.name}: ${updateError.message}`, 'error');
            } else {
              log(`✅ Incident ${incident.id} resolved for ${monitor.name}`, 'info');
              
              // Send recovery notification
              await sendRecoveryNotification(monitor, durationMinutes);
            }
          }
        }
      } catch (resolveError: any) {
        log(`❌ Error while resolving incidents for ${monitor.name}: ${resolveError.message}`, 'error');
      }
    } else {
      
      status = 'status_code_error';
      error_message = `Expected ${monitor.expected_status_code}, got ${response.status}`;
      log(`⚠️ ${monitor.name} has STATUS CODE ERROR: ${error_message}`, 'warn');
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    response_time = Date.now() - start;
    
    if (err.name === 'AbortError') {
      status = 'timeout';
      error_message = `Request timed out after ${monitor.timeout} seconds`;
      log(`⏰ ${monitor.name} TIMEOUT: ${error_message}`, 'warn');
    } else {
      status = 'offline';
      error_message = err.message;
      log(`❌ ${monitor.name} is OFFLINE: ${error_message}`, 'error');
    }
  }

  // Insert into monitor_checks with error handling
  try {
    log(`💾 Saving check result for ${monitor.name} to database...`, 'debug');
    
    const { data, error } = await supabase.from('monitor_checks').insert([
      {
        monitor_id: monitor.id,
        status,
        response_time,
        status_code,
        error_message,
        checked_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      log(`❌ Database error for ${monitor.name}: ${error.message}`, 'error');
      log(`Database details: ${JSON.stringify(error)}`, 'debug');
    } else {
      log(`✅ Check result saved for ${monitor.name}`, 'debug');
    }
  } catch (dbError: any) {
    log(`❌ Failed to save check result for ${monitor.name}: ${dbError.message}`, 'error');
  }

  // Only log an incident if the monitor is not online
  if (status !== 'online') {
    try {
      // Check for existing active incident (optional, for deduplication)
      const { data: existingIncidents, error: fetchError } = await supabase
        .from('incidents')
        .select('id')
        .eq('monitor_id', monitor.id)
        .eq('type', status)
        .eq('status', 'active')
        .is('resolved_at', null);

      if (!existingIncidents || existingIncidents.length === 0) {
        // No active incident, insert a new one
        const { error: incidentError } = await supabase.from('incidents').insert([
          {
            monitor_id: monitor.id,
            name: monitor.name, // Add website name
            url: monitor.url,   // Add website URL
            type: status,
            status: 'active',
            started_at: new Date().toISOString(),
            resolved_at: null,
            duration_minutes: null,
            description: error_message || 'Incident detected',
            created_at: new Date().toISOString(),
          },
        ]);
        if (incidentError) {
          log(`❌ Failed to log incident for ${monitor.name}: ${incidentError.message}`, 'error');
        } else {
          log(`🚨 Incident logged for ${monitor.name} (${status})`, 'warn');
          
          // Send email notification for new incident
          await sendEmailNotification(monitor, status, error_message || 'Website is down');
        }
      }
    } catch (incidentCatchError: any) {
      log(`❌ Error while checking/inserting incident: ${incidentCatchError.message}`, 'error');
    }
  }
}

// Track running monitor loops
const monitorLoops: Record<string, NodeJS.Timeout> = {};

function startMonitorLoop(monitor: Monitor) {
  log(`🚀 Starting monitor loop for: ${monitor.name} (${monitor.url})`, 'info');
  log(`⏱️ Check frequency: ${monitor.check_frequency} seconds`, 'debug');
  log(`⏰ Timeout: ${monitor.timeout} seconds`, 'debug');
  log(`🎯 Expected status code: ${monitor.expected_status_code}`, 'debug');

  const run = async () => {
    try {
      await checkMonitor(monitor);
    } catch (error: any) {
      log(`❌ Error in monitor loop for ${monitor.name}: ${error.message}`, 'error');
    }
    // Schedule next check
    monitorLoops[monitor.id] = setTimeout(run, monitor.check_frequency * 1000);
  };
  // Start the first check immediately
  run();
}

function stopMonitorLoop(monitorId: string) {
  if (monitorLoops[monitorId]) {
    clearTimeout(monitorLoops[monitorId]);
    delete monitorLoops[monitorId];
    log(`🛑 Stopped monitoring for monitor_id: ${monitorId}`, 'info');
  }
}

// --- Listen for new monitors via Postgres NOTIFY ---
async function listenForNewMonitors() {
  const pgUrl = process.env.DATABASE_URL;
  if (!pgUrl) {
    log('❌ DATABASE_URL environment variable is not set for Postgres NOTIFY listener', 'error');
    return;
  }
  const pgClient = new PgClient({ connectionString: pgUrl });
  await pgClient.connect();
  await pgClient.query('LISTEN new_monitor');
  log('🔔 Listening for new_monitor notifications from Postgres...', 'info');

  pgClient.on('notification', async (msg: Notification) => {
    if (msg.channel === 'new_monitor') {
      const monitorId = msg.payload;
      log(`🔔 Received new_monitor notification for monitor_id: ${monitorId}`, 'info');
      // Fetch the new monitor from Supabase
      const { data: monitor, error } = await supabase
        .from('monitors')
        .select('id, name, url, check_frequency, timeout, expected_status_code, is_active, ssl_check_enabled, created_at, updated_at, email_notifications, user_id')
        .eq('id', monitorId)
        .single();
      if (error || !monitor) {
        log(`❌ Failed to fetch new monitor with id ${monitorId}: ${error?.message}`, 'error');
        return;
      }
      // Start monitoring the new monitor
      startMonitorLoop(monitor);
      log(`✅ Started monitoring new monitor: ${monitor.name} (${monitor.url})`, 'info');
    }
  });

  pgClient.on('error', (err: Error) => {
    log(`❌ Postgres NOTIFY listener error: ${err.message}`, 'error');
  });
}

// --- Listen for deleted monitors via Postgres NOTIFY ---
async function listenForDeletedMonitors() {
  const pgUrl = process.env.DATABASE_URL;
  if (!pgUrl) {
    log('❌ DATABASE_URL environment variable is not set for Postgres NOTIFY listener', 'error');
    return;
  }
  const pgClient = new PgClient({ connectionString: pgUrl });
  await pgClient.connect();
  await pgClient.query('LISTEN monitor_deleted');
  log('🔔 Listening for monitor_deleted notifications from Postgres...', 'info');

  pgClient.on('notification', async (msg: Notification) => {
    if (msg.channel === 'monitor_deleted') {
      const monitorId = msg.payload;
      if (monitorId) stopMonitorLoop(monitorId);
    }
  });

  pgClient.on('error', (err: Error) => {
    log(`❌ Postgres NOTIFY listener error: ${err.message}`, 'error');
  });
}

// --- Listen for monitor updates via Postgres NOTIFY ---
async function listenForUpdatedMonitors() {
  const pgUrl = process.env.DATABASE_URL;
  if (!pgUrl) {
    log('❌ DATABASE_URL environment variable is not set for Postgres NOTIFY listener', 'error');
    return;
  }
  const pgClient = new PgClient({ connectionString: pgUrl });
  await pgClient.connect();
  await pgClient.query('LISTEN monitor_updated');
  log('🔔 Listening for monitor_updated notifications from Postgres...', 'info');

  pgClient.on('notification', async (msg: Notification) => {
    if (msg.channel === 'monitor_updated') {
      const monitorId = msg.payload;
      if (!monitorId) return;
      log(`🔄 Received monitor_updated notification for monitor_id: ${monitorId}`, 'info');
      // Fetch the updated monitor from Supabase
      const { data: monitor, error } = await supabase
        .from('monitors')
        .select('id, name, url, check_frequency, timeout, expected_status_code, is_active, ssl_check_enabled, created_at, updated_at, email_notifications, user_id')
        .eq('id', monitorId)
        .single();
      if (error || !monitor) {
        log(`❌ Failed to fetch updated monitor with id ${monitorId}: ${error?.message}`, 'error');
        return;
      }
      // Restart the monitor loop with new settings
      stopMonitorLoop(monitorId);
      if (monitor.is_active) {
        startMonitorLoop(monitor);
        log(`✅ Restarted monitor loop for updated monitor: ${monitor.name} (${monitor.url})`, 'info');
      } else {
        log(`🛑 Monitor ${monitor.name} is not active, not restarting loop.`, 'info');
      }
    }
  });

  pgClient.on('error', (err: Error) => {
    log(`❌ Postgres NOTIFY listener error: ${err.message}`, 'error');
  });
}

// Start the application
async function main() {
  // Start listening for new monitors
  listenForNewMonitors().catch((err) => {
    log(`❌ Failed to start Postgres NOTIFY listener: ${err.message}`, 'error');
  });

  // Start listening for deleted monitors
  listenForDeletedMonitors().catch((err) => {
    log(`❌ Failed to start Postgres monitor_deleted NOTIFY listener: ${err.message}`, 'error');
  });

  // Start listening for updated monitors
  listenForUpdatedMonitors().catch((err) => {
    log(`❌ Failed to start Postgres monitor_updated NOTIFY listener: ${err.message}`, 'error');
  });
}


main().catch((error) => {
  log(`❌ Failed to start monitor service: ${error.message}`, 'error');
  process.exit(1);
});
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
// Environment variables with validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
// Enhanced logging function
function log(message, level = 'info') {
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
async function checkMonitor(monitor) {
    const start = Date.now();
    let status = 'offline';
    let response_time = null;
    let status_code = null;
    let error_message = null;
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
        }
        else {
            status = 'status_code_error';
            error_message = `Expected ${monitor.expected_status_code}, got ${response.status}`;
            log(`⚠️ ${monitor.name} has STATUS CODE ERROR: ${error_message}`, 'warn');
        }
    }
    catch (err) {
        clearTimeout(timeoutId);
        response_time = Date.now() - start;
        if (err.name === 'AbortError') {
            status = 'timeout';
            error_message = `Request timed out after ${monitor.timeout} seconds`;
            log(`⏰ ${monitor.name} TIMEOUT: ${error_message}`, 'warn');
        }
        else {
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
        }
        else {
            log(`✅ Check result saved for ${monitor.name}`, 'debug');
        }
    }
    catch (dbError) {
        log(`❌ Failed to save check result for ${monitor.name}: ${dbError.message}`, 'error');
    }
}
async function startMonitorLoop(monitor) {
    log(`🚀 Starting monitor loop for: ${monitor.name} (${monitor.url})`, 'info');
    log(`⏱️ Check frequency: ${monitor.check_frequency} seconds`, 'debug');
    log(`⏰ Timeout: ${monitor.timeout} seconds`, 'debug');
    log(`🎯 Expected status code: ${monitor.expected_status_code}`, 'debug');
    const run = async () => {
        try {
            await checkMonitor(monitor);
        }
        catch (error) {
            log(`❌ Error in monitor loop for ${monitor.name}: ${error.message}`, 'error');
        }
        // Schedule next check
        setTimeout(run, monitor.check_frequency * 1000);
    };
    // Start the first check immediately
    run();
}
async function main() {
    log('🚀 Starting Uptime Monitor Service...', 'info');
    log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`, 'debug');
    log(`📅 Start time: ${new Date().toISOString()}`, 'info');
    try {
        log('📡 Fetching active monitors from database...', 'info');
        // Fetch all active monitors with their full schema
        const { data: monitors, error } = await supabase
            .from('monitors')
            .select('id, name, url, check_frequency, timeout, expected_status_code, is_active, ssl_check_enabled, created_at, updated_at, email_notifications')
            .eq('is_active', true);
        if (error) {
            log(`❌ Database error while fetching monitors: ${error.message}`, 'error');
            log(`Database details: ${JSON.stringify(error)}`, 'debug');
            process.exit(1);
        }
        if (!monitors || monitors.length === 0) {
            log('⚠️ No active monitors found in database', 'warn');
            log('💡 Add some monitors through your dashboard to start monitoring', 'info');
            return;
        }
        log(`✅ Found ${monitors.length} active monitor(s)`, 'info');
        // Log monitor details for debugging
        monitors.forEach((monitor, index) => {
            log(`📋 Monitor ${index + 1}: ${monitor.name}`, 'debug');
            log(`   URL: ${monitor.url}`, 'debug');
            log(`   Frequency: ${monitor.check_frequency}s`, 'debug');
            log(`   Timeout: ${monitor.timeout}s`, 'debug');
        });
        // Start monitoring loops for each monitor
        for (const monitor of monitors) {
            try {
                startMonitorLoop(monitor);
                log(`✅ Started monitoring ${monitor.name} (${monitor.url}) every ${monitor.check_frequency} seconds`, 'info');
            }
            catch (error) {
                log(`❌ Failed to start monitoring for ${monitor.name}: ${error.message}`, 'error');
            }
        }
        log('🎉 All monitors started successfully!', 'info');
        log('💡 Monitor will continue running in the background...', 'info');
        log('📊 Check logs for real-time monitoring status', 'info');
    }
    catch (error) {
        log(`❌ Critical error in main function: ${error.message}`, 'error');
        log(`Stack trace: ${error.stack}`, 'error');
        process.exit(1);
    }
}
// Graceful shutdown handling
process.on('SIGINT', () => {
    log('🛑 Received SIGINT, shutting down gracefully...', 'info');
    process.exit(0);
});
process.on('SIGTERM', () => {
    log('🛑 Received SIGTERM, shutting down gracefully...', 'info');
    process.exit(0);
});
// Start the application
main().catch((error) => {
    log(`❌ Failed to start monitor service: ${error.message}`, 'error');
    process.exit(1);
});
//# sourceMappingURL=monitor.js.map
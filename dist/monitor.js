"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var node_fetch_1 = require("node-fetch");
var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
function checkMonitor(monitor) {
    return __awaiter(this, void 0, void 0, function () {
        var start, status, response_time, status_code, error_message, controller, timeoutId, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    status = 'offline';
                    response_time = null;
                    status_code = null;
                    error_message = null;
                    controller = new AbortController();
                    timeoutId = setTimeout(function () { return controller.abort(); }, monitor.timeout * 1000);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(monitor.url, { method: 'GET', signal: controller.signal })];
                case 2:
                    response = _a.sent();
                    clearTimeout(timeoutId);
                    response_time = Date.now() - start;
                    status_code = response.status;
                    if (response.status === monitor.expected_status_code) {
                        status = 'online';
                    }
                    else {
                        status = 'status_code_error';
                        error_message = "Expected ".concat(monitor.expected_status_code, ", got ").concat(response.status);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    clearTimeout(timeoutId);
                    response_time = Date.now() - start;
                    status = err_1.name === 'AbortError' ? 'timeout' : 'offline';
                    error_message = err_1.message;
                    return [3 /*break*/, 4];
                case 4: 
                // Insert into monitor_checks
                return [4 /*yield*/, supabase.from('monitor_checks').insert([
                        {
                            monitor_id: monitor.id,
                            status: status,
                            response_time: response_time,
                            status_code: status_code,
                            error_message: error_message,
                            checked_at: new Date().toISOString(),
                        },
                    ])];
                case 5:
                    // Insert into monitor_checks
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function startMonitorLoop(monitor) {
    return __awaiter(this, void 0, void 0, function () {
        var run;
        var _this = this;
        return __generator(this, function (_a) {
            run = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, checkMonitor(monitor)];
                        case 1:
                            _a.sent();
                            setTimeout(run, monitor.check_frequency * 1000);
                            return [2 /*return*/];
                    }
                });
            }); };
            run();
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, monitors, error, _i, _b, monitor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('monitors')
                        .select('id, url, timeout, expected_status_code, check_frequency')
                        .eq('is_active', true)];
                case 1:
                    _a = _c.sent(), monitors = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error fetching monitors:', error);
                        process.exit(1);
                    }
                    if (!monitors || monitors.length === 0) {
                        console.log('No monitors found.');
                        return [2 /*return*/];
                    }
                    for (_i = 0, _b = monitors; _i < _b.length; _i++) {
                        monitor = _b[_i];
                        startMonitorLoop(monitor);
                        console.log("Started monitoring ".concat(monitor.url, " every ").concat(monitor.check_frequency, " seconds"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();

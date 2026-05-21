import { CheckCircle2, Users, Gauge, AlertTriangle, XCircle, Clock } from "lucide-react";

const logs = [
  { timestamp: "2023-10-27 14:22:01", eventId: "#EF-9021", status: "SUCCESS", desc: "SSL_CERT_RENEWAL_COMPLETED", agent: "CRON_DAEMON" },
  { timestamp: "2023-10-27 14:19:45", eventId: "#ERR-4001", status: "ERROR", desc: "UNAUTHORIZED_ACCESS_ATTEMPT_BLOCKED", agent: "FIREWALL_V4" },
  { timestamp: "2023-10-27 14:15:10", eventId: "#EF-8820", status: "SUCCESS", desc: "AUTO_SCALE_UP_NODE_GROUP_B", agent: "K8S_MANAGER" },
  { timestamp: "2023-10-27 13:55:22", eventId: "#WARN-892", status: "WARNING", desc: "HIGH_CPU_USAGE_DETECTION_NODE_04", agent: "MONITOR_V2" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">System Overview</h1>
          <div className="flex items-center text-xs text-success font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-success mr-2"></span>
            Node_01: Operational
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-border text-white text-sm uppercase tracking-wider hover:bg-bgSecondary transition-colors">
            Export Report
          </button>
          <button className="px-6 py-2 bg-white text-bgPrimary font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors">
            New Deployment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bgSecondary border border-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6 text-textSecondary text-xs uppercase tracking-widest">
            <span>Uptime_Metric</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-white mb-2">99.9%</div>
            <div className="text-xs text-success tracking-wider">+0.02% Since Last Boot</div>
          </div>
        </div>

        <div className="bg-bgSecondary border border-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6 text-textSecondary text-xs uppercase tracking-widest">
            <span>Session_Count</span>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-white mb-2">1,240</div>
            <div className="text-xs text-textSecondary tracking-wider uppercase">Active Connections</div>
          </div>
        </div>

        <div className="bg-bgSecondary border border-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6 text-textSecondary text-xs uppercase tracking-widest">
            <span>Load_Factor</span>
            <Gauge className="w-5 h-5 text-accentRed" />
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-white mb-2">57%</div>
            {/* Progress bar visual */}
            <div className="w-full h-1 bg-border mt-3 relative">
              <div className="absolute top-0 left-0 h-full bg-accentRed" style={{ width: "57%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-bgSecondary border border-border">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-sm font-bold text-textSecondary uppercase tracking-widest">Recent System Logs</h2>
          <div className="flex gap-4 text-xs text-textSecondary uppercase tracking-wider">
            <span>Filter: All</span>
            <span className="hover:text-white cursor-pointer transition-colors">Clear Buffer</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-textSecondary uppercase tracking-widest border-b border-border bg-bgPrimary/50">
              <tr>
                <th className="px-6 py-4 font-normal">Timestamp</th>
                <th className="px-6 py-4 font-normal">Event_ID</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Description</th>
                <th className="px-6 py-4 font-normal text-right">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-bgCard/50 transition-colors">
                  <td className="px-6 py-4 text-textSecondary font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 text-white font-mono text-xs">{log.eventId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      log.status === "SUCCESS" ? "text-success border-success/30 bg-success/10" :
                      log.status === "ERROR" ? "text-accentRed border-accentRed/30 bg-accentRed/10" :
                      "text-warning border-warning/30 bg-warning/10"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-textSecondary text-xs">{log.desc}</td>
                  <td className="px-6 py-4 text-textSecondary text-xs text-right uppercase tracking-wider">{log.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border text-center">
          <button className="text-xs text-textSecondary hover:text-white uppercase tracking-widest transition-colors">
            Load Full Log Stream
          </button>
        </div>
      </div>
    </div>
  );
}

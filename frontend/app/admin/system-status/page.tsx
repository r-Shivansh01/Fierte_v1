"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Network, Database, Cloud } from "lucide-react";

const maintenanceLogs = [
  {
    eventId: "#MN-8842",
    node: "DB_CLUSTER_01",
    desc: "Scheduled kernel patch and node restart.",
    time: "2023-11-24 04:00",
    operator: "SYS_AUTO",
    impact: "ZERO",
    isError: false
  },
  {
    eventId: "#MN-8841",
    node: "CDN_EDGE_PROX",
    desc: "SSL Certificate rotation across 42 endpoints.",
    time: "2023-11-23 22:15",
    operator: "ADMIN_JL",
    impact: "ZERO",
    isError: false
  },
  {
    eventId: "#MN-8840",
    node: "AUTH_CORE_V2",
    desc: "Emergency hotfix: CVE-2023-4421 security patch.",
    time: "2023-11-23 18:42",
    operator: "SEC_ALRT",
    impact: "LOW",
    isError: true
  }
];

export default function SystemStatus() {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['adminHealthMetrics'],
    queryFn: async () => {
      const response = await api.get('/admin/health-metrics');
      return response.data;
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] text-textSecondary uppercase tracking-widest font-mono text-sm animate-pulse">
        CONNECTING_TO_CORE_SERVICES...
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] text-accentRed uppercase tracking-widest font-mono text-sm">
        ERROR_FETCHING_SYSTEM_METRICS
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">SYSTEM_STATUS_v3.2</h1>
            <div className="flex items-center text-xs font-bold tracking-widest uppercase font-mono">
              <span className={`w-2 h-2 rounded-full mr-2 ${metrics.overall_status === 'ALL_SERVICES_OPERATIONAL' ? 'bg-success' : 'bg-accentRed'}`}></span>
              <span className={metrics.overall_status === 'ALL_SERVICES_OPERATIONAL' ? 'text-success' : 'text-accentRed'}>{metrics.overall_status}</span>
              <span className="text-textSecondary mx-2">/</span>
              <span className="text-white">UPTIME: 99.998%</span>
              <span className="text-textSecondary mx-2">/</span>
              <span className="text-white">REGION: AWS_US_EAST_1</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-border text-white text-sm uppercase tracking-wider hover:bg-bgSecondary transition-colors font-bold">
              REFRESH_METRICS
            </button>
            <button className="px-6 py-2 bg-white text-bgPrimary font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors">
              GENERATE_REPORT
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* API Gateway */}
          <div className={`bg-bgSecondary border p-6 relative overflow-hidden group ${metrics.api_gateway.status === 'HEALTHY' ? 'border-border' : 'border-accentRed/50 shadow-[0_0_15px_rgba(255,32,32,0.1)]'}`}>
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${metrics.api_gateway.status === 'HEALTHY' ? 'text-success border-success/30 bg-success/10' : 'text-accentRed border-accentRed/30 bg-accentRed/10'}`}>
                {metrics.api_gateway.status}
              </span>
            </div>
            <div className="mb-6"><Network className={`w-6 h-6 ${metrics.api_gateway.status === 'HEALTHY' ? 'text-white' : 'text-accentRed'}`} /></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">API_GATEWAY</h3>
            <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
              <div className="flex justify-between text-textSecondary">
                <span>LATENCY:</span>
                <span className="text-white">{metrics.api_gateway.latency}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>THROUGHPUT:</span>
                <span className="text-white">{metrics.api_gateway.throughput}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>ERRORS:</span>
                <span className="text-white">{metrics.api_gateway.errors}</span>
              </div>
            </div>
          </div>

          {/* Database Clusters */}
          <div className={`bg-bgSecondary border p-6 relative overflow-hidden group ${metrics.database.status === 'HEALTHY' ? 'border-border' : 'border-accentRed/50 shadow-[0_0_15px_rgba(255,32,32,0.1)]'}`}>
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${metrics.database.status === 'HEALTHY' ? 'text-success border-success/30 bg-success/10' : 'text-accentRed border-accentRed/30 bg-accentRed/10'}`}>
                {metrics.database.status}
              </span>
            </div>
            <div className="mb-6"><Database className={`w-6 h-6 ${metrics.database.status === 'HEALTHY' ? 'text-white' : 'text-accentRed'}`} /></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">DATABASE_CLUSTERS</h3>
            <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
              <div className="flex justify-between text-textSecondary">
                <span>CPU_LOAD:</span>
                <span className="text-white">{metrics.database.cpu_load}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>CONNECTIONS:</span>
                <span className="text-white">{metrics.database.connections}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>REPLICATION:</span>
                <span className={metrics.database.replication === 'SYNCED' ? 'text-success' : 'text-accentRed'}>{metrics.database.replication}</span>
              </div>
            </div>
          </div>

          {/* Storage S3 */}
          <div className={`bg-bgSecondary border p-6 relative overflow-hidden group ${metrics.storage.status === 'HEALTHY' ? 'border-border' : 'border-accentRed/50 shadow-[0_0_15px_rgba(255,32,32,0.1)]'}`}>
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${metrics.storage.status === 'HEALTHY' ? 'text-success border-success/30 bg-success/10' : 'text-accentRed border-accentRed/30 bg-accentRed/10'}`}>
                {metrics.storage.status}
              </span>
            </div>
            <div className="mb-6"><Cloud className={`w-6 h-6 ${metrics.storage.status === 'HEALTHY' ? 'text-white' : 'text-accentRed'}`} /></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">STORAGE_S3</h3>
            <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
              <div className="flex justify-between text-textSecondary">
                <span>IOPS:</span>
                <span className="text-white">{metrics.storage.iops}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>UTILIZATION:</span>
                <span className="text-white">{metrics.storage.utilization}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>PENDING_JOBS:</span>
                <span className={metrics.storage.status === 'HEALTHY' ? 'text-white' : 'text-accentRed font-bold'}>{metrics.storage.pending_jobs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Logs Table */}
        <div className="bg-bgSecondary border border-border">
          <div className="flex justify-between items-center p-4 border-b border-border text-xs uppercase tracking-widest font-mono">
            <h2 className="font-bold text-textSecondary">MAINTENANCE_LOG_RECORDS</h2>
            <div className="flex gap-4 text-textSecondary">
              <span className="cursor-pointer hover:text-white transition-colors">FILTER: [ALL_TYPES]</span>
              <span className="cursor-pointer hover:text-white transition-colors">EXPORT: [CSV/JSON]</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-textSecondary uppercase tracking-widest border-b border-border bg-bgPrimary/50">
                <tr>
                  <th className="px-6 py-4 font-normal">EVENT_ID</th>
                  <th className="px-6 py-4 font-normal">SERVICE_NODE</th>
                  <th className="px-6 py-4 font-normal">DESCRIPTION</th>
                  <th className="px-6 py-4 font-normal">TIMESTAMP_UTC</th>
                  <th className="px-6 py-4 font-normal">OPERATOR</th>
                  <th className="px-6 py-4 font-normal text-right">IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {maintenanceLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-bgCard/50 transition-colors">
                    <td className="px-6 py-4 text-white font-mono text-xs">{log.eventId}</td>
                    <td className="px-6 py-4 text-textSecondary font-mono text-xs uppercase">{log.node}</td>
                    <td className={`px-6 py-4 text-xs font-mono ${log.isError ? 'text-accentRed' : 'text-white'}`}>
                      {log.desc}
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-mono text-xs">
                      {log.time.split(' ')[0]}<br/>{log.time.split(' ')[1]}
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-mono text-xs uppercase">{log.operator}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                        log.impact === "ZERO" 
                          ? "text-textSecondary border-border" 
                          : "text-accentRed border-accentRed/30 bg-accentRed/10"
                      }`}>
                        {log.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="flex justify-between items-end pt-8 mt-8 border-t border-border">
        <div className="flex gap-12 font-mono uppercase tracking-widest">
          <div>
            <div className="text-[10px] text-textSecondary mb-2 font-bold">TOTAL_REQS_24H</div>
            <div className="text-2xl font-bold text-white">{metrics.total_requests.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] text-textSecondary mb-2 font-bold">P99_LATENCY</div>
            <div className="text-2xl font-bold text-white">{metrics.latency_ms}ms</div>
          </div>
          <div>
            <div className="text-[10px] text-textSecondary mb-2 font-bold">ACTIVE_NODES</div>
            <div className="text-2xl font-bold text-success">{metrics.active_nodes.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="text-xs font-mono uppercase tracking-widest flex items-center">
          <span className="text-textSecondary mr-3">LAST_SYNC: 14:48:02 UTC</span>
          <span className="flex items-center text-success font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-success mr-2"></span>
            CONNECTED_SECURE
          </span>
        </div>
      </div>
    </div>
  );
}

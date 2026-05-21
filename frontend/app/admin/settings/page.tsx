import { User as UserIcon, Shield } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-white tracking-wide mb-3">System Configuration</h1>
          <p className="text-sm text-textSecondary font-mono max-w-3xl leading-relaxed">
            Manage your administrative profile, security protocols, and global environmental preferences for the FIERTE ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Profile */}
          <div className="bg-transparent border border-border p-8">
            <div className="flex items-center gap-3 mb-8 text-xs font-bold text-white uppercase tracking-widest">
              <UserIcon className="w-4 h-4" />
              Admin Profile
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest block font-bold">Administrator_ID</label>
                  <input 
                    type="text" 
                    defaultValue="FIERTE_USR_9921" 
                    readOnly
                    className="w-full bg-bgSecondary border border-border text-sm text-textSecondary px-4 py-3 focus:outline-none cursor-not-allowed font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-textSecondary uppercase tracking-widest block font-bold">Display_Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    className="w-full bg-transparent border border-border text-sm text-white px-4 py-3 focus:outline-none focus:border-textSecondary transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-textSecondary uppercase tracking-widest block font-bold">Primary_Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@fierte.internal" 
                  className="w-full bg-transparent border border-border text-sm text-white px-4 py-3 focus:outline-none focus:border-textSecondary transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-textSecondary uppercase tracking-widest block font-bold">System_Bio</label>
                <textarea 
                  rows={4}
                  defaultValue="Lead technical architect for the core data cluster."
                  className="w-full bg-transparent border border-border text-sm text-white px-4 py-3 focus:outline-none focus:border-textSecondary transition-colors font-mono resize-none"
                />
              </div>

              <div className="pt-4">
                <button type="button" className="px-6 py-3 bg-white text-bgPrimary font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors w-full sm:w-auto">
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Protocols */}
          <div className="bg-transparent border border-border p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8 text-xs font-bold text-white uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                Security Protocols
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 group-hover:text-success transition-colors">Enable_2FA</h3>
                    <p className="text-xs text-textSecondary font-mono">Require biometric verification for login.</p>
                  </div>
                  <button className="w-12 h-6 bg-white flex items-center px-1">
                    <div className="w-4 h-4 bg-bgPrimary translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 group-hover:text-success transition-colors">Log_Active_Sessions</h3>
                    <p className="text-xs text-textSecondary font-mono">Store IP and device metadata for 30 days.</p>
                  </div>
                  <button className="w-12 h-6 bg-white flex items-center px-1">
                    <div className="w-4 h-4 bg-bgPrimary translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 group-hover:text-accentRed transition-colors">Restrict_SSH_Access</h3>
                    <p className="text-xs text-textSecondary font-mono">Block non-VPN authorized connections.</p>
                  </div>
                  <button className="w-12 h-6 bg-bgSecondary border border-border flex items-center px-1">
                    <div className="w-4 h-4 bg-border transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-12">
              <button className="px-6 py-3 border border-border text-white text-sm uppercase tracking-wider hover:bg-bgSecondary transition-colors font-bold">
                Update Keys
              </button>
              <button className="px-6 py-3 border border-accentRed/30 text-accentRed text-sm uppercase tracking-wider hover:bg-accentRed/10 transition-colors font-bold">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-border text-xs font-mono uppercase tracking-widest text-textSecondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-success font-bold">
            <span className="w-2 h-2 rounded-full bg-success mr-2"></span>
            All Systems Operational
          </div>
          <span>Latency: 14ms</span>
        </div>
        <div>
          FIERTE_CORE v1.2.4-STABLE | © 2024 FIERTE INDUSTRIAL SOLUTIONS
        </div>
      </div>
    </div>
  );
}

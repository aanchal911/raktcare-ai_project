import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredFamilyMembers, saveFamilyMembers, CAN_RECEIVE_FROM } from "../data/donors";
import { FamilyMember, BloodGroup, EmergencyRequest } from "../types";
import { Heart, ShieldAlert, Plus, Trash2, Search, BellRing, Sparkles, UserCheck } from "lucide-react";

interface FamilyVaultProps {
  onSelectSearchGroup: (group: BloodGroup) => void;
  onAddEmergencyRequest: (req: EmergencyRequest) => void;
  onTransitionToTab: (tab: string) => void;
}

export function FamilyVault({ onSelectSearchGroup, onAddEmergencyRequest, onTransitionToTab }: FamilyVaultProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: "",
    bloodGroup: "O+",
    age: 30,
    relationship: "Father",
    medicalNotes: "",
    emergencyContact: ""
  });

  const relationships: FamilyMember["relationship"][] = [
    "Father", "Mother", "Brother", "Sister", "Spouse", "Child", "Other"
  ];

  useEffect(() => {
    setMembers(getStoredFamilyMembers());
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.emergencyContact) return;

    const created: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newMember.name,
      bloodGroup: newMember.bloodGroup as BloodGroup,
      age: Number(newMember.age) || 30,
      relationship: newMember.relationship as FamilyMember["relationship"],
      medicalNotes: newMember.medicalNotes,
      emergencyContact: newMember.emergencyContact
    };

    const updated = [...members, created];
    setMembers(updated);
    saveFamilyMembers(updated);
    setShowAddForm(false);
    setNewMember({
      name: "",
      bloodGroup: "O+",
      age: 30,
      relationship: "Father",
      medicalNotes: "",
      emergencyContact: ""
    });
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveFamilyMembers(updated);
  };

  const triggerOneClickDonorSearch = (group: BloodGroup) => {
    onSelectSearchGroup(group);
    onTransitionToTab("search");
  };

  const triggerOneClickEmergency = (member: FamilyMember) => {
    const matchedCount = 3; // simulated initial match count
    
    const emergency: EmergencyRequest = {
      id: `req-fam-${Date.now()}`,
      patientName: `${member.name} (${member.relationship})`,
      bloodGroup: member.bloodGroup,
      hospital: "Charutar Arogya Mandal Hospital, Anand",
      urgency: "Critical (Immediate)",
      unitsNeeded: 2,
      timestamp: new Date().toISOString(),
      status: "Pending"
    };

    onAddEmergencyRequest(emergency);
    onTransitionToTab("requests");
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6">
      
      {/* Structural Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500/10" />
          <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">Family Emergency Vault</h2>
        </div>
        <button
          id="btn-toggle-add-family"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 text-xs font-mono bg-red-650/10 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          SECURE FILES
        </button>
      </div>

      {/* Brief descriptive concept summary */}
      <p className="text-xs text-slate-300">
        In critical medical moments, navigation delays cost lives. Secure your relatives' basic blood datasets here for instantaneous biocombat checks or direct broadcasts to regional registries.
      </p>

      {/* Add Family Member Dialog Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddMember}
          className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-4"
        >
          <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            Declare Relative Health Record
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Input Name */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">NAME</label>
              <input
                id="input-family-name"
                type="text"
                required
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="e.g. Sanjay Patel"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Input Relationship */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">RELATIONSHIP</label>
              <select
                id="select-family-relation"
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all"
              >
                {relationships.map((rel) => (
                  <option key={rel} value={rel} className="bg-black text-white">{rel}</option>
                ))}
              </select>
            </div>

            {/* Input Blood Group */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">BLOOD GROUP</label>
              <select
                id="select-family-blood"
                value={newMember.bloodGroup}
                onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value as BloodGroup })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all"
              >
                {Object.keys(CAN_RECEIVE_FROM).map((g) => (
                  <option key={g} value={g} className="bg-black text-white">{g}</option>
                ))}
              </select>
            </div>

            {/* Input Age */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">AGE (YRS)</label>
              <input
                id="input-family-age"
                type="number"
                min="1"
                max="120"
                required
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">PRIMARY SOS PHONE</label>
              <input
                id="input-family-sos"
                type="text"
                required
                placeholder="+91 98250 55667"
                value={newMember.emergencyContact}
                onChange={(e) => setNewMember({ ...newMember, emergencyContact: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Extra Medical notes */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">MEDICAL COMPLAINTS/NOTES</label>
              <input
                id="input-family-notes"
                type="text"
                placeholder="Anemia, Diabetic, Hypertension, etc."
                value={newMember.medicalNotes}
                onChange={(e) => setNewMember({ ...newMember, medicalNotes: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 text-xs font-mono pt-2">
            <button
              id="btn-cancel-add-family"
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-white/10 bg-white/5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-family-member"
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer font-bold shadow-lg"
            >
              Protect Record
            </button>
          </div>
        </motion.form>
      )}

      {/* Grid of Registered Relatives cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout text-muted-foreground">
          {members.length > 0 ? (
            members.map((member) => {
              const matches = CAN_RECEIVE_FROM[member.bloodGroup] || [];

              return (
                <motion.div
                  key={member.id}
                  layoutId={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:border-red-550/30 hover:bg-white/10 transition-all duration-300 relative group overflow-hidden shadow-md"
                >
                  {/* Subtle red indicator light */}
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

                  <div>
                    {/* Visual details */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">
                          {member.relationship}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 mt-0.5 leading-none">
                          {member.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          SOS Phone: {member.emergencyContact}
                        </span>
                      </div>

                      {/* Large Circular blood element */}
                      <div className="w-10 h-10 rounded-xl bg-red-650/10 border border-red-500/20 text-red-400 flex items-center justify-center font-extrabold text-sm tracking-tight">
                        {member.bloodGroup}
                      </div>
                    </div>

                    {/* Compact notes */}
                    <p className="text-[11px] text-slate-355 mt-3 italic line-clamp-1">
                      {member.medicalNotes ? `Note: ${member.medicalNotes}` : "No historic medical notes provided."}
                    </p>

                    {/* Biological Compatibility mini-bar */}
                    <div className="mt-3 bg-black/40 border border-white/5 p-2 rounded-xl text-[10px] font-mono text-slate-450">
                      <span>Matches: {matches.length} compatible types:</span>
                      <div className="flex flex-wrap gap-1 mt-1 font-bold text-green-455">
                        {matches.map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                    
                    {/* Find Matching Donors action */}
                    <button
                      id={`btn-fam-search-donors-${member.id}`}
                      onClick={() => triggerOneClickDonorSearch(member.bloodGroup)}
                      className="flex-1 py-1.5 px-2 text-[10px] font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-slate-200 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-red-500" />
                      FIND DONORS
                    </button>

                    {/* Urgent SOS alert creation */}
                    <button
                      id={`btn-fam-sos-${member.id}`}
                      onClick={() => triggerOneClickEmergency(member)}
                      className="flex-1 py-1.5 px-2 text-[10px] font-mono font-bold bg-red-600 hover:bg-red-500 border border-red-900/10 text-white rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <BellRing className="w-3 h-3 animate-pulse" />
                      SOS REQUEST
                    </button>

                    {/* Delete action */}
                    <button
                      id={`btn-fam-delete-${member.id}`}
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Erase records from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="col-span-3 border border-dashed border-white/15 bg-white/5 rounded-2xl p-8 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                Vault Empty & Decoupled
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No family health records registered. Click the "SECURE FILES" button to log critical records for instant, offline diagnostics.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

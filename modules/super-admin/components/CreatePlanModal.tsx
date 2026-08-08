"use client";

import { useState } from "react";
import { CreatePlanDTO } from "../types/saas.types";
import { Plus, X } from "lucide-react";

interface CreatePlanModalProps {
  onSubmit: (dto: CreatePlanDTO) => Promise<void>;
  isLoading: boolean;
}

export function CreatePlanModal({ onSubmit, isLoading }: CreatePlanModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CreatePlanDTO>({
    name: "",
    code: "",
    description: "",
    maxStudents: 500,
    maxTeachers: 50,
    maxStorageGb: 10,
    features: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setIsOpen(false);
    setForm({
      name: "",
      code: "",
      description: "",
      maxStudents: 500,
      maxTeachers: 50,
      maxStorageGb: 10,
      features: [],
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
      >
        <Plus size={16} />
        Create SaaS Plan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create New Subscription Plan</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Tier"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENTERPRISE_2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    required
                    value={form.maxStudents}
                    onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Teachers</label>
                  <input
                    type="number"
                    required
                    value={form.maxTeachers}
                    onChange={(e) => setForm({ ...form, maxTeachers: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    value={form.maxStorageGb}
                    onChange={(e) => setForm({ ...form, maxStorageGb: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of plan limits and target school size..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

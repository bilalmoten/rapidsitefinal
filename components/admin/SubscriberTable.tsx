"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

interface SubscriberTableProps {
  initialSubscribers: Subscriber[];
}

export default function SubscriberTable({
  initialSubscribers,
}: SubscriberTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setSubscribers(
        subscribers.map((sub) =>
          sub.id === id ? { ...sub, status: newStatus } : sub
        )
      );
    } catch (err) {
      setError("Failed to update subscriber status");
      console.error("Error:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setSubscribers(subscribers.filter((sub) => sub.id !== id));
    } catch (err) {
      setError("Failed to delete subscriber");
      console.error("Error:", err);
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      inactive: "bg-amber-50 text-amber-700 border-amber-200",
      unsubscribed: "bg-rose-50 text-rose-700 border-rose-200",
    }[status];

    return (
      <span
        className={clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          styles
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-rose-50 text-rose-700 rounded border border-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={subscriber.status} />
                    <select
                      value={subscriber.status}
                      onChange={(e) =>
                        handleStatusChange(subscriber.id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subscriber.created_at).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="text-gray-400 hover:text-rose-600 transition-colors focus:outline-none"
                    title="Delete subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

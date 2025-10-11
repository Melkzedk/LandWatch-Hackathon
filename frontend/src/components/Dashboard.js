import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Dashboard.js
// Shows a logged-in user's saved land analyses from Supabase
// Dependencies: Bootstrap CSS must be included globally (e.g., import in index.js)

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadAnalyses() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          setAnalyses([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("land_analyses")
          .select("id, location_name, data, ai_report, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (mounted) setAnalyses(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load analyses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAnalyses();

    // optional: subscribe to realtime changes (insert/update/delete) for live updates
    // const subscription = supabase
    //   .channel('public:land_analyses')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'land_analyses' }, payload => {
    //     loadAnalyses();
    //   })
    //   .subscribe();

    return () => {
      mounted = false;
      // if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this analysis? This action cannot be undone.")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from("land_analyses").delete().eq("id", id);
      if (error) throw error;
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  function downloadReport(analysis) {
    // Create a text file containing the AI report + metadata and trigger download
    const reportText = [];
    reportText.push("LandWatch Analysis Report\n");
    reportText.push(`Location: ${analysis.location_name}\n`);
    reportText.push(`Created: ${new Date(analysis.created_at).toLocaleString()}\n\n`);
    reportText.push("=== AI Summary ===\n");
    reportText.push(analysis.ai_report || "(no ai report)");
    reportText.push("\n\n=== Raw Data (JSON) ===\n");
    reportText.push(JSON.stringify(analysis.data, null, 2));

    const blob = new Blob([reportText.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landwatch-report-${analysis.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Dashboard</h2>
        <div>
          <small className="text-muted">Your saved analyses</small>
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && analyses.length === 0 && (
        <div className="alert alert-info">No analyses yet — run a new analysis to see results here.</div>
      )}

      <div className="row">
        {analyses.map((a) => (
          <div className="col-md-6 col-lg-4 mb-4" key={a.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{a.location_name || "Unnamed location"}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{new Date(a.created_at).toLocaleString()}</h6>

                <p className="card-text" style={{ whiteSpace: "pre-wrap", flex: 1 }}>
                  {a.ai_report ? (a.ai_report.length > 250 ? a.ai_report.slice(0, 250) + "..." : a.ai_report) : "No AI summary available."}
                </p>

                <div className="mt-3 d-flex gap-2">
                  {/* View raw data - open in new tab as JSON */}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      const w = window.open();
                      w.document.write(`<pre>${JSON.stringify(a.data, null, 2)}</pre>`);
                    }}
                  >
                    View Data
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={() => downloadReport(a)}>
                    Download Report
                  </button>

                  <a
                    className="btn btn-outline-success btn-sm"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.openstreetmap.org/?mlat=${getLat(a)}&mlon=${getLon(a)}#map=13/${getLat(a)}/${getLon(a)}`}
                  >
                    View on Map
                  </a>

                  <button className="btn btn-danger btn-sm ms-auto" onClick={() => handleDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions to safely extract coordinates from stored analysis data.
// Adjust these based on the shape of your `data` JSON column.
function getLat(analysis) {
  try {
    // common shapes: analysis.data.center = { lat, lon } or analysis.data.coordinates = [lat, lon]
    if (!analysis || !analysis.data) return 0;
    if (analysis.data.center && (analysis.data.center.lat || analysis.data.center.latitude)) {
      return analysis.data.center.lat || analysis.data.center.latitude;
    }
    if (Array.isArray(analysis.data.coordinates) && analysis.data.coordinates.length >= 2) {
      return analysis.data.coordinates[0];
    }
    // fallback to nested fields
    if (analysis.data.lat) return analysis.data.lat;
    if (analysis.data.latitude) return analysis.data.latitude;
  } catch (err) {
    return 0;
  }
  return 0;
}

function getLon(analysis) {
  try {
    if (!analysis || !analysis.data) return 0;
    if (analysis.data.center && (analysis.data.center.lon || analysis.data.center.longitude)) {
      return analysis.data.center.lon || analysis.data.center.longitude;
    }
    if (Array.isArray(analysis.data.coordinates) && analysis.data.coordinates.length >= 2) {
      return analysis.data.coordinates[1];
    }
    if (analysis.data.lon) return analysis.data.lon;
    if (analysis.data.longitude) return analysis.data.longitude;
  } catch (err) {
    return 0;
  }
  return 0;
}

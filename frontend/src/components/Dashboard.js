import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Table, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [locationName, setLocationName] = useState("");
  const [soilData, setSoilData] = useState("");
  const [vegetation, setVegetation] = useState("");
  const [climate, setClimate] = useState("");

  useEffect(() => {
    fetchAnalyses();
  }, []);

  async function fetchAnalyses() {
    const { data, error } = await supabase.from("land_analyses").select("*");
    if (error) console.error(error);
    else setAnalyses(data);
  }

  // Send data to AI backend
  async function handleAIReport(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "test-user", // you can later replace this with supabase.auth.user().id
          location_name: locationName,
          soil_data: soilData,
          vegetation,
          climate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ AI report generated and saved successfully!");
        setLocationName("");
        setSoilData("");
        setVegetation("");
        setClimate("");
        fetchAnalyses();
      } else {
        setMessage("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="mb-3">Land Analyses Dashboard</h3>

      {/* AI Form Section */}
      <Form onSubmit={handleAIReport} className="mb-4">
        <h5>Generate New AI Report</h5>
        <Form.Group className="mb-2">
          <Form.Label>Location Name</Form.Label>
          <Form.Control
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Soil Data</Form.Label>
          <Form.Control
            type="text"
            value={soilData}
            onChange={(e) => setSoilData(e.target.value)}
            placeholder="e.g. Loamy soil, pH 6.3"
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Vegetation</Form.Label>
          <Form.Control
            type="text"
            value={vegetation}
            onChange={(e) => setVegetation(e.target.value)}
            placeholder="e.g. Sparse shrubs, moderate grass cover"
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Climate</Form.Label>
          <Form.Control
            type="text"
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            placeholder="e.g. Semi-arid, 28°C avg"
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Generating...
            </>
          ) : (
            "Generate AI Report"
          )}
        </Button>
      </Form>

      {message && <Alert variant="info">{message}</Alert>}

      <Button onClick={fetchAnalyses} variant="primary" className="mb-3">
        Refresh Table
      </Button>

      {/* Analysis Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>AI Report</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.location_name}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{a.ai_report}</td>
              <td>{new Date(a.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

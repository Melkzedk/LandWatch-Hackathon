import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Table,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  test,
} from "react-bootstrap";

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
    const { data, error } = await supabase
      .from("land_analyses")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error(error);
    else setAnalyses(data);
  }

  async function handleAIReport(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "test-user",
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
    <div className="container mt-4">
      <h3 className="mb-4 text-center">🌍 Land Analyses Dashboard</h3>

      <Row>
        {/* Left Side - AI Form */}
        <Col md={4}>
          <Card className="shadow-sm p-3 mb-4">
            <Card.Body>
              <h5 className="mb-3 text-success">Generate New AI Report</h5>
              <Form onSubmit={handleAIReport}>
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

                <div className="d-grid gap-2 mt-3">
                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Generating...
                      </>
                    ) : (
                      "Generate AI Report"
                    )}
                  </Button>
                </div>
              </Form>
              {message && <Alert variant="info" className="mt-3">{message}</Alert>}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side - Table */}
        <Col md={8}>
          <Card className="shadow-sm p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-primary">AI Reports</h5>
                <Button onClick={fetchAnalyses} variant="outline-primary" size="sm">
                  Refresh
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>AI Report</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.length > 0 ? (
                    analyses.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.location_name}</td>
                        <td style={{ whiteSpace: "pre-wrap" }}>{a.ai_report}</td>
                        <td>{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

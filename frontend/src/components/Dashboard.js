import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Table, Button } from 'react-bootstrap';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  async function fetchAnalyses() {
    const { data, error } = await supabase.from('land_analyses').select('*');
    if (error) console.error(error);
    else setAnalyses(data);
  }

  return (
    <div>
      <h3 className="mb-3">Land Analyses Dashboard</h3>
      <Button onClick={fetchAnalyses} variant="primary" className="mb-3">Refresh</Button>
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
          {analyses.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.location_name}</td>
              <td>{a.ai_report}</td>
              <td>{new Date(a.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

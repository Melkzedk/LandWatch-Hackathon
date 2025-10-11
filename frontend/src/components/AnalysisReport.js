import React from 'react';
import { Card } from 'react-bootstrap';

export default function AnalysisReport({ report }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{report.location}</Card.Title>
        <Card.Text>{report.summary}</Card.Text>
        <Card.Text><strong>AI Insights:</strong> {report.aiInsights}</Card.Text>
      </Card.Body>
    </Card>
  );
}

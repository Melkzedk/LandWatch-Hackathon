import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage('Signup successful! Please verify your email.');
      setTimeout(() => navigate('/login'), 2000);
    }
    else{ setMessage('Signup successful! Please verify your email.');}
  }

  return (
    <div className="col-md-6 mx-auto">
      <h3>SignUp</h3>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </Form.Group>
        <Button type="submit" variant="primary">Signup</Button>
      </Form>
    </div>
  );
}

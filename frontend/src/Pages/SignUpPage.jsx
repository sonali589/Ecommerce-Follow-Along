import React from 'react';
import Navbar from '../components/Navbar';
import Signup from "../components/auth/Signup";

function SignUpPage() {
  return (
    <div>
      <Navbar />
      <div>
        <Signup />
      </div>
    </div>
  );
}

export default SignUpPage;
import React from "react";
import { PaystackButton } from "react-paystack";

function GPtable({ cgpa, gpa, componentProps }) {
  return (
    <div class="gp_table">
      <div>
        <div>
          <p>Current GPA:</p>
          <h3>{gpa ? gpa : 0}</h3>
        </div>
        <div>
          <p>Cummulative GPA:</p>
          <h3>{cgpa ? cgpa : 0}</h3>
        </div>
      </div>
      <div class="transcript_button">
        <button onClick={() => window.print()}>Print statement</button>
        <PaystackButton {...componentProps} />
      </div>
    </div>
  );
}

export default GPtable;

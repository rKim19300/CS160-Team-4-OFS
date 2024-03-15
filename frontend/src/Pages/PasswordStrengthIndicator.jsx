import React from "react";

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    {
      label: "Uppercase",
      condition: /[A-Z]/.test(password),
    },
    {
      label: "Special Characters",
      condition: /[@$!%*?&]/.test(password),
    },
    {
      label: "Lowercase",
      condition: /[a-z]/.test(password),
    },
    {
      label: "Eight in Length",
      condition: password.length >= 8,
    },
    {
      label: "Number",
      condition: /\d/.test(password),
    },
  ];

  return (
    <div>
      {requirements.map((req, index) => (
        <div key={index} style={{ color: req.condition ? "green" : "red" }}>
          {req.label}
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthIndicator;

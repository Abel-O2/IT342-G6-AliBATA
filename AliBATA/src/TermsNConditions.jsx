import { Box, Typography } from "@mui/material";

const TermsNConditions = () => {
  return (
    <Box
      sx={{
        maxHeight: "600px", 
        overflowY: "auto",
        bgcolor: "#1A1A1A",
        padding: 2,
        borderRadius: 2,
        fontSize: "14px",
        color: "#BDBDBD",
        textAlign: "left",
        border: "1px solid #333",
      }}
    >
      <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
        Terms & Conditions
      </Typography>
      <Typography variant="body2">
        Welcome to <strong>AliBATA</strong>! These Terms and Conditions outline the rules for using our services. By accessing this website or using our services, you accept these terms in full.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>1. Definitions</strong><br />
        "Company" refers to AliBATA.<br />
        "User" refers to anyone using our services.<br />
        "Service" refers to the products and services offered by AliBATA.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>2. Use of Our Services</strong><br />
        You must be at least 13 years old or have parental/guardian consent.<br />
        You agree not to use our services for illegal or unauthorized purposes.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>3. User Accounts & Personal Information</strong><br />
        You may need an account to access certain features.<br />
        We collect personal info such as email, password, and name.<br />
        You are responsible for maintaining the security of your account.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>4. Intellectual Property</strong><br />
        All content is owned by AliBATA and protected by intellectual property laws.<br />
        You may not reproduce, distribute, or modify any content without permission.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>5. Privacy Policy</strong><br />
        Our Privacy Policy explains how we handle your data.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>6. Limitation of Liability</strong><br />
        We do not guarantee that our services will be error-free.<br />
        We are not liable for any indirect or incidental damages.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>7. Termination</strong><br />
        We may suspend or terminate accounts that violate these terms.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>8. Governing Law</strong><br />
        These terms are governed by the laws of imomama.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>9. Changes to These Terms</strong><br />
        We may update these terms from time to time.
      </Typography>
      <br />
      <Typography variant="body2">
        <strong>10. Contact Us</strong><br />
        If you have any questions, contact us at AliBATA_Dev@gmail.com.
      </Typography>
      <br />
      <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
        By using our services, you agree to these Terms & Conditions.
      </Typography>
    </Box>
  );
};

export default TermsNConditions;
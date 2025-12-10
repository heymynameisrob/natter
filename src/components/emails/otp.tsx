import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  otp?: string;
}

export function OTPEmail({ otp = "123456" }: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Login to App</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verification Code</Heading>
          <Text style={text}>
            Please use the following One-Time Password (OTP) to complete your verification:
          </Text>
          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>
          <Text style={text}>
            This code will expire in 10 minutes. Please do not share this code with anyone.
          </Text>
          <Text style={footer}>If you didn't request this code, please ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
  padding: "0 40px",
};

const otpContainer = {
  background: "#f4f4f4",
  borderRadius: "8px",
  margin: "32px auto",
  padding: "24px",
  width: "fit-content",
};

const otpText = {
  color: "#000",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  textAlign: "center" as const,
  margin: "0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
  padding: "0 40px",
  marginTop: "32px",
};

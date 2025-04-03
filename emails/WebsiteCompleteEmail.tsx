import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Img,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface WebsiteCompleteEmailProps {
  email: string;
  websiteName: string;
  websiteUrl: string;
  dashboardUrl: string;
}

export const WebsiteCompleteEmail = ({
  email,
  websiteName,
  websiteUrl,
  dashboardUrl,
}: WebsiteCompleteEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Your website "{websiteName}" is now ready! - RapidSite Pro Generation
      Complete
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://rapidai.website/logo.png"
            width="150"
            height="40"
            alt="RapidSite"
            style={logo}
          />
        </Section>

        {/* Hero Section */}
        <Section style={heroSection}>
          <Heading style={heroHeading}>Your Website is Ready!</Heading>
          <Text style={heroText}>
            We're excited to let you know that your website has been
            successfully generated.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={text}>Hi there,</Text>
          <Text style={text}>
            Great news! Your website <strong>"{websiteName}"</strong> has been
            successfully created using our Claude 3.7 Sonnet model. The Pro Chat
            mode has delivered a high-quality website designed to meet your
            specific requirements.
          </Text>

          {/* Website Preview */}
          <Section style={previewSection}>
            <Text style={previewHeader}>Website Details:</Text>
            <Text style={detailText}>
              <strong>Name:</strong> {websiteName}
            </Text>
            <Text style={detailText}>
              <strong>Status:</strong> Live
            </Text>
            <Text style={detailText}>
              <strong>Generation Mode:</strong> Pro (Claude 3.7 Sonnet)
            </Text>
          </Section>

          {/* CTA Buttons */}
          <Section style={ctaSection}>
            <Button style={primaryButton} href={websiteUrl}>
              View Your Website
            </Button>
            <Button style={secondaryButton} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            You can further customize your website from your dashboard. If you
            need any assistance or have questions, feel free to reach out to our
            support team.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Next Steps */}
        <Section style={tipsSection}>
          <Heading style={tipsHeading}>Next Steps</Heading>
          <Text style={tipText}>
            <strong>1. Customize Your Content</strong> - Review all pages and
            update content to perfectly match your needs
          </Text>
          <Text style={tipText}>
            <strong>2. Add Your Domain</strong> - Connect your custom domain for
            a professional web presence
          </Text>
          <Text style={tipText}>
            <strong>3. Share Your Site</strong> - Promote your new website on
            social media and other channels
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 RapidSite. All rights reserved.
          </Text>
          <Text style={footerText}>
            If you have any questions, contact us at support@rapidai.website
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const heroSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  marginBottom: "16px",
};

const heroHeading = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
  padding: "0",
};

const heroText = {
  color: "#444444",
  fontSize: "20px",
  lineHeight: "28px",
  margin: "0",
};

const contentSection = {
  padding: "32px 48px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  marginBottom: "16px",
};

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const divider = {
  borderColor: "#e6ebf1",
  margin: "16px 0",
};

const previewSection = {
  padding: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  margin: "24px 0",
};

const previewHeader = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#333",
  margin: "0 0 16px 0",
};

const detailText = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "8px 0",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const primaryButton = {
  backgroundColor: "#3B82F6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 16px",
  margin: "0 0 16px 0",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  borderRadius: "6px",
  color: "#3B82F6",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 16px",
  margin: "0",
  border: "1px solid #3B82F6",
};

const tipsSection = {
  padding: "32px 48px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  marginBottom: "16px",
};

const tipsHeading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
  padding: "0",
};

const tipText = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "12px 0",
};

const footer = {
  padding: "0 48px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

export default WebsiteCompleteEmail;

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

interface WelcomeEmailProps {
  email: string;
}

export const WelcomeEmail = ({ email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to AI Website Builder - Let's create something amazing together!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://aiwebsitebuilder.tech/logo.png"
            width="150"
            height="40"
            alt="AI Website Builder"
            style={logo}
          />
        </Section>

        {/* Hero Section */}
        <Section style={heroSection}>
          <Heading style={heroHeading}>Welcome to AI Website Builder!</Heading>
          <Text style={heroText}>
            We're thrilled to have you join our community of innovative
            creators.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={text}>Hi there,</Text>
          <Text style={text}>
            Thank you for subscribing to our newsletter! You're now part of a
            community that's revolutionizing the way websites are built using AI
            technology.
          </Text>

          {/* Features Grid */}
          <Section style={featuresGrid}>
            <Row>
              <Column style={featureColumn}>
                <Img
                  src="https://aiwebsitebuilder.tech/email-assets/feature-updates.png"
                  width="32"
                  height="32"
                  alt="Updates"
                  style={featureIcon}
                />
                <Text style={featureTitle}>Latest Updates</Text>
                <Text style={featureText}>
                  Be the first to know about new features and improvements
                </Text>
              </Column>
              <Column style={featureColumn}>
                <Img
                  src="https://aiwebsitebuilder.tech/email-assets/tips.png"
                  width="32"
                  height="32"
                  alt="Tips"
                  style={featureIcon}
                />
                <Text style={featureTitle}>Pro Tips</Text>
                <Text style={featureText}>
                  Get expert tips on web development and AI technology
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={featureColumn}>
                <Img
                  src="https://aiwebsitebuilder.tech/email-assets/community.png"
                  width="32"
                  height="32"
                  alt="Community"
                  style={featureIcon}
                />
                <Text style={featureTitle}>Community</Text>
                <Text style={featureText}>
                  Join discussions and share experiences with fellow creators
                </Text>
              </Column>
              <Column style={featureColumn}>
                <Img
                  src="https://aiwebsitebuilder.tech/email-assets/insights.png"
                  width="32"
                  height="32"
                  alt="Insights"
                  style={featureIcon}
                />
                <Text style={featureTitle}>Industry Insights</Text>
                <Text style={featureText}>
                  Stay informed about the latest trends in AI and web
                  development
                </Text>
              </Column>
            </Row>
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Button style={button} href="https://aiwebsitebuilder.tech/blog">
              Explore Our Blog
            </Button>
          </Section>

          {/* Social Links */}
          <Section style={socialSection}>
            <Text style={socialText}>Follow us on social media:</Text>
            <Row>
              <Column style={socialColumn}>
                <Link
                  href="https://twitter.com/aiwebbuilder"
                  style={socialLink}
                >
                  Twitter
                </Link>
              </Column>
              <Column style={socialColumn}>
                <Link
                  href="https://linkedin.com/company/aiwebbuilder"
                  style={socialLink}
                >
                  LinkedIn
                </Link>
              </Column>
              <Column style={socialColumn}>
                <Link href="https://github.com/aiwebbuilder" style={socialLink}>
                  GitHub
                </Link>
              </Column>
            </Row>
          </Section>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            You're receiving this email because you subscribed to updates from
            AI Website Builder.
          </Text>
          <Text style={footerText}>
            © 2024 AI Website Builder. All rights reserved.
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
};

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const featuresGrid = {
  padding: "32px 0",
};

const featureColumn = {
  padding: "16px",
  textAlign: "center" as const,
};

const featureIcon = {
  margin: "0 auto 16px",
};

const featureTitle = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "8px 0",
};

const featureText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const ctaSection = {
  padding: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#007AFF",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
  margin: "0 auto",
};

const socialSection = {
  padding: "32px 0",
  textAlign: "center" as const,
};

const socialText = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 16px",
};

const socialColumn = {
  padding: "0 8px",
};

const socialLink = {
  color: "#007AFF",
  textDecoration: "none",
};

const divider = {
  borderTop: "1px solid #e6ebf1",
  margin: "32px 0",
};

const footer = {
  padding: "0 48px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "8px 0",
};

export default WelcomeEmail;

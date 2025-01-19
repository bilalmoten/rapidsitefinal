import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Link,
  Heading,
} from "@react-email/components";

interface WelcomeEmailProps {
  email: string;
}

export const WelcomeEmail = ({ email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to AI Website Builder Newsletter</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to AI Website Builder!</Heading>
        <Text style={text}>
          Thank you for subscribing to our newsletter. We're excited to share
          the latest updates in AI-powered web development with you.
        </Text>
        <Text style={text}>
          You'll receive updates about:
          <ul>
            <li>New features and improvements</li>
            <li>Tips and tricks for web development</li>
            <li>AI technology insights</li>
            <li>Industry news and trends</li>
          </ul>
        </Text>
        <Text style={text}>
          Visit our <Link href="https://yourwebsite.com/blog">blog</Link> for
          more great content!
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

export default WelcomeEmail;

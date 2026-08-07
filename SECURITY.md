# Security Policy

## Supported Versions

We currently support the latest production version of Dubai Fans API with security updates.

| Version | Supported |
| ------- | --------- |
| Latest  | :white_check_mark: |
| Older versions | :x: |

## Reporting a Vulnerability

If you discover a security vulnerability in Dubai Fans API, please report it privately.

Please do not disclose the vulnerability publicly through GitHub Issues or other public channels.

### How to Report

Report security vulnerabilities to:

**Email:** info@mtuaefans.sbs

Please include the following information:

- A clear description of the vulnerability
- The affected endpoint, component, or feature
- Steps to reproduce the issue
- Potential security impact
- Any proof-of-concept or relevant technical details
- Screenshots or logs, if relevant

### Response

We will review valid security reports and take appropriate action based on their severity.

We will make reasonable efforts to:

1. Confirm receipt of the report.
2. Investigate and assess the reported vulnerability.
3. Determine the severity and potential impact.
4. Implement an appropriate security fix when necessary.
5. Deploy the fix to the production environment.
6. Notify the reporter when the issue has been addressed.

Please allow reasonable time for investigation, remediation, and deployment of a security fix before publicly disclosing the vulnerability.

## Security Best Practices

The Dubai Fans API implements security measures where applicable, including:

- Environment variables for sensitive credentials
- CORS restrictions
- Rate limiting
- reCAPTCHA protection
- Authentication and authorization
- Server-side input validation
- Database migrations
- Controlled database schema changes
- Production secrets kept outside the source repository
- Protected API endpoints
- Secure handling of user authentication data

## Sensitive Information

Never commit sensitive information to the repository, including:

- Database passwords
- API keys
- OpenAI API keys
- JWT secrets
- Session secrets
- SMTP passwords
- OAuth credentials
- Cloud storage credentials
- Production environment variables
- Private tokens

Use environment variables for all production secrets.

Example:

```env
DATABASE_URL=
OPENAI_API_KEY=
JWT_SECRET=
SESSION_SECRET=
SMTP_PASSWORD=

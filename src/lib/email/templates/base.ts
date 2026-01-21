/**
 * Base email template with Helder branding
 */

const BRAND_COLOR = '#93b9e6'
const DARK_COLOR = '#1a1a2e'
const SLATE_COLOR = '#64748b'

export function baseTemplate(content: string, previewText: string = '') {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Helder</title>
  ${previewText ? `<!--[if !mso]><!--><meta name="description" content="${previewText}"><!--<![endif]-->` : ''}
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: ${DARK_COLOR}; padding: 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: 2px; }
    .logo span { color: ${BRAND_COLOR}; }
    .content { padding: 40px 32px; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { font-size: 12px; color: ${SLATE_COLOR}; margin: 0; }
    .button { display: inline-block; padding: 16px 32px; background-color: ${DARK_COLOR}; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
    .button:hover { background-color: ${BRAND_COLOR}; }
    .highlight { color: ${BRAND_COLOR}; font-weight: 700; }
    h1 { color: ${DARK_COLOR}; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; }
    h2 { color: ${DARK_COLOR}; font-size: 20px; font-weight: 700; margin: 24px 0 12px 0; }
    p { color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; }
    .card { background-color: #f8fafc; border-left: 4px solid ${BRAND_COLOR}; padding: 16px 20px; margin: 24px 0; }
    .card-title { font-weight: 700; color: ${DARK_COLOR}; margin: 0 0 4px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .card-value { font-size: 24px; font-weight: 900; color: ${DARK_COLOR}; margin: 0; }
    .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .badge-success { background-color: #dcfce7; color: #16a34a; }
    .badge-warning { background-color: #fef3c7; color: #d97706; }
    .badge-info { background-color: #e0f2fe; color: #0284c7; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">HELDER<span>.</span></div>
    </div>
    
    <!-- Content -->
    <div class="content">
      ${content}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        © ${new Date().getFullYear()} Helder Woningbouw B.V. Alle rechten voorbehouden.
      </p>
      <p class="footer-text" style="margin-top: 8px;">
        Dit is een automatisch gegenereerde e-mail. Niet beantwoorden.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

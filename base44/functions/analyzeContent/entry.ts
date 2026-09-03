import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    risk_score: { type: 'number', description: 'Risk score from 0 to 100' },
    risk_level: { type: 'string', enum: ['low', 'suspicious', 'high'] },
    summary: { type: 'string', description: 'Short explanation of the risk assessment' },
    detected_warning_signs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] }
        }
      }
    },
    explanation: { type: 'string', description: 'Detailed explanation of why the score was assigned' },
    recommendations: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number', description: 'Confidence level 0-100' },
    external_verification: { type: 'string', enum: ['available', 'unavailable', 'partial'], description: 'Whether external reputation data was available' }
  }
};

function buildPrompt(scanType, content, fileUrl) {
  const base = `You are FakeCheck, a cybersecurity risk analysis engine for the Kurdistan region. You analyze digital content for suspicious, scam, phishing, or misleading indicators.

CRITICAL RULES:
- NEVER claim something is 100% fake or 100% safe. Always use cautious language.
- Focus on suspicious digital behavior and security indicators, not on accusing specific people or companies of being criminals.
- If external reputation/security data is unavailable, set external_verification to "unavailable" and note it in the summary.
- Base scores on observable indicators only.
- Risk levels: 0-30 = low, 31-60 = suspicious, 61-100 = high.
- Respond in English. Be clear and simple.`;

  const typePrompts = {
    link: `Analyze this URL for security indicators. Check for: suspicious domain, misspelled/lookalike brand domains, unusual subdomains, suspicious URL structure, shortened URLs, phishing patterns, HTTP vs HTTPS, suspicious keywords, fake login pages, and potential impersonation.

URL to analyze: ${content}`,
    message: `Analyze this message text for scam patterns. Check for: urgency language, fake prizes, money requests, OTP requests, password requests, bank information requests, suspicious links, impersonation, emotional manipulation, fake job offers, investment scams, crypto scams, and account verification scams.

Message to analyze:
${content}`,
    screenshot: `Analyze this screenshot image for scam indicators. Inspect for: scam messages, fake offers, suspicious URLs, fake brand impersonation, fake login requests, money requests, OTP requests, suspicious contact information, and misleading claims. ${fileUrl ? 'The image is attached.' : ''}

Additional context: ${content || '(no additional text)'}`,
    news: `Analyze this news content for misinformation signals. Check for: source credibility indicators, suspicious wording, missing evidence, emotional or sensational language, unverified claims, and possible misleading context. Clearly distinguish between verified information, unverified claims, suspicious indicators, and unknown information. Do NOT present AI speculation as confirmed facts.

News content to analyze:
${content}`,
  };

  return `${base}\n\n${typePrompts[scanType] || typePrompts.message}\n\nReturn structured JSON with risk_score, risk_level, summary, detected_warning_signs (array of {title, description, severity}), explanation, recommendations (array of strings), confidence, and external_verification.`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { scan_type, content, file_url } = body;

    if (!scan_type || !['link', 'message', 'screenshot', 'news'].includes(scan_type)) {
      return Response.json({ error: 'Invalid scan type' }, { status: 400 });
    }
    if (!content && !file_url) {
      return Response.json({ error: 'Content or file_url is required' }, { status: 400 });
    }

    // Rate limiting by content length
    const contentStr = typeof content === 'string' ? content : '';
    if (contentStr.length > 10000) {
      return Response.json({ error: 'Content too long (max 10000 characters)' }, { status: 400 });
    }

    const prompt = buildPrompt(scan_type, contentStr, file_url);
    const invokeArgs = {
      prompt,
      response_json_schema: RESPONSE_SCHEMA,
      model: 'gemini_3_flash',
    };
    if (file_url) {
      invokeArgs.file_urls = [file_url];
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM(invokeArgs);

    // Normalize risk level based on score
    const score = Math.max(0, Math.min(100, Math.round(result.risk_score || 0)));
    let level = result.risk_level;
    if (!['low', 'suspicious', 'high'].includes(level)) {
      level = score <= 30 ? 'low' : score <= 60 ? 'suspicious' : 'high';
    }

    return Response.json({
      risk_score: score,
      risk_level: level,
      summary: result.summary || '',
      warning_signs: Array.isArray(result.detected_warning_signs) ? result.detected_warning_signs : [],
      explanation: result.explanation || '',
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      confidence: Math.max(0, Math.min(100, Math.round(result.confidence || 70))),
      external_verification: result.external_verification || 'unavailable',
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
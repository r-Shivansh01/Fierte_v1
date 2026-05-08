import asyncio
import resend
from ..config import settings
from ..models import User, Evaluation

resend.api_key = settings.RESEND_API_KEY

async def send_evaluation_email(user: User, evaluation: Evaluation) -> None:
    subject_map = {
        "PERFECT": "Fièrté — You met the standard. Barely.",
        "PASS": "Fièrté — Acceptable. Don't make a habit of acceptable.",
        "FAIL": "Fièrté — You failed today. Here's the record."
    }
    
    subject = subject_map.get(evaluation.overall_verdict, "Fièrté — Nightly Report")
    
    # Template variable mapping
    verdict_bg = "#22c55e" if evaluation.overall_verdict == "PERFECT" else "#222222" if evaluation.overall_verdict == "PASS" else "#ff2020"
    verdict_accent = "#22c55e" if evaluation.overall_verdict == "PERFECT" else "#888888" if evaluation.overall_verdict == "PASS" else "#ff2020"
    rate_color = "#22c55e" if evaluation.overall_verdict == "PERFECT" else "#f5f5f5" if evaluation.overall_verdict == "PASS" else "#ff2020"
    message_color = "#22c55e" if evaluation.overall_verdict == "PERFECT" else "#888888" if evaluation.overall_verdict == "PASS" else "#cc2222"
    
    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Courier New',monospace;color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;">
    <tr>
      <td style="padding:32px;border:1px solid #222222;background-color:#111111;">

        <!-- Header -->
        <p style="margin:0 0 4px 0;font-size:11px;color:#888888;letter-spacing:4px;text-transform:uppercase;">
          FIÈRTÉ — NIGHTLY REPORT
        </p>
        <p style="margin:0 0 32px 0;font-size:11px;color:#444444;">
          {evaluation.evaluation_date.strftime("%A, %d %B %Y")}
        </p>

        <!-- Verdict Badge -->
        <div style="display:inline-block;padding:6px 16px;margin-bottom:24px;
          background-color:{verdict_bg};color:#ffffff;
          font-size:12px;letter-spacing:3px;font-weight:700;">
          {evaluation.overall_verdict}
        </div>

        <!-- Completion Rate -->
        <p style="margin:0 0 8px 0;font-size:11px;color:#888888;letter-spacing:2px;">
          COMPLETION RATE
        </p>
        <p style="margin:0 0 24px 0;font-size:36px;font-weight:700;color:{rate_color};">
          {round(evaluation.completion_rate * 100)}%
        </p>

        <!-- AI Message -->
        <p style="margin:0 0 32px 0;font-size:14px;line-height:1.7;color:{message_color};
          border-left:2px solid {verdict_accent};padding-left:16px;">
          {evaluation.ai_message}
        </p>

        <!-- CTA -->
        <a href="{settings.FRONTEND_URL}/dashboard"
          style="display:inline-block;padding:12px 28px;background-color:#ff2020;
          color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:3px;
          text-transform:uppercase;font-weight:700;">
          OPEN DASHBOARD →
        </a>

        <!-- Footer -->
        <p style="margin:32px 0 0 0;font-size:10px;color:#444444;border-top:1px solid #222222;padding-top:16px;">
          You registered with this email. No excuses. No unsubscribes.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
"""

    try:
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": settings.EMAIL_FROM,
                "to": [user.email],
                "subject": subject,
                "html": html_body,
            }
        )
    except Exception as e:
        # Re-raise so caller can handle per-user
        raise e

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  logPasswordResetEmail(email, resetUrl);
}

function logPasswordResetEmail(email: string, resetUrl: string) {
  console.log(`[email:mock] Password reset link for ${email}: ${resetUrl}`);
}

export async function sendInvitationEmail(email: string, invitationUrl: string): Promise<void> {
  logInvitationEmail(email, invitationUrl);
}

function logInvitationEmail(email: string, invitationUrl: string) {
  console.log(`[email:mock] Invitation link for ${email}: ${invitationUrl}`);
}

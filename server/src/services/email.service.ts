export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  logPasswordResetEmail(email, resetUrl);
}

function logPasswordResetEmail(email: string, resetUrl: string) {
  console.log(`[email:mock] Password reset link for ${email}: ${resetUrl}`);
}

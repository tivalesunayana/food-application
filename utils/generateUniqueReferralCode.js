function generateUniqueReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 6; // You can adjust the length of the referral code as needed
  let referralCode = "YB";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  return referralCode;
}

module.exports = generateUniqueReferralCode;

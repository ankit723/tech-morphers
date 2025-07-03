import {prisma} from "@/lib/db";

async function resetDatabase() {
  try {
    console.log("🗑️  Starting database reset...");
    
    // Delete in order to respect foreign key constraints
    // Start with dependent records first
    
    // Blog system - delete votes, reports, moderation logs first
    await prisma.commentVote.deleteMany({});
    console.log("✅ CommentVote records deleted");
    
    await prisma.commentReport.deleteMany({});
    console.log("✅ CommentReport records deleted");
    
    await prisma.commentModerationLog.deleteMany({});
    console.log("✅ CommentModerationLog records deleted");
    
    // Delete blog comments (handles nested comments automatically)
    await prisma.blogComment.deleteMany({});
    console.log("✅ BlogComment records deleted");
    
    // Delete blog posts (many-to-many relations are handled automatically)
    await prisma.blogPost.deleteMany({});
    console.log("✅ BlogPost records deleted");
    
    // Delete blog categories and tags
    await prisma.blogCategory.deleteMany({});
    console.log("✅ BlogCategory records deleted");
    
    await prisma.blogTag.deleteMany({});
    console.log("✅ BlogTag records deleted");
    
    // Call scheduling system
    await prisma.callBreak.deleteMany({});
    console.log("✅ CallBreak records deleted");
    
    await prisma.callAvailability.deleteMany({});
    console.log("✅ CallAvailability records deleted");
    
    await prisma.callBlockedDate.deleteMany({});
    console.log("✅ CallBlockedDate records deleted");
    
    await prisma.scheduledCall.deleteMany({});
    console.log("✅ ScheduledCall records deleted");
    
    // Client management system - delete dependent records first
    await prisma.paymentRecord.deleteMany({});
    console.log("✅ PaymentRecord records deleted");
    
    await prisma.clientDocument.deleteMany({});
    console.log("✅ ClientDocument records deleted");
    
    await prisma.estimator.deleteMany({});
    console.log("✅ Estimator records deleted");
    
    await prisma.client.deleteMany({});
    console.log("✅ Client records deleted");
    
    // Admin and settings
    await prisma.admin.deleteMany({});
    console.log("✅ Admin records deleted");
    
    await prisma.bankDetails.deleteMany({});
    console.log("✅ BankDetails records deleted");
    
    await prisma.invoiceSettings.deleteMany({});
    console.log("✅ InvoiceSettings records deleted");
    
    // Contact forms (independent records)
    await prisma.contactUs.deleteMany({});
    console.log("✅ ContactUs records deleted");
    
    await prisma.getStarted.deleteMany({});
    console.log("✅ GetStarted records deleted");
    
    await prisma.talkToUs.deleteMany({});
    console.log("✅ TalkToUs records deleted");
    
    await prisma.letsTalk.deleteMany({});
    console.log("✅ LetsTalk records deleted");
    
    await prisma.contactPage.deleteMany({});
    console.log("✅ ContactPage records deleted");

    await prisma.user.deleteMany({});
    console.log("✅ User records deleted");
    
    console.log("🎉 Database reset completed successfully!");

    //create bank details
    await prisma.bankDetails.create({
      data: {
        bankName: "Bank of Baroda",
        accountNumber: "40170100008677",
        accountHolderName: "Ankit Biswas",
        ifscCode: "BARB0SONARP",
        upiId: "varanasiartist.omg@okaxis",
        branchName: "Sonarpura, Varanasi",
        isActive: true,
        isDefault: true
      }
    })
    console.log("✅ BankDetails records created");
    
    
  } catch (error) {
    console.error("❌ Error during database reset:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset if this file is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log("✨ Reset script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Reset script failed:", error);
      process.exit(1);
    });
}

export default resetDatabase;
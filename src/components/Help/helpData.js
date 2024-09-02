export const sections = [
  {
    title: "Quick Start",
    items: ["Introduction", "Authentication", "Query Parameters", "Examples"],
  },
  {
    title: "Account Creation",
    items: ["Register", "Profile Setup"],
  },
  {
    title: "Features",
    items: ["Messaging", "Automation", "Analytics"],
  },
  {
    title: "Standalone Section", // This section has no child items
    items: [], // Empty items array indicates no child items
  },
];

export const content = {
  Introduction: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
      <p className="text-gray-500 mb-8">
        Welcome to the WhatsApp CRM System! This guide will help you set up and
        start using the system effectively. Follow these steps to streamline
        your customer relationship management using WhatsApp.
      </p>
      <h3 className="font-semibold text-lg mb-2">Step 1: Register And Login</h3>
      <p className="mb-4">
        <strong>Register An Account:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Visit The [WhatsApp CRM System Website].</li>
          <li>Click On The "Sign Up" Button.</li>
          <li>
            Fill In The Required Details (Name, Email, Phone Number, Etc.).
          </li>
          <li>Verify Your Email And Phone Number.</li>
        </ul>
      </p>
      <p className="mb-4">
        <strong>Login:</strong> After Registration, Log In Using Your Email And
        Password.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 2: Set Up Your Profile
      </h3>
      <p className="mb-4">
        <strong>Personal Information:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Navigate To The "Profile" Section.</li>
          <li>
            Update Your Personal Details Such As Name, Profile Picture, And
            Contact Information.
          </li>
        </ul>
      </p>
      <p className="mb-4">
        <strong>Business Information:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Go To "Business Settings".</li>
          <li>
            Fill In Your Business Name, Address, And Other Relevant Information.
          </li>
          <li>Upload Your Business Logo And Set Your Business Hours.</li>
        </ul>
      </p>
    </>
  ),
  Authentication: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
      <p className="text-gray-500 mb-8">
        Authentication in the WhatsApp CRM system involves verifying your
        identity to ensure secure access. Follow the steps below to authenticate
        your account.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Two-Factor Authentication
      </h3>
      <p className="mb-4">
        <strong>Enable 2FA:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Go to the "Security" settings in your account.</li>
          <li>Click on "Enable 2FA".</li>
          <li>
            Follow the prompts to set up two-factor authentication using your
            phone or email.
          </li>
        </ul>
      </p>
    </>
  ),
  "Query Parameters": (
    <>
      <h2 className="text-2xl font-semibold mb-4">Query Parameters</h2>
      <p className="text-gray-500 mb-8">
        Query parameters allow you to customize and filter the data retrieved
        from the WhatsApp CRM system. Here are some common query parameters you
        can use.
      </p>
      <h3 className="font-semibold text-lg mb-2">Example Parameters:</h3>
      <ul className="list-disc list-inside pl-4 mb-4">
        <li>
          <strong>start_date:</strong> Filters results starting from a specific
          date.
        </li>
        <li>
          <strong>end_date:</strong> Filters results up to a specific date.
        </li>
        <li>
          <strong>status:</strong> Filters results by the status of the message
          (e.g., sent, delivered, read).
        </li>
      </ul>
    </>
  ),
  Examples: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Examples</h2>
      <p className="text-gray-500 mb-8">
        Here are some examples of how to use the WhatsApp CRM system
        effectively.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Example 1: Sending a Message
      </h3>
      <p className="mb-4">
        <strong>Step 1:</strong> Go to the "Messages" section.
      </p>
      <p className="mb-4">
        <strong>Step 2:</strong> Click on "New Message" and select the
        recipient.
      </p>
      <p className="mb-4">
        <strong>Step 3:</strong> Type your message and click "Send".
      </p>
    </>
  ),
  "Account Creation": (
    <>
      <h2 className="text-2xl font-semibold mb-4">Account Creation</h2>
      <p className="text-gray-500 mb-8">
        Follow these steps to create and set up an account in the WhatsApp CRM
        system.
      </p>
      <h3 className="font-semibold text-lg mb-2">Step 1: Register</h3>
      <p className="mb-4">
        <strong>Register An Account:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Visit the registration page.</li>
          <li>Fill in the required details (name, email, etc.).</li>
          <li>Submit the form to create your account.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">Step 2: Set Up Profile</h3>
      <p className="mb-4">
        <strong>Profile Information:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Navigate to the "Profile" section.</li>
          <li>Fill in your personal and business details.</li>
          <li>Upload a profile picture.</li>
        </ul>
      </p>
    </>
  ),
  Features: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Features</h2>
      <p className="text-gray-500 mb-8">
        Explore the key features of the WhatsApp CRM system that help streamline
        your business operations.
      </p>
      <h3 className="font-semibold text-lg mb-2">Feature 1: Messaging</h3>
      <p className="mb-4">
        <strong>Messaging:</strong> Easily send and receive messages through
        WhatsApp directly from the CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">Feature 2: Automation</h3>
      <p className="mb-4">
        <strong>Automation:</strong> Automate repetitive tasks to save time and
        reduce manual effort.
      </p>
      <h3 className="font-semibold text-lg mb-2">Feature 3: Analytics</h3>
      <p className="mb-4">
        <strong>Analytics:</strong> Get detailed reports and insights to track
        the performance of your campaigns.
      </p>
    </>
  ),
  Register: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <p className="text-gray-500 mb-8">
        Registering an account is the first step to getting started with the
        WhatsApp CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Access the Registration Page
      </h3>
      <p className="mb-4">
        <strong>Navigate to Registration:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Open the registration page from the main website.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">Step 2: Fill in Details</h3>
      <p className="mb-4">
        <strong>Complete the Form:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Enter your full name, email address, and create a password.</li>
          <li>
            Provide additional information such as phone number and company name
            if required.
          </li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 3: Verify Your Account
      </h3>
      <p className="mb-4">
        <strong>Verification:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Check your email for a verification link.</li>
          <li>
            Click the link to verify your email address and complete the
            registration process.
          </li>
        </ul>
      </p>
    </>
  ),

  "Profile Setup": (
    <>
      <h2 className="text-2xl font-semibold mb-4">Profile Setup</h2>
      <p className="text-gray-500 mb-8">
        Set up your profile to ensure your personal and business details are
        correctly configured in the WhatsApp CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Access Profile Settings
      </h3>
      <p className="mb-4">
        <strong>Navigate to Profile Settings:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Log in to your account.</li>
          <li>Go to the "Profile" or "Account Settings" section.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 2: Update Personal Information
      </h3>
      <p className="mb-4">
        <strong>Personal Details:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Update your name, profile picture, and contact information.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 3: Set Up Business Information
      </h3>
      <p className="mb-4">
        <strong>Business Details:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>
            Enter your business name, address, and other relevant information.
          </li>
          <li>
            Upload your business logo and set business hours if applicable.
          </li>
        </ul>
      </p>
    </>
  ),

  Messaging: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Messaging</h2>
      <p className="text-gray-500 mb-8">
        The messaging feature allows you to communicate with your contacts
        directly through the WhatsApp CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Access the Messaging Section
      </h3>
      <p className="mb-4">
        <strong>Navigate to Messages:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Go to the "Messages" tab from the main dashboard.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 2: Compose a New Message
      </h3>
      <p className="mb-4">
        <strong>Create a Message:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Click on "New Message" to start composing.</li>
          <li>
            Select a recipient from your contacts or enter a phone number.
          </li>
          <li>Type your message and click "Send".</li>
        </ul>
      </p>
    </>
  ),

  Automation: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Automation</h2>
      <p className="text-gray-500 mb-8">
        Automation features allow you to streamline repetitive tasks and enhance
        efficiency in the WhatsApp CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Access Automation Settings
      </h3>
      <p className="mb-4">
        <strong>Navigate to Automation:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Go to the "Automation" tab in your account settings.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 2: Create Automation Rules
      </h3>
      <p className="mb-4">
        <strong>Set Up Rules:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Click "Add New Rule" to create a new automation.</li>
          <li>Define the conditions and actions for the automation rule.</li>
          <li>Save the rule to activate it.</li>
        </ul>
      </p>
    </>
  ),

  Analytics: (
    <>
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
      <p className="text-gray-500 mb-8">
        The analytics feature provides insights and reports on your interactions
        and performance within the WhatsApp CRM system.
      </p>
      <h3 className="font-semibold text-lg mb-2">
        Step 1: Access Analytics Dashboard
      </h3>
      <p className="mb-4">
        <strong>Navigate to Analytics:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>Go to the "Analytics" section from the main dashboard.</li>
        </ul>
      </p>
      <h3 className="font-semibold text-lg mb-2">Step 2: View Reports</h3>
      <p className="mb-4">
        <strong>Analyze Data:</strong>
        <ul className="list-disc list-inside pl-4">
          <li>
            Select the type of report you want to view, such as message
            performance or user engagement.
          </li>
          <li>
            Review the charts and graphs to gain insights into your CRM
            activities.
          </li>
        </ul>
      </p>
    </>
  ),
  "Standalone Section": (
    <>
      <h2 className="text-2xl font-semibold mb-4">Standalone Section</h2>
      <p className="text-gray-500 mb-8">
        This section does not have any child items but contains its own
        standalone content.
      </p>
    </>
  ),
};

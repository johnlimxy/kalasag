It's 7:25 PM, Wednesday. We are on schedule. The database schema is defined, and the initial project setup is complete.

To ensure we all build towards the exact same target, I've drafted the core technical documentation for our 1-week sprint. This document contains the User Stories, Functional Specifications, and Test Scenarios for the Guardian Mode prototype. This is our blueprint for the rest of the week.

-----

### **Kalasag MVP: Sprint 1 Technical Specifications**

  * [cite\_start]**Project:** BPI Kalasag: A Digital Shield for Senior Financial Wellness [cite: 12]
  * **Sprint Goal:** Prototype the "Trusted Guardian Mode" feature, from activation to a successful alert.
  * **Version:** 1.0
  * **Date:** July 30, 2025

### **1. User Stories**

These stories define the "why" behind what we are building. Every feature and test must trace back to one of these user needs.

  * **Epic:** Guardian Mode Setup & Proactive Alerting

  * **Story 1: Kalasag Activation**

    > **As a** senior user, Nanay Elen,
    > **I want to** easily activate a simpler, safer "Kalasag Mode"
    > **so that** I can feel more confident using the banking app.

  * **Story 2: Guardian Invitation**

    > **As a** senior user, Nanay Elen,
    > **I want to** invite my son Miguel to be my Trusted Guardian
    > **so that** I have a safety net in case of a suspicious transaction.

  * **Story 3: Receiving an Alert**

    > **As a** guardian, Miguel,
    > **I want to** receive an immediate SMS alert when my mother attempts a high-risk transaction
    > **so that** I can call her and ensure she is safe.

  * **Story 4: Proactive Intervention**

    > **As a** senior user, Nanay Elen,
    > **I want** the app to stop and warn me if I am about to make an unusual transaction
    > **so that** I have a chance to reconsider before it’s too late.

### **2. Functional Specifications**

This section defines the "what" and "how" of the prototype's features.

**1.1 Feature: Kalasag Mode Activation**

  * **1.1.1:** An entry point (e.g., a banner or button) to activate Kalasag Mode shall be present on the replicated standard BPI dashboard.
  * **1.1.2:** Upon activation, the application's UI shall transition to the Kalasag Mode theme (high-contrast, min. 18pt font, simplified dashboard with large tiles).
  * **1.1.3:** The user's choice to activate Kalasag Mode shall be persisted by setting the `is_kalasag_active` flag to `true` in the `users` table for their profile.

**1.2 Feature: Guardian Invitation Flow**

  * **1.2.1:** The user must be able to navigate to an "Invite Guardian" screen from the Kalasag dashboard.
  * **1.2.2:** The system shall require a valid 11-digit Philippine mobile number for the invitation. Input validation must be present.
  * **1.2.3:** Upon submission, a new record with a `status` of 'pending' must be created in the `guardians` table, linking the `senior_user_id` to the invited individual (who will be a pre-provisioned user in our `users` table for this prototype).
  * **1.2.4:** The UI must display the pending status of the invitation to the senior user. For the prototype, we will simulate automatic acceptance after 10 seconds, changing the status to 'active'.

**1.3 Feature: High-Risk Transaction & Alerting**

  * **1.3.1:** The backend shall contain a hardcoded business rule to define a "high-risk" transaction. For this prototype, the rule is: `Transaction Amount > 5000.00`.
  * **1.3.2:** When a transaction meeting this rule is initiated, the system must **not** update the account balances immediately.
  * **1.3.3:** The frontend must display the "AI Assist" warning modal, preventing the user from proceeding without acknowledgement.
  * **1.3.4:** The backend will create a record in the `transactions` table with `status = 'pending_review'` and `is_flagged_as_high_risk = true`.
  * **1.3.5:** Upon flagging the transaction, the backend must immediately trigger an SMS to the active guardian's phone number and log the event in the `alerts` table.

### **3. Test Scenarios**

This section defines "how we know it works." We will test against these scenarios before the final demo.

| Scenario ID | Description | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **TS-01** | **Successful Kalasag Activation** | 1. Log in as Nanay Elen. \<br\> 2. Tap the "Activate Kalasag Mode" button. | The UI immediately changes to the simplified Kalasag dashboard. The `is_kalasag_active` flag is set to `true` in the database. |
| **TS-02** | **Guardian Invitation (Happy Path)** | 1. Navigate to the Guardian screen. \<br\> 2. Enter Miguel's valid phone number. \<br\> 3. Tap "Send Invite." | The UI shows "Invitation Pending." After a short delay, it updates to "Guardian Active." A corresponding record is created and updated in the `guardians` table. |
| **TS-03** | **Low-Risk Transaction** | 1. As Nanay Elen, initiate a "Send Money" transaction for ₱1,000. | The transaction completes successfully. The account balance is updated. No warning modal appears, and no SMS is sent to the guardian. |
| **TS-04** | **High-Risk Transaction & Alert**| 1. As Nanay Elen, initiate a "Send Money" transaction for ₱6,000. | The "AI Assist" warning modal appears in the app. A real SMS alert is received on the guardian's test phone within 60 seconds. The transaction status in the database is 'pending\_review'. |
| **TS-05**| **Guardian Invite (Invalid Input)** | 1. Navigate to the Guardian screen. \<br\> 2. Enter "not a number" into the phone number field. \<br\> 3. Tap "Send Invite." | A user-friendly error message ("Please enter a valid 11-digit mobile number.") is displayed below the input field. No API call is made. |
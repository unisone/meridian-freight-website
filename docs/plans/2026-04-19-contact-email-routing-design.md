# Contact Email Routing Design

## Summary

The intended target was to replace `info@meridianexport.com` with `contact@meridianexport.com`, but that mailbox was not provisioned in Google Workspace. The live fallback is to use `alex.r@meridianexport.com` as the public mailbox, prefill `alex.z@meridianexport.com` on CC from website mail links, and keep app-generated lead emails routed to `alex.r@meridianexport.com` with `alex.z@meridianexport.com` on CC.

## Constraints

- `meridianexport.com` already uses Google Workspace MX records.
- Resend is already the outbound transactional email provider for the site.
- Root-domain inbound mail should not be moved to Resend because that would conflict with the existing Google Workspace MX setup.

## Approved Approach

Use a hybrid setup:

1. Resend continues to send outbound app emails from `contact@meridianexport.com`.
2. Contact-form and calculator notifications go to `alex.r@meridianexport.com` and CC `alex.z@meridianexport.com`.
3. Customer-facing auto-replies use `replyTo: [alex.r@meridianexport.com, alex.z@meridianexport.com]`.
4. Public website mail links point to `alex.r@meridianexport.com` and prefill `alex.z@meridianexport.com` on CC until a real `contact@meridianexport.com` mailbox exists.
5. Existing booking routing remains unchanged because it is an operations-specific workflow.

## Repo Changes

- Update shared contact constants.
- Update contact-form notification and auto-reply routing.
- Update calculator notification and auto-reply routing.
- Replace hardcoded public `info@meridianexport.com` references in public-facing content.

## External Dependency

To move back to a branded public inbox, `contact@meridianexport.com` must exist in the live mail system and forward to:

- `alex.r@meridianexport.com`
- `alex.z@meridianexport.com`

That inbox provisioning lives outside this repo.

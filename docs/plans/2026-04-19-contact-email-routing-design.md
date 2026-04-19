# Contact Email Routing Design

## Summary

Change the website's public contact email from `info@meridianexport.com` to `contact@meridianexport.com` and update app-generated lead emails so they route to the CEO at `alex.r@meridianexport.com` with `alex.z@meridianexport.com` on CC.

## Constraints

- `meridianexport.com` already uses Google Workspace MX records.
- Resend is already the outbound transactional email provider for the site.
- Root-domain inbound mail should not be moved to Resend because that would conflict with the existing Google Workspace MX setup.

## Approved Approach

Use a hybrid setup:

1. Public website email becomes `contact@meridianexport.com`.
2. Resend continues to send outbound app emails from `contact@meridianexport.com`.
3. Contact-form and calculator notifications go to `alex.r@meridianexport.com` and CC `alex.z@meridianexport.com`.
4. Customer-facing auto-replies use `replyTo: contact@meridianexport.com` so replies land in the shared contact inbox path.
5. Existing booking routing remains unchanged because it is an operations-specific workflow.

## Repo Changes

- Update shared contact constants.
- Update contact-form notification and auto-reply routing.
- Update calculator notification and auto-reply routing.
- Replace hardcoded public `info@meridianexport.com` references in public-facing content.

## External Dependency

`contact@meridianexport.com` must exist in the live mail system and forward to:

- `alex.r@meridianexport.com`
- `alex.z@meridianexport.com`

That inbox provisioning lives outside this repo.

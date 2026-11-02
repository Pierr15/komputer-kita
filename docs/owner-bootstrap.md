# Initial owner bootstrap

New registrations are assigned `buyer` by default. Do not expose an owner-registration switch in the public signup form.

After the first intended owner account has successfully registered and its email is confirmed, run the following one-time statement in the Supabase SQL Editor using an administrator session. Replace the email with the actual owner email.

```sql
update public.profiles as p
set role = 'owner', updated_at = now()
from auth.users as u
where p.id = u.id
  and lower(u.email) = lower('owner@example.com');
```

Verify that exactly one row was updated and that the intended account can open `/owner`. Keep this operation in the privileged SQL Editor; never expose it as a public API or browser action. Later role changes should use the owner-checked `admin_update_user_role` RPC.

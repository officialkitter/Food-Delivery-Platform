-- Adds push token fields on profiles and wires an order-status trigger to Supabase Edge Function.

create extension if not exists pg_net;

do $$
declare
  profile_table_name text;
  profile_index_name text;
begin
  if to_regclass('public.profiles') is not null then
    profile_table_name := 'profiles';
  elsif to_regclass('public.account_profiles') is not null then
    profile_table_name := 'account_profiles';
  elsif to_regclass('public.customer_profiles') is not null then
    profile_table_name := 'customer_profiles';
  else
    raise exception
      'No profile table found. Expected one of public.profiles, public.account_profiles, or public.customer_profiles.';
  end if;

  execute format(
    'alter table public.%I
       add column if not exists push_token text,
       add column if not exists push_token_type text,
       add column if not exists push_token_updated_at timestamptz',
    profile_table_name
  );

  profile_index_name := format('idx_%s_push_token', profile_table_name);
  execute format(
    'create index if not exists %I
       on public.%I(push_token)
       where push_token is not null',
    profile_index_name,
    profile_table_name
  );
end
$$;

create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_base_url text := coalesce(current_setting('app.settings.supabase_url', true), 'https://YOUR_PROJECT_REF.supabase.co');
  webhook_secret text := coalesce(current_setting('app.settings.edge_webhook_secret', true), 'REPLACE_WITH_EDGE_WEBHOOK_SECRET');
begin
  if new.status is distinct from old.status then
    perform
      net.http_post(
        url := edge_base_url || '/functions/v1/order-status-fcm',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-webhook-secret', webhook_secret
        ),
        body := jsonb_build_object(
          'type', TG_OP,
          'schema', TG_TABLE_SCHEMA,
          'table', TG_TABLE_NAME,
          'record', to_jsonb(new),
          'old_record', to_jsonb(old)
        )
      );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_notify_order_status_change on public.orders;

create trigger trg_notify_order_status_change
after update on public.orders
for each row
execute function public.notify_order_status_change();

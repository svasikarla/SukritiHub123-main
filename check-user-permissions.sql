-- Check if user exists
SELECT EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7'
) AS user_exists;

-- Get user's roles
SELECT r.id, r.name, r.description
FROM roles r
JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7';

-- Get permissions for this user
SELECT DISTINCT p.id, p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
JOIN user_roles ur ON rp.role_id = ur.role_id
WHERE ur.user_id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7';

-- Check if user has any of the required permissions for residents screen
SELECT EXISTS (
  SELECT 1
  FROM permissions p
  JOIN role_permissions rp ON p.id = rp.permission_id
  JOIN user_roles ur ON rp.role_id = ur.role_id
  WHERE ur.user_id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7'
  AND p.name IN (
    'one_time_entry_of_data',
    'manage_ownership',
    'manage_flat_living_status',
    'approve_manage_tenants'
  )
) AS has_residents_access;

-- Get missing permissions (what the user needs but doesn't have)
SELECT p.name
FROM permissions p
WHERE p.name IN (
  'one_time_entry_of_data',
  'manage_ownership',
  'manage_flat_living_status',
  'approve_manage_tenants'
)
AND p.id NOT IN (
  SELECT rp.permission_id
  FROM role_permissions rp
  JOIN user_roles ur ON rp.role_id = ur.role_id
  WHERE ur.user_id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7'
);
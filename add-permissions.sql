-- First, get the user's role ID
WITH user_role AS (
  SELECT role_id
  FROM user_roles
  WHERE user_id = 'e5180d65-7a4d-47fc-8886-694bf708cbb7'
  LIMIT 1
)

-- Then, get the permission ID for 'manage_ownership'
, required_permission AS (
  SELECT id
  FROM permissions
  WHERE name = 'manage_ownership'
  LIMIT 1
)

-- Finally, insert the permission if it doesn't already exist for this role
INSERT INTO role_permissions (role_id, permission_id)
SELECT ur.role_id, rp.id
FROM user_role ur, required_permission rp
WHERE NOT EXISTS (
  SELECT 1
  FROM role_permissions
  WHERE role_id = ur.role_id
  AND permission_id = rp.id
);
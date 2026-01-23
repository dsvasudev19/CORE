-- Add PAYROLL resources and permissions for existing system
-- Run this script if you don't want to restart the application

USE core_db;

-- Get the system organization ID
SET @org_id = (SELECT id FROM organization WHERE code = 'SYS-ORG' LIMIT 1);

-- Insert PAYROLL resource if not exists
INSERT INTO resource (code, name, description, organization_id, created_at, updated_at)
SELECT 'PAYROLL', 'Payroll', 'Resource: PAYROLL', @org_id, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE code = 'PAYROLL');

-- Insert PAYROLL_HISTORY resource if not exists
INSERT INTO resource (code, name, description, organization_id, created_at, updated_at)
SELECT 'PAYROLL_HISTORY', 'Payroll_history', 'Resource: PAYROLL_HISTORY', @org_id, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE code = 'PAYROLL_HISTORY');

-- Get resource IDs
SET @payroll_resource_id = (SELECT id FROM resource WHERE code = 'PAYROLL' LIMIT 1);
SET @payroll_history_resource_id = (SELECT id FROM resource WHERE code = 'PAYROLL_HISTORY' LIMIT 1);

-- Get action IDs
SET @create_action_id = (SELECT id FROM action WHERE code = 'CREATE' LIMIT 1);
SET @read_action_id = (SELECT id FROM action WHERE code = 'READ' LIMIT 1);
SET @update_action_id = (SELECT id FROM action WHERE code = 'UPDATE' LIMIT 1);
SET @delete_action_id = (SELECT id FROM action WHERE code = 'DELETE' LIMIT 1);

-- Create permissions for PAYROLL resource
INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_resource_id, @create_action_id, @org_id, 'PAYROLL:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @create_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_resource_id, @read_action_id, @org_id, 'PAYROLL:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @read_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_resource_id, @update_action_id, @org_id, 'PAYROLL:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @update_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_resource_id, @delete_action_id, @org_id, 'PAYROLL:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @delete_action_id);

-- Create permissions for PAYROLL_HISTORY resource
INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_history_resource_id, @create_action_id, @org_id, 'PAYROLL_HISTORY:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @create_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_history_resource_id, @read_action_id, @org_id, 'PAYROLL_HISTORY:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @read_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_history_resource_id, @update_action_id, @org_id, 'PAYROLL_HISTORY:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @update_action_id);

INSERT INTO permission (resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @payroll_history_resource_id, @delete_action_id, @org_id, 'PAYROLL_HISTORY:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @delete_action_id);

-- Get role IDs
SET @super_admin_role_id = (SELECT id FROM role WHERE name = 'SUPER_ADMIN' AND organization_id = @org_id LIMIT 1);
SET @org_admin_role_id = (SELECT id FROM role WHERE name = 'ORG_ADMIN' AND organization_id = @org_id LIMIT 1);
SET @project_manager_role_id = (SELECT id FROM role WHERE name = 'PROJECT_MANAGER' AND organization_id = @org_id LIMIT 1);

-- Get permission IDs
SET @payroll_create_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @create_action_id LIMIT 1);
SET @payroll_read_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @read_action_id LIMIT 1);
SET @payroll_update_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @update_action_id LIMIT 1);
SET @payroll_delete_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_resource_id AND action_id = @delete_action_id LIMIT 1);

SET @payroll_history_create_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @create_action_id LIMIT 1);
SET @payroll_history_read_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @read_action_id LIMIT 1);
SET @payroll_history_update_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @update_action_id LIMIT 1);
SET @payroll_history_delete_perm_id = (SELECT id FROM permission WHERE resource_id = @payroll_history_resource_id AND action_id = @delete_action_id LIMIT 1);

-- Add permissions to SUPER_ADMIN role (all PAYROLL permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_create_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_create_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_read_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_update_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_update_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_delete_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_delete_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_history_create_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_history_create_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_history_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_history_read_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_history_update_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_history_update_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @super_admin_role_id, @payroll_history_delete_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @super_admin_role_id AND permission_id = @payroll_history_delete_perm_id);

-- Add permissions to ORG_ADMIN role (all PAYROLL permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_create_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_create_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_read_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_update_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_update_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_delete_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_delete_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_history_create_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_history_create_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_history_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_history_read_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_history_update_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_history_update_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @org_admin_role_id, @payroll_history_delete_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @org_admin_role_id AND permission_id = @payroll_history_delete_perm_id);

-- Add read-only permissions to PROJECT_MANAGER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT @project_manager_role_id, @payroll_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @project_manager_role_id AND permission_id = @payroll_read_perm_id);

INSERT INTO role_permissions (role_id, permission_id)
SELECT @project_manager_role_id, @payroll_history_read_perm_id
WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = @project_manager_role_id AND permission_id = @payroll_history_read_perm_id);

-- Create policies for SUPER_ADMIN
INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_resource_id, @create_action_id, @org_id, 'SUPER_ADMIN → PAYROLL:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @create_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_resource_id, @read_action_id, @org_id, 'SUPER_ADMIN → PAYROLL:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @read_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_resource_id, @update_action_id, @org_id, 'SUPER_ADMIN → PAYROLL:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @update_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_resource_id, @delete_action_id, @org_id, 'SUPER_ADMIN → PAYROLL:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @delete_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_history_resource_id, @create_action_id, @org_id, 'SUPER_ADMIN → PAYROLL_HISTORY:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @create_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_history_resource_id, @read_action_id, @org_id, 'SUPER_ADMIN → PAYROLL_HISTORY:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @read_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_history_resource_id, @update_action_id, @org_id, 'SUPER_ADMIN → PAYROLL_HISTORY:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @update_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @super_admin_role_id, @payroll_history_resource_id, @delete_action_id, @org_id, 'SUPER_ADMIN → PAYROLL_HISTORY:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @super_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @delete_action_id);

-- Create policies for ORG_ADMIN
INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_resource_id, @create_action_id, @org_id, 'ORG_ADMIN → PAYROLL:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @create_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_resource_id, @read_action_id, @org_id, 'ORG_ADMIN → PAYROLL:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @read_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_resource_id, @update_action_id, @org_id, 'ORG_ADMIN → PAYROLL:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @update_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_resource_id, @delete_action_id, @org_id, 'ORG_ADMIN → PAYROLL:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_resource_id AND action_id = @delete_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_history_resource_id, @create_action_id, @org_id, 'ORG_ADMIN → PAYROLL_HISTORY:CREATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @create_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_history_resource_id, @read_action_id, @org_id, 'ORG_ADMIN → PAYROLL_HISTORY:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @read_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_history_resource_id, @update_action_id, @org_id, 'ORG_ADMIN → PAYROLL_HISTORY:UPDATE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @update_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @org_admin_role_id, @payroll_history_resource_id, @delete_action_id, @org_id, 'ORG_ADMIN → PAYROLL_HISTORY:DELETE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @org_admin_role_id AND resource_id = @payroll_history_resource_id AND action_id = @delete_action_id);

-- Create policies for PROJECT_MANAGER (read-only)
INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @project_manager_role_id, @payroll_resource_id, @read_action_id, @org_id, 'PROJECT_MANAGER → PAYROLL:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @project_manager_role_id AND resource_id = @payroll_resource_id AND action_id = @read_action_id);

INSERT INTO policy (role_id, resource_id, action_id, organization_id, description, created_at, updated_at)
SELECT @project_manager_role_id, @payroll_history_resource_id, @read_action_id, @org_id, 'PROJECT_MANAGER → PAYROLL_HISTORY:READ', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM policy WHERE role_id = @project_manager_role_id AND resource_id = @payroll_history_resource_id AND action_id = @read_action_id);

SELECT 'PAYROLL permissions and policies added successfully!' AS status;

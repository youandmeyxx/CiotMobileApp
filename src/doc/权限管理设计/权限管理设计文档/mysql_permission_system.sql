-- MySQL权限管理角色数据表设计
-- 基于RBAC (Role-Based Access Control) 模型

-- 创建数据库
CREATE DATABASE IF NOT EXISTS permission_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE permission_system;

-- 1. 用户表 (users) 未使用
-- 存储系统用户的基本信息
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码（建议加密存储）',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '电子邮箱',
    full_name VARCHAR(100) DEFAULT NULL COMMENT '用户全名',
    status ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active' COMMENT '用户状态',
    last_login_at DATETIME DEFAULT NULL COMMENT '最后登录时间',
    created_at TIMESTAMP NOT NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT current current_timestamp on update current_timestamp comment '更新时间'
) engine=InnoDB default charset=utf8mb4 comment='系统用户表';

-- 2. 角色表 (roles)
-- 定义系统中的角色
CREATE TABLE setup_roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    description TEXT DEFAULT NULL COMMENT '角色描述',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '角色状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 3. 权限表 (permissions)
-- 定义系统中的权限项
CREATE TABLE setup_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码',
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    description TEXT DEFAULT NULL COMMENT '权限描述',
    resource_type ENUM('page', 'api', 'button', 'data') NOT NULL COMMENT '资源类型',
    resource_path VARCHAR(255) DEFAULT NULL COMMENT '资源路径',
    parent_id INT DEFAULT NULL COMMENT '父权限ID',
    created_at VARCHAR(30)  COMMENT '创建时间',
    updated_at VARCHAR(30)  COMMENT '更新时间',
    FOREIGN KEY (parent_id) REFERENCES setup_permissions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 4. 用户角色关联表 (user_roles)
-- 管理用户与角色的多对多关系
CREATE TABLE setup_user_roles (
    user_id INT NOT NULL COMMENT '用户ID',
    role_id INT NOT NULL COMMENT '角色ID',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认角色',
    granted_at VARCHAR(30) COMMENT '创建时间',
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 5. 角色权限关联表 (role_permissions)
-- 管理角色与权限的多对多关系
CREATE TABLE setup_role_permissions (
    role_id INT NOT NULL COMMENT '角色ID',
    permission_id INT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (role_id, permission_id)
    -- FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    -- FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 创建索引以提高查询性能
-- users表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- roles表索引
CREATE INDEX idx_roles_role_name ON roles(role_name);
CREATE INDEX idx_roles_status ON roles(status);

-- permissions表索引
CREATE INDEX idx_permissionsmissions_permission_code ON permissions(permission_code);
CREATE INDEX idx_permissions_resource_type ON permissions(resource_type);
CREATE INDEX idx_permissions_parent_id ON permissions(parent_id);

-- user_roles表索引
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- role_permissions表索引
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- 插入初始数据
-- 插入默认角色
INSERT INTO roles (role_name, description, status) VALUES
('super_admin', '超级管理员，拥有系统所有权限', 'active'),
('admin', '系统管理员，拥有大部分管理权限', 'active'),
('editor', '内容编辑，拥有内容管理权限', 'active'),
('viewer', '普通查看者，仅拥有查看权限', 'active');

-- 插入系统级权限
INSERT INTO permissions (permission_code, permission_name, description, resource_type, resource_path) VALUES
('system:user:manage', '用户管理', '管理系统所有用户', 'page', '/system/user'),
('system:user:create', '创建用户', '创建新用户', 'button', '/system/user/create'),
('system:user:edit', '编辑用户', '编辑用户信息', 'button', '/system/user/edit'),
('system:user:delete', '删除用户', '删除用户', 'button', '/system/user/delete'),
('system:user:view', '查看用户', '查看用户信息', 'button', '/system/user/view'),

('system:role:manage', '角色管理', '管理系统所有角色', 'page', '/system/role'),
('system:role:create', '创建角色', '创建新角色', 'button', '/system/role/create'),
('system:role:edit', '编辑角色', '编辑角色信息', 'button', '/system/role/edit'),
('system:role:delete', '删除角色', '删除角色', 'button', '/system/role/delete'),
('system:role:view', '查看角色', '查看角色信息', 'button', '/system/role/view'),

('system:permission:manage', '权限管理', '管理系统所有权限', 'page', '/system/permission'),
('system:permission:create', '创建权限', '创建新权限', 'button', '/system/permission/create'),
('system:permission:edit', '编辑权限', '编辑权限信息', 'button', '/system/permission/edit'),
('system:permission:delete', '删除权限', '删除权限', 'button', '/system/permission/delete'),
('system:permission:view', '查看权限', '查看权限信息', 'button', '/system/permission/view'),

('system:config:manage', '系统配置', '管理系统配置', 'page', '/system/config'),
('system:config:edit', '编辑配置', '编辑系统配置', 'button', '/system/config/edit'),
('system:config:view', '查看配置', '查看系统配置', 'button', '/system/config/view'),

('content:article:manage', '文章管理', '管理系统所有文章', 'page', '/content/article'),
('content:article:create', '创建文章', '创建新文章', 'button', '/content/article/create'),
('content:article:edit', '编辑文章', '编辑文章内容', 'button', '/content/article/edit'),
('content:article:delete', '删除文章', '删除文章', 'button', '/content/article/delete'),
('content:article:view', '查看文章', '查看文章内容', 'button', '/content/article/view'),

('content:category:manage', '分类管理', '管理内容分类', 'page', '/content/category'),
('content:category:create', '创建分类', '创建新分类', 'button', '/content/category/create'),
('content:category:edit', '编辑分类', '编辑分类信息', 'button', '/content/category/edit'),
('content:category:delete', '删除分类', '删除分类', 'button', '/content/category/delete'),
('content:category:view', '查看分类', '查看分类信息', 'button', '/content/category/view');

-- 为超级管理员分配所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE role_name = 'super_admin'),
    id 
FROM permissions;

-- 为管理员分配部分权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE role_name = 'admin'),
    id 
FROM permissions 
WHERE permission_code NOT LIKE 'system:permission:%';

-- 为编辑分配内容管理权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE role_name = 'editor'),
    id 
FROM permissions 
WHERE permission_code LIKE 'content:%';

-- 为查看者分配查看权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE role_name = 'viewer'),
    id 
FROM permissions 
WHERE permission_code LIKE '%:view';

-- 创建默认超级管理员用户 (密码: admin123)
INSERT INTO users (username, password, email, full_name, status)
VALUES ('admin', SHA2('admin123', 256), 'admin@example.com', '系统管理员', 'active');

-- 为默认用户分配超级管理员角色
INSERT INTO user_roles (user_id, role_id, is_default)
VALUES (LAST_INSERT_ID(), (SELECT id FROM roles WHERE role_name = 'super_admin'), TRUE);

-- 创建普通用户 (密码: user123)
INSERT INTO users (username, password, email, full_name, status)
VALUES ('user', SHA2('user123', 256), 'user@example.com', '普通用户', 'active');

-- 为普通用户分配查看者角色
INSERT INTO user_roles (user_id, role_id, is_default)
VALUES (LAST_INSERT_ID(), (SELECT id FROM roles WHERE role_name = 'viewer'), TRUE);

-- 输出创建成功信息
SELECT 'MySQL权限管理系统数据表创建成功！' AS message;
SELECT '默认超级管理员账号：admin / 密码：admin123' AS default_account;
SELECT '默认普通用户账号：user / 密码：user123' AS default_user;

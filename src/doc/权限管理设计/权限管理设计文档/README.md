# MySQL权限管理系统设计

## 项目概述

这是一个基于RBAC (Role-Based Access Control) 模型的MySQL权限管理系统设计，用于实现用户、角色和权限的灵活管理。系统采用五表结构设计，支持细粒度的权限控制和灵活的角色分配。

## 表结构设计

### 1. 用户表 (users)
存储系统用户的基本信息，包括用户名、密码、邮箱等。

### 2. 角色表 (roles)
定义系统中的角色，如超级管理员、系统管理员、编辑等。

### 3. 权限表 (permissions)
定义系统中的权限项，支持不同类型的资源权限控制。

### 4. 用户角色关联表 (user_roles)
管理用户与角色的多对多关系。

### 5. 角色权限关联表 (role_permissions)
管理角色与权限的多对多关系。

## 系统特点

1. **基于RBAC模型**：采用行业标准的权限管理模型，易于理解和扩展
2. **细粒度权限控制**：支持页面、API、按钮、数据等不同级别的权限控制
3. **灵活的角色分配**：一个用户可以拥有多个角色，一个角色可以被多个用户拥有
4. **权限继承**：支持权限的父子关系，实现权限的层级管理
5. **状态管理**：支持用户和角色的状态管理，便于临时禁用账号或角色
6. **安全设计**：密码加密存储，支持最小权限原则

## 快速开始

### 1. 创建数据库和表结构

```sql
source mysql_permission_system.sql;
```

### 2. 默认账号

系统创建后会自动添加以下默认账号：

- 超级管理员：`admin` / 密码：`admin123`
- 普通用户：`user` / 密码：`user123`

### 3. 常用SQL操作

#### 查询用户拥有的所有权限

```sql
SELECT DISTINCT
    p.id, p.permission_code, p.permission_name, p.description, p.resource_type, p.resource_path
FROM
    users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
WHERE
    u.username = 'admin' -- 替换为实际用户名
    AND u.status = 'active'
    AND r.status = 'active';
```

#### 为用户分配角色

```sql
INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 2), -- 用户ID=1，角色ID=2
(1, 3); -- 用户ID=1，角色ID=3
```

#### 为角色分配权限

```sql
INSERT INTO role_permissions (role_id, permission_id)
VALUES
(2, 1), -- 角色ID=2，权限ID=1
(2, 2); -- 角色ID=2，权限ID=2
```

## 安全最佳实践

1. **密码安全**：
   - 使用SHA256或更强的哈希算法存储密码
   - 强制密码复杂度要求
   - 定期更新密码

2. **最小权限原则**：
   - 仅授予用户完成工作所需的最小权限
   - 避免使用`ALL PRIVILEGES`

3. **定期审计**：
   - 定期检查用户权限
   - 清理不再使用的用户和角色

4. **访问控制**：
   - 限制数据库访问来源IP
   - 使用HTTPS加密传输

5. **日志监控**：
   - 开启MySQL审计日志
   - 监控异常登录和权限变更

## 扩展性考虑

1. **数据权限**：
   - 可扩展增加数据权限表，实现行级数据访问控制

2. **组织架构**：
   - 可增加部门表、职位表，实现基于组织的权限管理

3. **权限继承**：
   - 可扩展实现角色继承功能，简化权限管理

4. **操作日志**：
   - 可增加权限操作日志表，记录所有权限变更历史

## 许可证

MIT

USE OnlineFoodDelivery;

INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_MANAGER');
INSERT INTO roles (name) VALUES ('ROLE_DELIVERY');
INSERT INTO roles (name) VALUES ('ROLE_CUSTOMER');

select * from users;
select * from user_roles, users, roles;